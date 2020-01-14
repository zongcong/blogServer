const Log_col = require('../models/log');

const logDb = (msg, level, info) => {
  const res = info.response || {};
  const log = {
    level: level || 'info',
    message: msg,
    info: {
      method: info.method,
      url: info.url,
      costTime: info.costTime,
      body: JSON.stringify(info.body),
      response: {
        status: res.status,
        message: res.message,
        header: JSON.stringify(res || res.header),
        body: JSON.stringify(res.body)
      }
    }
  }
  Log_col.create(log, (err, res) => {
    if (err) {
      console.log(err)
    }
  })
}

module.exports = logDb;
