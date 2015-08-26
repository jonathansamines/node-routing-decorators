import Route from '../route';

/**
 * ActionDecorator
 * Defines an function decorator, that allows define route metadata
 * @param  {String} route Route path relative to current controller
 * @param  {String} method Method used to request the resource
 */
export default class ActionDecorator{
  constructor({route, method}) {
    this.routePath = route;
    this.httpMethod = method;
    this.route = new Route();
  }

  /**
   * Builder function for decorator, generally speaking this matchs with "Object.defineProperty" method definition
   * @param  {Object|Function} controller   Decorated class prototype ( at this point is empty )
   * @param  {String} propertyName          Method name, which would be used as method path
   * @param  {Object} descriptor            Configuration for method (as defined in Object.defineProperty)
   */
  decorate(controller, propertyName, descriptor) {
    const method = descriptor.value;

    // verify if target is a function because webmethod annotation
    // is only allowed on class "method" definitions
    if (typeof method !== 'function') {
      throw new Error('ActionDecorator is only allowed to be used on Class methods.');
    }

    // If there is no provided method path, then try to use propertyName as path
    method.route = this.route.routeForAction({
      routePath: this.routePath,
      method: this.httpMethod,
      actionName: propertyName
    });

    // set function as enumerable
    descriptor.enumerable = true;

    return descriptor;
  }
}
