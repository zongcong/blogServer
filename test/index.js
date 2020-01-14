var db = connect('blog');

var data = {
  title: '这是文章标题',
  content: '<span style="color: red">这是文章内容</span>',
  createTime: Date.now()
}

db.example.insert(data);
