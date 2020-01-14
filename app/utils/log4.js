// https://github.com/log4js-node/log4js-node
const log4js = require('log4js');
const { formatError, formatRes } = require('./formatLog');
const logDb = require('../controllers/log_controller');


let logger = {};

let errorLogger = log4js.getLogger('error');
let resLogger = log4js.getLogger('response');

log4js.configure({
  appenders: {
    error: {
      type: 'file', // 日志类型
      category: 'errLog', // 日志名称
      filename: __dirname + '/../logs/error.log/', // 日志输出位置，当前目录文件或文件夹不存在时自动创建
      maxLogSize: 104800, // 文件最大存储空间
      backups: 100 // 当文件内容超过文件存储空间时，备份文件的数量
    },
    response: {
      type: 'dateFile',
      category: 'resLog',
      filename: __dirname + '/../logs/response/',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      maxLogSize: 104800,
      backups: 100
    }
  },
  categories: {
    error: {
      appenders: ['error'],
      level: 'error'
    },
    response: {
      appenders: ['response'],
      level: 'info'
    },
    default: {
      appenders: ['response'],
      level: 'info'
    }
  },
  replaceConsole: true
});

// 封装错误日志
logger.errLogger = (ctx, error, resTime) => {
  if(ctx && error) {
    logDb('ErrorRequest', 'error', formatError(ctx, error, resTime));
    errorLogger.error(formatError(ctx, error, resTime));
  }
}

// 封装响应日志
logger.resLogger = (ctx, resTime) => {
  if(ctx) {
    logDb('RequestInfo', 'info', formatRes(ctx, resTime));
    resLogger.info(formatRes(ctx, resTime));
  }
}

module.exports = logger;
