const Koa = require('koa');
// https://github.com/zadzbw/koa2-cors#readme
const cors = require('koa2-cors');

const mongoose = require('mongoose');

// https://www.npmjs.com/package/koa-bodyparser
const bodyParser = require('koa-bodyparser');

const app = new Koa();

require('module-alias/register');

const {port, db, whiteList} = require('@root/config');
const log4js = require('@root/app/utils/log4');
// 性能统计
const statistics = require('@root/app/middleware/perStatistics');

mongoose.set('useUnifiedTopology', true);

mongoose.connect(db, {useNewUrlParser: true}, err => {
  if (err) {
    console.error('链接数据库失败');
  } else {
    console.log('链接数据库成功');
  }
});

app.use(
  cors({
    origin: (ctx) => {
      // 允许白名单可跨域
      let reqOrigin = ctx.request.header.origin; // 前端发送请求的请求头部的 origin
      let ctxOrigin = ctx.origin; // 后台服务本地服务器域名
      return ctxOrigin !== reqOrigin && whiteList.includes(reqOrigin) ? reqOrigin : 'http://localhost:8080';
    },
    /*
    CORS 请求时，XMLHttpRequest 对象的 getResponseHeader() 方法只能拿到6个基本字段：
        Cache-Control、
        Content-Language、
        Content-Type、
        Expires、
        Last-Modified、
        Pragma。
    */
    // 需要获取其他字段时，使用 Access-Control-Expose-Headers，
    // getResponseHeader('myData')可以返回我们所需的值
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
    // 当请求方法是 PUT 或 DELETE 等特殊方法或者 Content-Type 字段的类型是 application/json 时，服务器会提前发送一次请求进行验证
    // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
    maxAge: 300,
    // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie 不包括在 CORS 请求之中。
    // 当设置成允许请求携带 cookie 时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
    credentials: true,
    // 设置所允许的HTTP请求方法
    allowMethods: ['GET', 'POST', 'DELETE'],
    // 字段是必需的。表明服务器支持的所有头信息字段.
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
);

app.use(statistics());

// logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now()- start;
  log4js.resLogger(ctx, ms);
  if (ctx.url === '/' && ctx.method === 'GET') {
    // 显示页面
    let html = `
      <h1>koa2 post</h1>
      <form action="/api/example/post" method="post">
        <label for="">标题</label>
        <input name="title" type="text" />
        <br />
        <label for="">内容</label>
        <input name="content" type="text" />
        <br />
        <button type="submit">submit</button>
      </form>
    `
    ctx.body = html
  }
});

app.use(bodyParser());

const example_router = require('@root/routes/api/example_router');

app.use(example_router.routes()).use(example_router.allowedMethods());

app.on('error', (err, ctx) => {
  log4js.errLogger(ctx, err);
  console.error('server error', err, ctx);
});

app.listen(port, () => {
  console.log('port success ' + port);
});
