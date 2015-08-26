import path from 'path';
import Hapi from 'hapi';
import RouteLoader from '../lib/loader';

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

const loader = new RouteLoader(path.join(__dirname, './controllers'));
loader.bindControllers(function onRouteBinding(actionConfig) {
  actionConfig.handler = function() {};
  server.route(actionConfig);
});

server.start(function handlerServerStart() {
  console.log(`Server started at : ${server.info.uri}`);
});
