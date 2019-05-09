var express = require('express');
var router = express.Router();
var timeformate = require('../public/javascripts/timeUtil');
//引入mysql
var mysql = require('mysql');
var dbsql = require("./db");

// var xss = require('xxs');

//创建数据库连接
var connection = mysql.createConnection(dbsql);
connection.connect();

// 响应一个JSON数据
var responseJSON = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '-200',
            msg: '操作失败'
        });
    } else {
        console.log(ret.result.data)
        res.json(ret);
    }
};

//今日话题
router.post('/getToday', function (req, res, next) {
    var _res = res;
    // var param = req.body;
    var time = new Date();
    var createTime = timeformate.formatDate(time, 'yyyy-MM-dd');
    //发送查询语句.一个参数是sql,第二个参数是得到值，第三个参数是回调函数，回调函数有三个值，
    //第一个是error,第二个是rows数组，第三个是filde
    var sql = 'SELECT * FROM shuoyun.huati where createTime > ?;'
    connection.query(sql, [createTime], function (error, rows, fields) {
        var data = {};
        if (error) {
            data.error = error
        }
        if (rows) {
            var info = rows
            // info && info.forEach((v, i) => {
            //     v.imgList = []
            //     if (v.imgs != null && v.imgs != '') { var image = v.imgs.split(',') }
            //     v.imgList = image;
            // })
            data.result = {
                code: 200,
                data: info,
            };
        } else {
            data.result = {
                code: 500,
            };
        }

        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);

    });

});

//所有话题
router.post('/getAll', function (req, res, next) {
    var _res = res;
    var param = req.body;
    // var userId = param.userId;
    //发送查询语句.一个参数是sql,第二个参数是得到值，第三个参数是回调函数，回调函数有三个值，
    //第一个是error,第二个是rows数组，第三个是filde
    var sql = 'SELECT * FROM shuoyun.huati order by createTime DESC;'
    connection.query(sql, [], function (error, rows, fields) {
        var data = {};
        if (error) {
            data.error = error
        }
        if (rows) {
            var info = rows
            // info && info.forEach((v, i) => {
            //     v.imgList = []
            //     if (v.imgs != null && v.imgs != '') { var image = v.imgs.split(',') }
            //     v.imgList = image;
            // })
            data.result = {
                code: 200,
                data: info,
            };
        } else {
            data.result = {
                code: 500,
            };
        }

        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);

    });

});

//话题内容
router.post('/getDetail', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var huatiId = param.huatiId;
    //发送查询语句.一个参数是sql,第二个参数是得到值，第三个参数是回调函数，回调函数有三个值，
    //第一个是error,第二个是rows数组，第三个是filde
    var sql = 'SELECT b.username, b.userImg, a.* FROM shuoyun.articles a, shuoyun.user b where a.huatiId=? and a.type=5 and a.userId=b.userId order by a.updatetime DESC;'
    connection.query(sql, [huatiId], function (error, rows, fields) {
        var data = {};
        if (error) {
            data.error = error
        }
        if (rows) {
            var info = rows
            info && info.forEach((v, i) => {
                v.imgList = []
                if (v.imgs != null && v.imgs != '') { var image = v.imgs.split(',') }
                v.imgList = image;
            })
            data.result = {
                code: 200,
                data: info,
            };
        } else {
            data.result = {
                code: 500,
            };
        }

        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);

    });

});

//新增话题
router.post('/add', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var title = param.title;
    var content = param.content[0].content;
    var info = ''
    content && content.forEach(element => {
        info += element.text
    });
    var time = new Date();
    var updatetime = timeformate.formatDate(time, 'yyyy-MM-dd hh:mm:ss');
    //发送查询语句.一个参数是sql,第二个参数是得到值，第三个参数是回调函数，回调函数有三个值，
    //第一个是error,第二个是rows数组，第三个是filde
    var sql = 'INSERT INTO `shuoyun`.`huati` (`title`, `content`, `createTime`) VALUES (?, ?, ?);'
    connection.query(sql, [title, info, updatetime], function (error, rows, fields) {
        var data = {};
        if (error) {
            data.error = error
        }
        if (rows) {
            data.result = {
                code: 200,
                msg: '发表成功',
                data: rows,
            };
        } else {
            data.result = {
                code: 500,
                msg: '发表失败',
            };
        }

        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);

    });

});

module.exports = router;