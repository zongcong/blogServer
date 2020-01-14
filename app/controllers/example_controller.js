// 引入表
const Example_col = require('../models/example');

const xss = require('xss');

const {validate, schemaValida, validaMessage} = require('../middleware/validate');

// get 请求返回所有数据
const getExample = async (ctx, next) => {
  const req = ctx.request.body;
  // 查找所有数据，不显示 _id
  const examples = await Example_col.find({});
  ctx.status = 200;
  ctx.body = {
    code: '20000',
    msg: 'get request',
    data: examples,
    req
  }
}

// post 带 title、content 参数，并插入数据库
const postExample = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;
  const data = validate(req, {
    title: schemaValida.account().required(),
    content: schemaValida.string().required()
  });
  const {context, message} = data;
  // 参数校验
  if (data) {
    return validaMessage(ctx, context, message);
  }

  const result = await Example_col.create({title: xss(req.title), content: xss(req.content)});

  ctx.body = {
    code: '20000',
    msg: 'post request',
    desc: 'insert success',
    data: result
  }
}

module.exports = {
  getExample,
  postExample
}
