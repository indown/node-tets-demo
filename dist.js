'use strict';

var express = require('express');

var multipart = require('connect-multiparty');
var app = express();
var multipartMiddleware = multipart();
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.get('/api', function (req, res) {
    res.status(200);
    res.json({ result: 'success' });
});

app.post('/blog', multipartMiddleware, function (req, res) {
    console.log('get FormData Params: ', req.body);
    var result = JSON.parse(fs.readFileSync('./data.json'));
    // fs.readFile('./data.json',  (err, data) => {
    //     if (err) throw err;

    //     if(req.body.id){
    //         console.log(result)
    //     }else{
    //         res.send(data);
    //     }
    //   });
    if (req.body.id) {
        result.dataList.fillter(function (item) {
            return item.id == req.body.id;
        });
        res.send(result);
        // for(var i = 0; i<result.dataList.length;i++){
        //     console.log('b')
        //     if(req.body.id==result.dataList[i].id){

        //         res.send(result.dataList[i]);
        //     }
        // }
    } else {
        res.send(result);
    }
});
//配置服务端口
var server = app.listen(8888, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
