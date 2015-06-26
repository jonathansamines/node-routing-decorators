
/**
 * Defines the formatter for the default resource paths,
 * both for controller as with method resource paths
 */
export default class DefaulRouterParameters{
  controllerPath(resourcePath = '') {
    if (resourcePath.search('index') >= 0) {
      return '/';
    }
    return '/' + resourcePath;
  }

  methodPath(resourcePath = '') {
    if (resourcePath.search('index') >= 0) {
      return '/';
    }

    return resourcePath + '/';
  }
}
