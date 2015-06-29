import ActionAnnotation from './action';

export function httpMethod(params = {}) {
  const method = new ActionAnnotation(params);
  return method.resourceMethodBuilder.bind(method);
}

export function httpGet(params = {}) {
  params.method = 'GET';
  return httpMethod(params);
}

export function httpPost(params = {}) {
  params.method = 'POST';
  return httpMethod(params);
}

export function httpDelete(params = {}) {
  params.method = 'DELETE';
  return httpMethod(params);
}

export function httpPut(params = {}) {
  params.method = 'PUT';
  return httpMethod(params);
}
