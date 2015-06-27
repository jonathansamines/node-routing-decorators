/**
 * Defines the formatter for the default resource paths,
 * both for controller as with method resource paths
 */
export default class DefaultRoutingOptions{
  pathForController(resourcePath = '') {
    if (resourcePath.search('index') >= 0) {
      return '/';
    }
    return '/' + resourcePath;
  }

  pathForMethod(resourcePath = '') {
    if (resourcePath.search('index') >= 0) {
      return '/';
    }

    return resourcePath + '/';
  }
}
