import route from '../../lib/core/annotations/route';

@route()
export default class IndexController{

  @route({ path: '/[action]/{user?}' })
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
