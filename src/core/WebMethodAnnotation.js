import url from 'url';
import Hoek from 'hoek';

let _routeDefaults = {
  method: 'GET'
};

/**
 * WebMethodAnnotation
 * Defines an function decorator, that allows define route metadata
 */
class WebMethodAnnotation{

  /**
   * Build a new instance of WebMethodAnnotation class
   * @param  {Object} routeConfig An simple object with route configuration options as defined in hapi docs
   * @return {Function}           A function that build the route decorator
   */
  constructor(routeConfig = {}) {
    if (routeConfig.path === undefined) {
      throw new Error('Route path is mandatory for configuring this method.');
    }

    // merge default options with routeConfig
    this.config = Hoek.applyToDefaults(_routeDefaults, routeConfig);
  }

  /**
   * Builder function for decorator, generally speaking this matchs with "Object.defineProperty" method definition
   * @param  {Object|Function} target       Should be a function, which would be the hapi method handler
   * @param  {String} propertyName          Method name, which would be used as method path
   * @param  {Object} descriptor            Configuration for method (as defined in Object.defineProperty)
   */
  buildRouteMethod(controller, propertyName, descriptor) {
    let _this = this;
    let routeMethod = descriptor.value;

    // verify if target is a function because webmethod annotation
    // is only allowed on class "method" definitions
    if (typeof routeMethod !== 'function') {
      throw new Error('WebMethodAnnotation is only allowed on method definitions. (aka regular javascript functions)');
    }

    // Configuring hapi method handler, a raw hapi handler receives to params ( request, reply )
    // but we parse this to a function which params matches with request.params values
    // in the same order as defined in the route path
    this.config.handler = function handlerBuilder(request, reply) {
      routeMethod.prototype.request = request;
      routeMethod.prototype.reply = reply;

      let params = _this.__getHandlerFunctionParams(request.params);
      routeMethod.apply(routeMethod.prototype, params);
    };

    routeMethod.prototype.bindRouteMethod = this.bindRouteMethod.bind(this);
  }

  bindRouteMethod(resource, server) {
    // apply root controller resource path, to the relative path provided by method handler
    this.config.path = url.resolve(resource, this.config.path);

    server.route(this.config);
  }

  /**
   * Get the final handler function params, it uses "config.path", and the object returned by hapi
   * request.params to match each value and conserve the original order of parameters
   * @param  {Object} params HapiJS request.params object
   * @return {Array}         Ordered list of path parameter values
   */
  __getHandlerFunctionParams(params) {
    let getParametersExpression = /(?!\/){[\w\-\*]+}(?!\/)?/gi;
    let parameters = [];

    let pathParameters = getParametersExpression.exec(this.config.path);
    while(pathParameters !== null) {

      // generate parameter list in the same order as parameter definition in path
      for (let parameter of pathParameters) {
        let propertyName = parameter.replace(new RegExp('[{}]', 'gi'), '');
        let parameterValue = params[propertyName];
        parameters.push(parameterValue);
      }

      pathParameters = getParametersExpression.exec(this.config.path);
    }

    return parameters;
  }
}

export default function buildWebMethodAnnotation(config) {
  let webMethod = new WebMethodAnnotation(config);
  return webMethod.buildRouteMethod.bind(webMethod);
}
