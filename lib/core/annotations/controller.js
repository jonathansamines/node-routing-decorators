import DefaultRoutingOptions from '../router/defaults';

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

    this.resource = resource;
    this.resolver = resolver;
    this.routing = new DefaultRoutingOptions();
  }

  /**
   * Configures the constructor function of the decorated class
   * @param  {Function} Controller Constructor function which is the class to be decorated
   */
  resourceControllerBuilder(Controller) {
    if (typeof Controller !== 'function') {
      throw new Error('The decorated member should be a Constructor function.');
    }

    // set passed route as root resource for controller, if no resource path is provided
    // then try to use the Controller constructor name
    const normalizedControllerName = this.routing.pathForController(Controller.name.toLowerCase().replace('controller', ''));
    Controller.prototype.resource = this.resource || normalizedControllerName;

    // bind controller
    this.resolver(Controller);
  };
}

export default function buildControllerDecorator(params) {
  const controller = new WebControllerAnnotation(params);
  return controller.resourceControllerBuilder.bind(controller);
}
