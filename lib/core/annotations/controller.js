import DefaultRoutingOptions from '../router/defaults';

/**
 * WebControllerAnnotation
 * Provides a declarative way of define a controller metadata
 * @param {String} root resource path
 */
export class WebControllerAnnotation{

  constructor({ resolver, resource }) {
    if (resolver === undefined) {
      throw new Error('The route resolver is needed for expose this controller as a web handler.');
    }

    this.resource = resource;
    this.resolver = resolver;
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
    Controller.prototype.resource = this.routing.pathForController(Controller, this.resource);

    // bind controller
    this.resolver.resolveControllerRoutes(Controller);
  };
}
