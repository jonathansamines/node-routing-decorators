import fs from 'fs';
import path from 'path';
import Router from '../core/router';

export default class RouteLoader{
  constructor(controllersPath) {
    this.router = new Router();
    this.controllersPath = controllersPath;

    if (!fs.existsSync(this.controllersPath)) throw new Error('The specified directory for controllers doesn´t exist. ' + this.controllersPath);
  }

  getControllers() {
    const _this = this;
    const controllersNames = fs.readdirSync(this.controllersPath);
    return controllersNames.map(function createPromiseLoadingByController(controller) {
      return require(path.join(_this.controllersPath, controller));
    });
  }

  bindControllers(onRouteBinding) {
    for (const Controller of this.getControllers()) {
      console.log(`Routes for Controller [${Controller.name}] at ${Controller.prototype.route}`);

      const controller = new Controller();
      this.router.mapControllerActions(controller, function mapRouteConfig(actionConfig, controllerPropertyName) {
        console.info(` - Method handler [${actionConfig.method}][${controllerPropertyName}] at ${actionConfig.path}`);
        onRouteBinding(actionConfig);
      });
    }
  }
}
