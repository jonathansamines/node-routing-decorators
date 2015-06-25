import Resolver from './core/resolver';

let resolver = new Resolver();

// start the resolver server
resolver.bindResources({
  port: 8000,
  host: 'localhost'
},
function handleServerStart() {
  console.log(`Server started at ${this.uri}`);
});

export default resolver.bindController.bind(resolver);
