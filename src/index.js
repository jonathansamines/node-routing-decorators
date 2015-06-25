import Hapi from 'hapi';

import WebController from './core/WebControllerAnnotation';
import WebMethod from './core/WebMethodAnnotation';

@WebController('/')
class IndexController{
  
  @WebMethod({ path: '/home/{user}/{test}', method: 'GET' })
  home(user, test) {
    this.reply(`Hello to the user ${user} with ${test}`);
  }
}

let server = new Hapi.Server();
server.connection({
  port: 8000,
  host: 'localhost'
});

server.start(function handleServerStart() {
  console.log(`Server started at localhost:8000`);
});


let index = new IndexController();
index.home.prototype.bindResourceService(server, index.resource);

export default IndexController;
