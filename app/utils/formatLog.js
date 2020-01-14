const formatError = (ctx, err, costTime) => {
  let { method, url, request } = ctx;
  return {
    method,
    url,
    body: request.body,
    costTime,
    err
  }
}

const formatRes = (ctx, costTime) => {
  let { method, url, request, response } = ctx;
  return {
    method,
    url,
    body: request.body,
    costTime,
    response
  }
}

module.exports = {
  formatError,
  formatRes
}
