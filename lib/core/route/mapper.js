/**
 * RouterResolver
 * Bind a valid hapi server to a specified controller
 */
export default class RouteMapper{

  /**
   * Resolve all valid controller methods and resolves their respective valid routes
   * @param {Controller} Controller constructor function
   */
  mapControllerActions(controller, mapControllerConfig) {
    for (const controllerPropertyName in controller) {
      // ignore non function properties on controller
      const controllerPropertyValue = controller[controllerPropertyName];
      if (typeof controllerPropertyValue !== 'function') {
        continue;
      }

      // ignore non valid controller methods ( non http handlers )
      // if a function is a valid handler, then in its prototype has the method "getMethodRouteConfig"
      // since it was added by HttpMethod decorator
      // if (typeof controllerPropertyValue.prototype.getMethodRouteConfig === undefined) {
      //   continue;
      // }

      // resolve method path
      // const methodRouteConfig = controllerPropertyValue.prototype.getMethodRouteConfig(controller.route);
      // asign the method router configuration to a valid hapi server route
      mapControllerConfig(controllerPropertyValue.route, controllerPropertyName);
    }
  }
}
