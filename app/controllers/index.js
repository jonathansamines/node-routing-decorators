import WebController from '../../src/core/annotations/WebControllerAnnotation';
import WebMethod from '../../src/core/annotations/WebMethodAnnotation';
import resolver from '../../src/index';

@WebController({resolver, resource: '/'})
export default class IndexController{

  @WebMethod({ path: '/home/{user}/{test}', method: 'GET' })
  home(user, test) {
    this.reply(`Hello to the user ${user} with ${test}`);
  }
}
