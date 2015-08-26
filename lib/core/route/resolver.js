import path from 'path';

/**
 * RouteResolver
 * Defines the formatter for the default resource paths,
 * both for controller as with method resource paths
 */
export default class RouteResolver{
  pathForController(controllerName, resource) {
    // get a path based on a controller name
    let controllerNamePath;
    const normalizedControllerName = controllerName.toLowerCase().replace('controller', '');
    if (this._hasDefaultRouteName(normalizedControllerName)) {
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

  pathForAction(propertyName, resource) {
    let actionPath;
    if (this._hasDefaultRouteName(propertyName)) {
      actionPath = path.normalize('/');
    }else {
      actionPath = path.normalize('/' + propertyName);
    }

    if (resource === undefined) {
      return actionPath;
    }

    let resourcePath = this.replaceActionPlaceholders(resource, propertyName);
    resourcePath = path.normalize(resourcePath);

    return resourcePath;
  }

  _hasDefaultRoute(resourcePath) {
    return /\/(index)\/?/i.test(resourcePath);
  }

  _hasDefaultRouteName(controllerName) {
    return /(index)/i.test(controllerName);
  }

  replaceControllerPlaceholders(resource, normalizedControllerName) {
    return resource.replace(/\[(controller)\]/gi, normalizedControllerName);
  }

  replaceActionPlaceholders(resource, normalizedActionName) {
    return resource.replace(/\[(action)\]/gi, normalizedActionName);
  }
}
