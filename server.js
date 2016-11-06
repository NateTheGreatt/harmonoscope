var koa = require('koa');
var app = koa();

app.use(require('koa-static')(__dirname+'/src'));

app.listen(3000);
