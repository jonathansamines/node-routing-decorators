import controller from '../../src/core/annotations/controller';
import {httpGet, httpMethod, httpPost} from '../../src/core/annotations/methods';
import resolver from '../../src/index';

@controller({resolver})
export default class IndexController{

  @httpMethod({ path: '/home/{user?}' })
  home(user) {
    this.reply(`Hello to the user ${user}`);
  }

  @httpGet()
  index() {
    this.reply('This is the index.');
  }

  @httpPost()
  hello() {
    this.reply('This is hello !!!');
  }
}
