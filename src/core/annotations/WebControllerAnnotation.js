/**
 * WebControllerAnnotation
 * Provides a declarative way of define a controller metadata
 * @param {String} root resource path
 */
export default function WebControllerAnnotation({ resolver, resource }) {

  if (resolver === undefined) {
    throw new Error('The route resolver is needed for expose this controller as a web handler.');
  }

  if (resource === undefined) {
    throw new Error('A resource path is required.');
  }

  /**
   * Configures the constructor function of the decorated class
   * @param  {Function} Controller Constructor function which defines the class to be decorate
   */
  return function resourceConfigurationBuilder(Controller) {
    if (typeof Controller !== 'function') {
      throw new Error('The decorated member should a Constructor function.');
    }

    // set passed route as root resource for controller
    Controller.prototype.resource = resource;

    // bind controller
    resolver(Controller);
  }
}
