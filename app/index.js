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
router.mapControllerActions(IndexController, function mapRouteConfig(actionConfig) {
  server.route(actionConfig);
});

export default router;
