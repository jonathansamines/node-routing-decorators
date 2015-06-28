import path from 'path';

/**
 * Defines the formatter for the default resource paths,
 * both for controller as with method resource paths
 */
export default class DefaultRoutingOptions{
  pathForController(Controller, resource) {
    if (typeof Controller !== 'function') {
      throw new Error('To apply routing conventions, the specified value has to be a function.');
    }

    // get a path based on a controller name
    let controllerNamePath;
    const normalizedControllerName = Controller.name.toLowerCase().replace('controller', '');
    if (this._hasDefaultRoute(normalizedControllerName)) {
      controllerNamePath = path.normalize('/');
    }else {
      controllerNamePath = path.normalize('/' + normalizedControllerName);
    }

    if (resource === undefined) {
      return controllerNamePath;
    }

    // normalize path based on a specified resource
    let controllerResourcePath = this.replaceControllerPlaceholders(resource, normalizedControllerName);
    controllerResourcePath = path.normalize(controllerResourcePath);

    return controllerResourcePath;
  }

  pathForMethod(resourcePath = '') {
    if (this._hasDefaultRoute(resourcePath)) {
      return '/';
    }

    return resourcePath + '/';
  }

  _hasDefaultRoute(resourcePath) {
    return resourcePath.search(/\/(index)\/?/i) >= 0;
  }

  replaceControllerPlaceholders(resource, normalizedControllerName) {
    return resource.replace(/\[(controller)\]/gi, normalizedControllerName);
  }

  replaceActionPlaceholders(resource, normalizedActionName) {
    return resource.replace(/\[(action)\]/gi, normalizedActionName);
  }
}
