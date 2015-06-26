import Hapi from 'hapi';

export default class RouteResolver{

  constructor(hapiConfig = {}) {
    this.server = new Hapi.Server(hapiConfig);
  }

  bindResources(serverConfig = {}, callback) {
    this.server.connection(serverConfig);

    this.server.start(callback.bind(this.server.info));
  }

  bindController(Controller) {
    for (const controllerMethodName in Controller.prototype) {
      if (!Controller.prototype.hasOwnProperty(controllerMethodName)) {
        continue;
      }

      const controllerMethod = Controller.prototype[controllerMethodName];

      // ignores properties
      if (typeof controllerMethod !== 'function') {
        continue;
      }

      Controller.prototype[controllerMethodName].prototype.bindResourceService(this.server, Controller.prototype.resource);
    }
  }
}
