import RouteResolver from './resolver';
// import RouteHandler from './handler';

/**
 * Route
 * Generates the route configuration for a given action or controller
 */
export default class Route{
  constructor() {
    this.resolver = new RouteResolver();
  }

  routeForAction({routePath, method, actionName}) {
    // const routeHandler = new RouteHandler(method, routePath);
    const route = {};

    // route.handler = routeHandler.getHandler();
    route.method = method;
    route.path = this.resolver.pathForAction(actionName, routePath);

    return route;
  }

  routeForController({routePath, controllerName}) {
    const route = {};
    route.path = this.resolver.pathForController(controllerName, routePath);

    return route;
  }
}
