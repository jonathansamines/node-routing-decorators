import route from '../../lib/core/annotations/route';
import {httpPost} from '../../lib/core/annotations/methods';

@route()
export default class IndexController{

  @httpPost('/[action]/{user?}')
  home(user) {
    return `Hello to the user ${user}`;
  }

  @route()
  index() {
    return { message: 'this is the index.' };
  }

  @route()
  hello() {
    return 'This is hello world!!!';
  }
}
