import path from 'path';
import Hoek from 'hoek';
import DefaultFormatter from '../router/defaults';

const _routeDefaults = {
  method: 'GET'
};

/**
 * WebMethodAnnotation
 * Defines an function decorator, that allows define route metadata
 * @param  {Object} routeConfig An simple object with route configuration options as defined in hapi docs
 * @return {Function}           A function that build the route decorator
 */
export class HttpMethodAnnotation{
  constructor(routeConfig = {}) {
    // merge default options with routeConfig
    this.hapiRouteConfig = Hoek.applyToDefaults(_routeDefaults, routeConfig);
    this.formatter = new DefaultFormatter();
  }

  /**
   * Builder function for decorator, generally speaking this matchs with "Object.defineProperty" method definition
   * @param  {Object|Function} controller   Decorated class prototype ( at this point is empty )
   * @param  {String} propertyName          Method name, which would be used as method path
   * @param  {Object} descriptor            Configuration for method (as defined in Object.defineProperty)
   */
  resourceMethodBuilder(controller, propertyName, descriptor) {
    const _this = this;
    const routeMethod = descriptor.value;

    // verify if target is a function because webmethod annotation
    // is only allowed on class "method" definitions
    if (typeof routeMethod !== 'function') {
      throw new Error('HttpMethod is only allowed on method definitions. (regular javascript functions)');
    }

    // If there is no provided method path, then try to use propertyName as path
    let resourcePath = this.hapiRouteConfig.path || propertyName;
    resourcePath = this.hapiRouteConfig.path = this.formatter.methodPath(resourcePath);

    // Configuring hapi method handler, a raw hapi handler receives the params ( request, reply )
    // but we parse this to a function which params matches with request.params values
    // in the same order as defined in the route path
    this.hapiRouteConfig.handler = function handlerBuilder(request, reply) {
      routeMethod.prototype.request = request;
      routeMethod.prototype.reply = reply;

      const params = _this._getHandlerFunctionParams(resourcePath, request.params);
      const response = routeMethod.apply(routeMethod.prototype, params);

      if (response === undefined) return;
      reply(response);
    };

    routeMethod.prototype.bindResourceService = this.bindResourceService.bind(this);

    // set function as enumerable
    descriptor.enumerable = true;

    return descriptor;
  }

  /**
   * Created the hapi server route, resolving the route from "root" controller resource to handler path
   * @param  {Object} server   Hapi server instance
   * @param  {String} resource Local resource path
   */
  bindResourceService(server, resource) {
    // apply root controller resource path, to the relative path provided by method handler
    const routePath = path.join(resource, this.hapiRouteConfig.path);
    this.hapiRouteConfig.path = decodeURIComponent(routePath);

    if (this.hapiRouteConfig.path.length > 1) {
      this.hapiRouteConfig.path = this.hapiRouteConfig.path.replace(new RegExp('\/$'), '');
    }

    console.log('Route handler [%s] %s', this.hapiRouteConfig.method, this.hapiRouteConfig.path);

    server.route(this.hapiRouteConfig);
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
}
