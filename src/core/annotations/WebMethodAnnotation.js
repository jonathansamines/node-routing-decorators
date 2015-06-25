import url from 'url';
import Hoek from 'hoek';

let _routeDefaults = {
  method: 'GET'
};

/**
 * WebMethodAnnotation
 * Defines an function decorator, that allows define route metadata
 * @param  {Object} routeConfig An simple object with route configuration options as defined in hapi docs
 * @return {Function}           A function that build the route decorator
 */
export default function WebMethodAnnotation(routeConfig = {}) {
  if (routeConfig.path === undefined) {
    throw new Error('Route path is mandatory for configuring this method.');
  }

  // merge default options with routeConfig
  let hapiRouteConfig = Hoek.applyToDefaults(_routeDefaults, routeConfig);

  return resourceMethodBuilder.bind({ hapiRouteConfig });
}

/**
 * Builder function for decorator, generally speaking this matchs with "Object.defineProperty" method definition
 * @param  {Object|Function} controller   Decorated class prototype ( at this point is empty )
 * @param  {String} propertyName          Method name, which would be used as method path
 * @param  {Object} descriptor            Configuration for method (as defined in Object.defineProperty)
 */
function resourceMethodBuilder(controller, propertyName, descriptor) {
  let resourcePath = this.hapiRouteConfig.path;
  let routeMethod = descriptor.value;

  // verify if target is a function because webmethod annotation
  // is only allowed on class "method" definitions
  if (typeof routeMethod !== 'function') {
    throw new Error('WebMethodAnnotation is only allowed on method definitions. (regular javascript functions)');
  }

  // Configuring hapi method handler, a raw hapi handler receives to params ( request, reply )
  // but we parse this to a function which params matches with request.params values
  // in the same order as defined in the route path
  this.hapiRouteConfig.handler = function handlerBuilder(request, reply) {
    routeMethod.prototype.request = request;
    routeMethod.prototype.reply = reply;

    let params = _getHandlerFunctionParams.call(null, resourcePath, request.params);
    routeMethod.apply(routeMethod.prototype, params);
  };

  routeMethod.prototype.bindResourceService = bindResourceService.bind(this);

  // set function as enumerable
  descriptor.enumerable = true;

  return descriptor;
}

/**
 * Created the hapi server route, resolving the route from "root" controller resource to handler path
 * @param  {Object} server   Hapi server instance
 * @param  {String} resource Local resource path
 */
function bindResourceService(server, resource) {
  // apply root controller resource path, to the relative path provided by method handler
  this.hapiRouteConfig.path = decodeURIComponent(url.resolve(resource, this.hapiRouteConfig.path));

  server.route(this.hapiRouteConfig);
}

/**
 * Get the final handler function params, it uses "config.path", and the object returned by hapi
 * request.params to match each value and conserve the original order of parameters
 * @param  {Object} params HapiJS request.params object
 * @return {Array}         Ordered list of path parameter values
 */
function _getHandlerFunctionParams(path, params) {
  let getParametersExpression = /(?!\/){[\w\-\*]+}(?!\/)?/gi;
  let parameters = [];

  let pathParameters = getParametersExpression.exec(path);
  while(pathParameters !== null) {

    // generate parameter list in the same order as parameter definition in path
    for (let parameter of pathParameters) {
      let propertyName = parameter.replace(new RegExp('[{}]', 'gi'), '');
      let parameterValue = params[propertyName];
      parameters.push(parameterValue);
    }

    pathParameters = getParametersExpression.exec(path);
  }

  return parameters;
}
