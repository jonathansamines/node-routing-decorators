import Route from '../route';

/**
 * ControllerDecorator
 * Provides a declarative way of define a controller routing metadata
 * @param {String} route Root resource path for controller
 */
export default class ControllerDecorator{
  constructor({route}) {
    this.routePath = route;
    this.route = new Route();
  }

  /**
   * Configures the constructor function of the decorated class
   * @param  {Function} Controller Constructor function which is the class to be decorated
   */
  decorate(Controller) {
    if (typeof Controller !== 'function') {
      throw new Error('ControllerDecorator can only be used on Constructor functions.');
    }

    // resolve route path for controller, given the current context/convetions
    Controller.prototype.route = this.route.routeForController({
      routePath: this.routePath,
      controllerName: Controller.name
    });
  };
}
