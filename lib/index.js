import Router from './core/router';

const router = new Router({
  connections: {
    router: {
      stripTrailingSlash: true
    }
  }
});

// start the resolver server
router.bindResources({
  port: 8000,
  host: 'localhost'
},
function handleServerStart() {
  console.log(`Server started at ${this.uri}`);
});

export default router.bindController.bind(router);
