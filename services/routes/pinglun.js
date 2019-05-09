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

/* 获取用户评论 */
router.post('/getUserPingLun', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var userId = param.userId;
    //发送查询语句.一个参数是sql,第二个参数是得到值，第三个参数是回调函数，回调函数有三个值，
    //第一个是error,第二个是rows数组，第三个是filde
    var sql = 'Select * from shuoyun.pinglun where userId = ? order by updatetime DESC;'
    connection.query(sql, [userId], function (error, rows, fields) {
        var data = {};
        
        if (error) {
            data.error = error
        }
        if (rows) {
            data.result = {
                code: 200,
                data: rows,
                msg: '查询成功',
            }
        } else {
            data1.result = {
                code: 500,
                msg: '查询失败',
            };
        }
    });

});

//获取文章评论
router.post('/getdetail', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var articleId = param.articleId;
    //发送查询语句.一个参数是sql,第二个参数是得到值，第三个参数是回调函数，回调函数有三个值，
    //第一个是error,第二个是rows数组，第三个是filde
    var sql = 'Select * from shuoyun.pinglun where articleId = ? order by updatetime;'
    connection.query(sql, [articleId], function (error, rows, fields) {
        var data = {};

        if (error) {
            data.error = error
        }
        if (rows) {
            var info = rows
            info && info.forEach((v, i) => {
                v.imgList = []
                if (v.imgs != null || v.imgs != '') { var image = v.imgs.split(',') }
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





//推送一条评论
router.post('/insert', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var userId = param.userId;
    var content = param.content;
    var username = params.username;
    var userImg = params.userImg;
    var title = params.title;
    var articleId = params.articleId;
    var parent = params.parent;
    var time = new Date();
    var updatetime = timeformate.formatDate(time, 'yyyy-MM-dd hh:mm:ss');
    var sql = 'INSERT INTO `pinglun` (`title`, `content`, `updatetime`, `userId`, `username`, `userImg`, `articleId`, `parent`) VALUES (?, ?, ?, ?, ?, ?);'
    connection.query(sql, [title, content, updatetime, userId, username, userImg, articleId, parent], function (error, rows, fields) {
        //返回数据给前台
        var data = {};
        if (error) {
            data.error = error
        }
        if (rows) {
            data.result = {
                code: 200,
                msg: '评论成功',
                data: rows,
            };
            // res.json(500);
        } else {
            data.result = {
                code: 500,
                msg: '评论失败',
            };
        }
        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });
});


module.exports = router;