var express = require('express');

var multipart = require('connect-multiparty');
var app = express();
var multipartMiddleware = multipart(); 
var fs = require('fs')
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));


app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
app.get('/api', function(req, res) {
  res.status(200);
  res.json({result: 'success'});
});

app.post('/blog',multipartMiddleware,function(req,res){
    // console.log('get FormData Params: ', req.body.id);
    // var result=JSON.parse(fs.readFileSync('./data.json'));
    // // fs.readFile('./data.json',  (err, data) => {
    // //     if (err) throw err;
    // //     if(req.body.id){
    // //         console.log(result)
    // //     }else{
    // //         res.send(data);
    // //     }
    // //   });
    // if(req.body.id){
    //     let temp = {}
    //     temp['data'] = result.data.filter(item =>{
    //         return item.id == req.body.id
    //     })
    //     temp['num'] = result.data.length
    //     // for(var i = 0; i<result.dataList.length;i++){
    //     //     console.log('b')
    //     //     if(req.body.id==result.dataList[i].id){
    //     //         console.log("c")
    //     //         res.send(result.dataList[i]);
    //     //     }
    //     // }
    //     res.send(temp);
    // }else{
    //     res.send(result);
    // }
    if(req.body.id){
        getId(req.body.id)
    }else{
        pagination(0,10)
    }
    function getId(id){
        fs.readFile('./data.json',function(err,data){
            if(err){
                console.error(err);
            }
            var person = data.toString();
            person = JSON.parse(person);
            var length = person.data.length;
            let temp = {}
            temp['data'] = person.data.filter(item =>{
                if(item.id == id){
                    var temp1 = item
                    item.time++
                }
                return temp1
            })
            var str = JSON.stringify(person);
            fs.writeFile('./data.json',str,function(err){
                if(err){
                    console.error(err);
                }
            })
            temp['length'] = length
            res.send(temp);
        })
    }   
    function pagination(p,s){
        //p为页数，比如第一页传0，第二页传1,s为每页多少条数据
        fs.readFile('./data.json',function(err,data){
            if(err){
                console.error(err);
            }
            var person = data.toString();
            person = JSON.parse(person);
            var length = person.data.length;
            console.log(length)
            var temp = {};
            var pagePerson = person.data.slice(s*p,(p+1)*s);
            temp['data'] =  pagePerson
            temp['length'] = length
            res.send(temp);
        })
    }
    
});
//配置服务端口
var server = app.listen(8888, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
