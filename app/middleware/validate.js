// https://hapi.dev/family/joi/
const Joi = require('@hapi/joi');

const validate = (data, validParams) => {
  const schema = Joi.object({
    ...validParams
  });
  const {error, value} = schema.validate(data);
  if (error) {
    const {details: [{context, message}]} = error;
    // 出错可创建自定义的校验出错类型
    return {context, message};
  }
  return value;
};

const validaMessage = (ctx, context, message) => {
  ctx.body = {
    code: '20001',
    msg: context.label + '参数必须输入',
    desc: message,
    data: {}
  }
}

const schemaValida = {
  // 账号限制长度为3-20个字符串
  account: () => Joi.string().min(3).max(20),
  // 密码限制长度为6-30，而且只允许字母与数字
  password: () => Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/),
  email: () => Joi.string().email(),
  string: () => Joi.string()
};

module.exports = {
  validate,
  schemaValida,
  validaMessage
}
