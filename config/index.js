module.exports = {
  port: 3000, // 项目启动的端口
  db: 'mongodb://127.0.0.1:27017/blog', // 数据库
  saltTimes: 3, // 加密次数（用户密码加密）
  baseURL: '/api',
  whiteList: ['http://192.168.1.5:8080'] // 允许跨域的白名单
}

