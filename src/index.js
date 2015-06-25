import WebController from './core/annotations/WebControllerAnnotation';
import WebMethod from './core/annotations/WebMethodAnnotation';
import Resolver from './core/resolver';

@WebController('/')
export default class IndexController{

  @WebMethod({ path: '/home/{user}/{test}', method: 'GET' })
  home(user, test) {
    this.reply(`Hello to the user ${user} with ${test}`);
  }
}

let resolver = new Resolver();
resolver.bindResources({
  port: 8000,
  host: 'localhost'
},
function handleServerStart() {
  console.log(`Server started at ${this.uri}`);
});

resolver.bindController(IndexController);
