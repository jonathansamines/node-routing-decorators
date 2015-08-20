import Hapi from 'hapi';
import Router from '../lib/core/router';
import IndexController from './controllers/index';

const server = new Hapi.Server({
  connections: {
    router: {
      stripTrailingSlash: true
    }
  }
});

server.connection({
  port: 8000,
  host: 'localhost'
});

server.start(function handlerServerStart() {
  console.log(`Server started at : ${server.info.uri}`);
});

const router = new Router();
const controller = new IndexController();
console.log(`Routes for Controller [${IndexController.name}] at ${IndexController.prototype.route}`);
router.mapControllerActions(controller, function mapRouteConfig(actionConfig, controllerPropertyName) {
  console.info(` - Method handler [${actionConfig.method}][${controllerPropertyName}] at ${actionConfig.path}`);
  server.route(actionConfig);
});

export default router;
