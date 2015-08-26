/**
 * RouteParams
 * Parse the default handler params, into a function params
 */
export default class RouteParams{

  /**
   * Get the final handler function params using an params object
   * which is used to match each value and conserve the original order of parameters
   * @param  {String} pathName  Relative pathname of the resource
   * @param  {Object} params    HapiJS request.params object
   * @return {Array}            Ordered list of path parameter values
   */
  getActionParameters(pathName, params) {
    const getParametersExpression = /(?!\/){[\w-*?]+}(?!\/)?/gi;
    const parameters = [];

    let pathParameters = getParametersExpression.exec(pathName);
    while (pathParameters !== null) {
      // generate parameter list in the same order as parameter definition in path
      for (const parameter of pathParameters) {
        const propertyName = parameter.replace(new RegExp('[{}*?]', 'gi'), '');
        const parameterValue = params[propertyName];

        parameters.push(parameterValue);
      }

      pathParameters = getParametersExpression.exec(pathName);
    }

    return parameters;
  }
}
