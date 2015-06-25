import WebController from '../../src/core/annotations/WebControllerAnnotation';
import WebMethod from '../../src/core/annotations/WebMethodAnnotation';
import resolver from '../../src/index';

@WebController({resolver, resource: '/'})
export default class IndexController{

  @WebMethod({ path: '/home/{user?}', method: 'GET' })
  home(user, test) {
    this.reply(`Hello to the user ${user}`);
  }

  @WebMethod({ path: '/', method: 'GET' })
  index() {
    this.reply('This is the index.');
  }

  @WebMethod({ path: '/hello', method: 'GET' })
  hello() {
    this.reply('This is hello !!!');
  }
}
