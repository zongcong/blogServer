/*
* tags
* method，请求类型
* type，根据响应状态码分组，1xx -> 1, 2xx -> 2
* spdy，根据自定义的响应时间划分区间，方便将接口响应时间分组
* route，接口路由
*
* fields
* connecting，处理请求数
* use，处理时长
* bytes，响应数字长度
* code，响应状态码
* url，请求地址
* ip，用户IP
* */
const statistics = () => {
  let connecting = 0;
  const spdyList = [100, 300, 1000, 3000];
  return async (ctx, next) => {
    const start = Date.now();
    const tags = {
      method: ctx.method,
    };
    connecting++;
    const fields = {
      connecting,
      url: ctx.url,
    }
    let status = 0;
    try {
      await next();
    } catch (err) {
      // 出错时状态码从error中获取
      status = err.status;
      throw err;
    } finally {
      // 如果非出错，则从ctx中取状态码
      if (!status) {
        status = ctx.status;
      }
      const use = Date.now() - start;
      connecting--;
      tags.route = ctx._matchedRoute;
      tags.type = `${status / 100 | 0}`;
      let spdy = 0;
      // 确认处理时长所在区间
      spdyList.forEach((v, i) => {
        if (use > v) {
          spdy = i + 1;
        }
      });
      tags.spdy = `${spdy}`;

      fields.use = use;
      fields.bytes = ctx.length || 0;
      fields.code = status;
      fields.ip = ctx.ip;
      // 统计数据写入统计系统
      console.info(tags);
      console.info(fields);
    }
  };
}

module.exports = statistics;
