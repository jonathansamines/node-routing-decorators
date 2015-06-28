import Hapi from 'hapi';
import Router from './core/router';

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

const router = new Router(server);

export default router;
