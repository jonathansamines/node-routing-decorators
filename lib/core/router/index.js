/**
 * RouterResolver
 * Bind a valid hapi server to a specified controller
 */
export default class RouteResolver{
  constructor(server) {
    if (server === undefined) {
      throw new Error('A hapiJS server needs to be specified.');
    }

    this.server = server;
  }

  /**
   * Resolve all valid controller methods and resolves their respective valid routes
   * @param {Controller} Controller constructor function
   */
  resolveControllerRoutes(Controller) {
    console.log(`Routes for Controller [${Controller.name}] at ${Controller.prototype.resource}`);

    for (const controllerPropertyName in Controller.prototype) {
      if (!Controller.prototype.hasOwnProperty(controllerPropertyName)) {
        continue;
      }

      // ignore non function properties on controller
      const controllerPropertyValue = Controller.prototype[controllerPropertyName];
      if (typeof controllerPropertyValue !== 'function') {
        continue;
      }

      // ignore non valid controller methods ( non http handlers )
      // if a function is a valid handler, then in its prototype has the method "getMethodRouteConfig"
      // since it was added by HttpMethod decorator
      if (typeof controllerPropertyValue.prototype.getMethodRouteConfig === undefined) {
        continue;
      }

      // resolve method path
      const methodRouteConfig = controllerPropertyValue.prototype.getMethodRouteConfig(Controller.prototype.route);

      // asign the method router configuration to a valid hapi server route
      console.info(` - Method handler [${methodRouteConfig.method}][${controllerPropertyName}] at ${methodRouteConfig.path}`);
      this.server.route(methodRouteConfig);
    }
  }
}
