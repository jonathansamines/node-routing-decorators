import ControllerAnnotation from './controller';
import ActionAnnotation from './action';

/**
 * RouteDecorator
 * Generic decorator which allow decorate both Class as
 * Class methods signatures, to describe route metadata
 * @params {Object} params Decorator construction parameters
 */
export default function RouteDecorator(routePath) {
  /**
   * Builder function which creates a Class or a method decorator based on
   * the number of parameters being provided by the native construction
   * This function could have two different signatures
   * Class signature:
   *  - Controller constructor function
   * Class method signature
   *  - Class prototype
   *  - propertyName, the name of the property being decorated
   *  - descriptor, metadata to modify the new property behaviour
   */
  return function buildRouteDecorator(...args) {
    // Class signature
    if (args.length === 1) {
      const controller = new ControllerAnnotation({
        routePath
      });
      return controller.decorate.apply(controller, args);

    // Class method signature
    }else if (args.length === 3) {
      const method = new ActionAnnotation({
        routePath,
        method: '*'
      });
      return method.decorate.apply(method, args);
    }

    // if no arguments number recognized
    throw new Error('RouteAnnotation signature call not recognized.');
  };
}
