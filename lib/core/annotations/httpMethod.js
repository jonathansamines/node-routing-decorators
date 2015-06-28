import path from 'path';
import RoutingOptions from '../router/defaults';

/**
 * WebMethodAnnotation
 * Defines an function decorator, that allows define route metadata
 * @param  {Object} routeConfig An simple object with route configuration options as defined in hapi docs
 * @return {Function}           A function that build the route decorator
 */
export class HttpMethodAnnotation{
  constructor(routeConfig = {}) {
    this.routeConfig = routeConfig;
    this.routing = new RoutingOptions();
  }

  /**
   * Builder function for decorator, generally speaking this matchs with "Object.defineProperty" method definition
   * @param  {Object|Function} controller   Decorated class prototype ( at this point is empty )
   * @param  {String} propertyName          Method name, which would be used as method path
   * @param  {Object} descriptor            Configuration for method (as defined in Object.defineProperty)
   */
  resourceMethodBuilder(controller, propertyName, descriptor) {
    const method = descriptor.value;

    // verify if target is a function because webmethod annotation
    // is only allowed on class "method" definitions
    if (typeof method !== 'function') {
      throw new Error('HttpMethod is only allowed on method definitions. (regular javascript functions)');
    }

    // If there is no provided method path, then try to use propertyName as path
    this.routeConfig.path = this.routing.pathForMethod(propertyName, this.routeConfig.path);

    // set the http handler for this route
    this.routeConfig.handler = this._hapiHandlerBuilder.bind(this, method, this.routeConfig.path);

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
    const routePath = path.join(controllerResource, this.routeConfig.path);
    this.routeConfig.path = decodeURIComponent(routePath);

    // normalize trailing slash ( drop last slash, if not the only character)
    if (this.routeConfig.path.length > 1) {
      this.routeConfig.path = this.routeConfig.path.replace(new RegExp('\/$'), '');
    }

    return this.routeConfig;
  }

  /**
   * Get the final handler function params, it uses "config.path", and the object returned by hapi
   * request.params to match each value and conserve the original order of parameters
   * @param  {String} pathName  Relative pathname of the resource
   * @param  {Object} params    HapiJS request.params object
   * @return {Array}            Ordered list of path parameter values
   */
  _getHandlerFunctionParams(pathName, params) {
    const getParametersExpression = /(?!\/){[\w-*?]+}(?!\/)?/gi;
    const parameters = [];

    let pathParameters = getParametersExpression.exec(pathName);
    while (pathParameters !== null) {
      // generate parameter list in the same order as parameter definition in path
      for (const parameter of pathParameters) {
        const propertyName = parameter.replace(new RegExp('[{}*?]', 'gi'), '');
        const parameterValue = params[propertyName];

        parameters.push(parameterValue);
      }

      pathParameters = getParametersExpression.exec(pathName);
    }

    return parameters;
  }

  /**
   * Configuring hapi method handler, a raw hapi handler receives the params ( request, reply )
   * but we parse this to a function which params matches with request.params values
   * in the same order as defined in the route path
   */
  _hapiHandlerBuilder(method, resourcePath, request, reply) {
    method.prototype.request = request;
    method.prototype.reply = reply;

    const params = this._getHandlerFunctionParams(resourcePath, request.params);
    const response = method.apply(method.prototype, params);

    if (response === undefined) return;
    reply(response);
  };
}
