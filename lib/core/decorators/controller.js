import Route from '../route';

/**
 * ControllerDecorator
 * Provides a declarative way of define a controller routing metadata
 * @param {String} route Root resource path for controller
 */
export default class ControllerDecorator{
  constructor({route}) {
    this.routePath = route;
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
    const route = new Route();
    Controller.prototype.route = route.routeForController({
      routePath: this.routePath,
      controllerName: Controller.name
    });
  };
}
