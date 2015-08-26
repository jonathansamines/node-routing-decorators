import ParamParser from './params';

/**
 * Configuring hapi method handler, a raw hapi handler receives the params ( request, reply )
 * but we parse this to a function which params matches with request.params values
 * in the same order as defined in the route path
 */
export default class RouteHandler{
  constructor(method, route) {
    this.method = method;
    this.route = route;
    this.params = new ParamParser();
  }

  getHandler() {
    const _this = this;
    return function buildParameterHandler(request, reply) {
      _this.method.prototype.route = _this.route;
      _this.method.prototype.request = request;
      _this.method.prototype.reply = reply;

      const params = _this.params.getActionParameters(_this.route, request.params);
      const response = _this.method.apply(_this.method, params);

      // a response object is mandatory (any value is allowed)
      if (response === undefined || response === null) {
        throw new Error('No response object returned by handler.');
      }

      // if returned value is a response object only return, for any other value
      // response with a 200 header as success value
      if (typeof response.code === 'function') {
        return response;
      }

      return reply(response);
    };
  };
}
