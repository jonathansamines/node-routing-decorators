import DefaultRoutingOptions from '../router/defaults';

/**
 * ControllerDecorator
 * Provides a declarative way of define a controller routing metadata
 * @param {Object} resolver Route resolver
 * @param {String} resource Root resource path for controller
 */
export default class ControllerDecorator{

  constructor(route) {
    this.route = route;
    this.routing = new DefaultRoutingOptions();
  }

  /**
   * Configures the constructor function of the decorated class
   * @param  {Function} Controller Constructor function which is the class to be decorated
   */
  createDecorator(Controller) {
    if (typeof Controller !== 'function') {
      throw new Error('The decorated member should be a Constructor function.');
    }

    // normalize the controller name, and configure default routing conventions
    // if a resource path is specified then resource path takes precedence over routing conventions
    Controller.prototype.route = this.routing.pathForController(Controller, this.route);
  };
}
