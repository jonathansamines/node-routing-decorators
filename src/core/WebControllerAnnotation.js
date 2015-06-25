
class WebControllerAnnotation{
  constructor(route) {
    this.route = route;
  }

  buildRouteConstructor(Controller) {
    // set passed route as root resource for controller
    Controller.prototype.resource = this.route;
  }
}

export default function buildWebControllerAnnotation(route) {
  let webController = new WebControllerAnnotation(route);
  return webController.buildRouteConstructor.bind(webController);
}
