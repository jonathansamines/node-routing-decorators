/**
 * Defines the formatter for the default resource paths,
 * both for controller as with method resource paths
 */
export default class DefaultRoutingOptions{
  pathForController(resourcePath = '') {
    if (this._hasDefaultRoute(resourcePath)) {
      return '/';
    }

    return '/' + resourcePath;
  }

  pathForMethod(resourcePath = '') {
    if (this._hasDefaultRoute(resourcePath)) {
      return '/';
    }

    return resourcePath + '/';
  }

  _hasDefaultRoute(path) {
    return path.search(/(index)\/?/i) >= 0;
  }
}
