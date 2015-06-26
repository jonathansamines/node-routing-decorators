import Controller from '../../src/core/annotations/controller';
import HttpMethod from '../../src/core/annotations/httpMethod';
import resolver from '../../src/index';

@Controller({resolver, resource: '/'})
export default class IndexController{

  @HttpMethod({ path: '/home/{user?}', method: 'GET' })
  home(user, test) {
    this.reply(`Hello to the user ${user}`);
  }

  @HttpMethod({ path: '/', method: 'GET' })
  index() {
    this.reply('This is the index.');
  }

  @HttpMethod({ path: '/hello', method: 'GET' })
  hello() {
    this.reply('This is hello !!!');
  }
}
