import ActionAnnotation from './action';

export function httpMethod(routePath, method) {
  const action = new ActionAnnotation({routePath, method});
  return function buildActionAnnotation(...args) {
    return action.decorate.apply(action, args);
  };
}

export function httpGet(routePath) {
  return httpMethod(routePath, 'GET');
}

export function httpPost(routePath) {
  return httpMethod(routePath, 'POST');
}

export function httpDelete(routePath) {
  return httpMethod(routePath, 'DELETE');
}

export function httpPut(routePath) {
  return httpMethod(routePath, 'PUT');
}
