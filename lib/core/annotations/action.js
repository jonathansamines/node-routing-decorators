import path from 'path';
import Hoek from 'hoek';
import RouteHandler from '../router/handler';
import RoutingOptions from '../router/defaults';

const routeDefaults = {
  method: '*'
};

/**
 * ActionAnnotation
 * Defines an function decorator, that allows define route metadata
 * @param  {String} route Route path relative to current controller
 */
export default class ActionAnnotation{
  constructor(route) {
    this.route = route;
    this.routing = new RoutingOptions();
  }

  /**
   * Builder function for decorator, generally speaking this matchs with "Object.defineProperty" method definition
   * @param  {Object|Function} controller   Decorated class prototype ( at this point is empty )
   * @param  {String} propertyName          Method name, which would be used as method path
   * @param  {Object} descriptor            Configuration for method (as defined in Object.defineProperty)
   */
  createDecorator(controller, propertyName, descriptor) {
    const method = descriptor.value;

    // verify if target is a function because webmethod annotation
    // is only allowed on class "method" definitions
    if (typeof method !== 'function') {
      throw new Error('HttpMethod is only allowed on method definitions. (regular javascript functions)');
    }

    // If there is no provided method path, then try to use propertyName as path
    this.route = this.routing.pathForMethod(propertyName, this.route);

    // set the http handler for this route
    const handler = new RouteHandler(method, this.route);
    this.handler = handler.getHandler();

    method.prototype.getMethodRouteConfig = this.getMethodRouteConfig.bind(this);

    // set function as enumerable
    descriptor.enumerable = true;

    return descriptor;
  }

  /**
   * Created the hapi server route, resolving the route from "root" controller resource to handler path
   * @param  {String} controllerResource Local resource path
   */
  getMethodRouteConfig(controllerResource) {
    // apply root controller resource path, to the relative path provided by method handler
    // normalize and resolve this method relative path based on controllerResource path
    let routeConfig = {};
    const actionPath = path.join(controllerResource, this.route);
    routeConfig.path = decodeURIComponent(actionPath);

    // normalize trailing slash ( drop last slash, if not the only character)
    if (routeConfig.path.length > 1) {
      routeConfig.path = routeConfig.path.replace(new RegExp('\/$'), '');
    }

    // apply default options
    routeConfig.handler = this.handler;
    routeConfig = Hoek.applyToDefaults(routeDefaults, routeConfig);

    return routeConfig;
  }
}
