const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exampleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createTime: {
    type: String,
    default: Date.now
  },
  updateTime: {
    type: Date,
    default: Date.now
  }
  /*
  * collection 指定表名，防止新建的表带上 s 后缀
  * versionKey 不需要 _v 字段，默认加上
  * */
}, {
  collection: 'example',
  versionKey: false,
  timestamps: {
    createdAt: 'createTime',
    updatedAt: 'updateTime'
  }
});

module.exports = mongoose.model('example', exampleSchema);
