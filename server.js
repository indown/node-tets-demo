var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
const querystring = require("querystring");
if (!port) {
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}


var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
  }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  request.on('data', function (chunk) {
      
    console.log("chunk:",querystring.parse(chunk));
});
  
  console.log('含查询字符串的路径\n' + pathWithQuery)

  if (path === '/blog') {
    response.statusCode = 200
    
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.setHeader("Access-Control-Allow-Origin", "*");
    fs.open('./data.json', 'r', (err, fd) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.error('文件不存在');
          return;
        }
        throw err;
      }
      fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) throw err;
        
        
        response.write(JSON.stringify(data))
        response.end()

      });
    });

  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('呜呜呜')
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请打开 http://localhost:' + port)