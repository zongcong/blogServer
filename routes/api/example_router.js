// 引入路由模块
const Router = require('koa-router');
const router = new Router();

// 导入对应的控制器
const {getExample, postExample} = require('@root/app/controllers/example_controller');
const {baseURL} = require('@root/config');

// 为控制器的方法定义请求路径和请求方式
router.get(baseURL + '/example/get', getExample);
router.post(baseURL + '/example/post', postExample);

module.exports = router;
