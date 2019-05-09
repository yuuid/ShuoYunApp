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

/* 获取用户所有消息 */
router.post('/getUserMessage', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var userId = param.userId;
    //发送查询语句.一个参数是sql,第二个参数是得到值，第三个参数是回调函数，回调函数有三个值，
    //第一个是error,第二个是rows数组，第三个是filde
    var sql = 'SELECT a.idmessage, a.content, a.isread, b.title FROM shuoyun.message a, shuoyun.articles b where a.touserId=? and a.articleId=b.articleId;'
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
            data.result = {
                code: 500,
                msg: '查询失败',
            };
        }
        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });

});

//点击则为已读
router.post('/setisread', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var idmessage = param.idmessage;
    var sql = 'UPDATE `shuoyun`.`message` SET `isread`=1 WHERE idmessage=?;'
    connection.query(sql, [idmessage], function (error, rows, fields) {
        var data = {};
        if (error) {
            data.error = error
        }
        if (rows) {
            var info = rows[0]
            data.result = {
                code: 200,
                msg: '查询成功',
                data: info,
            };
        } else {
            data.result = {
                code: 500,
                msg: '查询失败',
            };
        }
        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });

});

/* 获取用户未读消息数量 */
router.post('/getUserMessageCount', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var userId = param.userId;
    var sql = 'SELECT Count(*) AS total FROM shuoyun.message where touserId=? and isread=0;'
    connection.query(sql, [userId], function (error, rows, fields) {
        var data = {};

        if (error) {
            data.error = error
        }
        if (rows) {
            var info = rows[0]
            data.result = {
                code: 200,
                msg: '查询成功',
                data: info,
            };
        } else {
            data.result = {
                code: 500,
                msg: '查询失败',
            };
        }
        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });

});


//推送一条审核消息
router.post('/insert', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var content = param.content;
    var touserId = param.touserId;
    var articleId = param.articleId;
    var isread = 0;
    var fromuserId = 23;
    var time = new Date();
    var createtime = timeformate.formatDate(time, 'yyyy-MM-dd');
    var sql = 'INSERT INTO `shuoyun`.`message` (`content`, `createtime`, `fromuserId`, `touserId`, `isread`, `articleId`) VALUES (?, ?, ?, ?, ?, ?);'
    connection.query(sql, [content, createtime, fromuserId, touserId, isread, articleId], function (error, rows, fields) {
        //返回数据给前台
        var data = {};
        if (error) {
            data.error = error
        }
        if (rows) {
            data.result = {
                code: 200,
                msg: '推送信息成功',
                data: rows,
            };
        } else {
            data.result = {
                code: 500,
                msg: '推送信息失败',
            };
        }
        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });
});

/* 获取未审核文章数量 */
router.post('/getNoCheckNum', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var sql = 'SELECT Count(*) AS total FROM shuoyun.articles where isCheck=0;'
    connection.query(sql, [], function (error, rows, fields) {
        var data = {};

        if (error) {
            data.error = error
        }
        if (rows) {
            var info = rows[0]
            data.result = {
                code: 200,
                msg: '查询成功',
                data: info,
            };
        } else {
            data.result = {
                code: 500,
                msg: '查询失败',
            };
        }
        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });

});

module.exports = router;