/**
 * WebControllerAnnotation
 * Provides a declarative way of define a controller metadata
 * @param {String} root resource path
 */
class WebControllerAnnotation{

  constructor({ resolver, resource }) {
    if (resolver === undefined) {
      throw new Error('The route resolver is needed for expose this controller as a web handler.');
    }

    if (resource === undefined) {
      throw new Error('A resource path is required.');
    }

    this.resource = resource;
    this.resolver = resolver;
  }

  /**
   * Configures the constructor function of the decorated class
   * @param  {Function} Controller Constructor function which is the class to be decorated
   */
  resourceControllerBuilder(Controller) {
    if (typeof Controller !== 'function') {
      throw new Error('The decorated member should be a Constructor function.');
    }

    // set passed route as root resource for controller
    Controller.prototype.resource = this.resource;

    // bind controller
    this.resolver(Controller);
  };
}

export default function buildControllerDecorator(params) {
  const controller = new WebControllerAnnotation(params);
  return controller.resourceControllerBuilder.bind(controller);
}
