import controller from '../../lib/core/annotations/controller';
import {httpGet} from '../../lib/core/annotations/methods';
import resolver from '../index';

@controller({resolver})
export default class IndexController{

  @httpGet({ path: '/home/{user?}' })
  home(user) {
    return `Hello to the user ${user}`;
  }

  @httpGet()
  index() {
    return { message: 'this is the index.' };
  }

  @httpGet()
  hello() {
    return 'This is hello world!!!';
  }
}
