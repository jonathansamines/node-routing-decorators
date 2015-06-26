import controller from '../../src/core/annotations/controller';
import httpMethod from '../../src/core/annotations/httpMethod';
import resolver from '../../src/index';

@controller({resolver, resource: '/'})
export default class IndexController{

  @httpMethod({ path: '/home/{user?}', method: 'GET' })
  home(user) {
    this.reply(`Hello to the user ${user}`);
  }

  @httpMethod({ method: 'GET' })
  index() {
    this.reply('This is the index.');
  }

  @httpMethod({ path: '/hello', method: 'GET' })
  hello() {
    this.reply('This is hello !!!');
  }
}
