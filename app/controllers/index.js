import controller from '../../src/core/annotations/controller';
import {httpGet} from '../../src/core/annotations/methods';
import resolver from '../../src/index';

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
