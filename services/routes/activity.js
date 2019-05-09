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
        // console.log(ret.result.data)
        res.json(ret);
    }
};


//推送一篇活动
router.post('/insertActivity', function (req, res, next) {
    var _res = res;
    var param = req.body;
    // console.log(param)
    var userId = param.userId;
    var provider = param.username;
    var content = param.content[0].content;
    var imglist = param.imgList;
    var imgs = '';
    imglist.length > 0 && imglist.forEach((e, i) => {
        if (i === imglist.length - 1) {
            imgs += e.uri
        }
        else { imgs += `${e.uri},`; }
    })

    var info = ''
    content && content.forEach(element => {
        info += element.text
    });
    var title = param.title;
    var time = new Date();
    var updatetime = timeformate.formatDate(time, 'yyyy-MM-dd hh:mm:ss');
    // var start = timeformate.formatDate(param.start, 'yyyy-MM-dd');
    // var end = timeformate.formatDate(param.end, 'yyyy-MM-dd');
    var start = param.start;
    var end = param.end;
    var sql = 'INSERT INTO `shuoyun`.`activity` (`title`, `content`, `updateTime`, `userId`, `imgs`, `provider`, `startTime`, `endTime`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);'
    connection.query(sql, [title, info, updatetime, userId, imgs, provider, start, end], function (error, rows, fields) {
        //返回数据给前台
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
            // res.json(rows);
        }
        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });
});


/* 获取线下活动 */
router.post('/newActivity', function (req, res, next) {
    var _res = res;
    var sql = 'SELECT * FROM shuoyun.activity where type=0 order by startTime DESC;'
    connection.query(sql, function (error, rows, fields) {
        var data = {};
        if (error) {
            data.error = error
        }
        if (rows) {
            var info = rows
            info && info.forEach((v, i) => {
                v.imgList = []
                if (v.imgs != null && v.imgs != '') { var image = v.imgs.split(','); v.imgList = image; }

            })
            data.result = {
                code: 200,
                msg: '获取线下活动成功',
                data: info,
            };
        } else {
            data.result = {
                code: 500,
                msg: '获取线下活动失败',

            };
            // res.json(rows);
        }
        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });


});

/* 获取线上活动 */
router.post('/liveArticle', function (req, res, next) {
    var _res = res;
    var sql = 'SELECT * FROM shuoyun.activity where type=1 order by startTime DESC;'
    connection.query(sql, function (error, rows, fields) {
        var data = {};
        if (error) {
            data.error = error
        }
        if (rows) {
            var info = rows
            info && info.forEach((v, i) => {
                v.imgList = []
                if (v.imgs != null && v.imgs != '') { var image = v.imgs.split(','); v.imgList = image; }

            })
            data.result = {
                code: 200,
                msg: '获取线上活动成功',
                data: info,
            };
        } else {
            data.result = {
                code: 500,
                msg: '获取线上活动失败',

            };
            // res.json(rows);
        }
        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });


});




//获取最新活动
router.post('/lastestActivity', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var time = new Date();
    var now = timeformate.formatDate(time, 'yyyy-MM-dd');
    var sql = 'SELECT * FROM shuoyun.activity where endTime>? order by updatetime DESC LIMIT 1;'
    connection.query(sql, [now], function (error, rows, fields) {
        //返回数据给前台
        var data = {};
        if (error) {
            data.error = error
        }
        if (rows) {
            var info = rows[0];
            console.log(info)
            data.result = {
                code: 200,
                // msg: '发表成功',
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

//获取关注人数
router.post('/countFollow', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var id = param.id;
    // console.log(info)
    var sql = 'SELECT COUNT(*) AS total FROM shuoyun.folow where userId=?;'
    connection.query(sql, [id], function (error, rows, fields) {
        //返回数据给前台
        var data = {};
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

//获取活动文章
router.post('/getArticles', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var id = param.id;
    // console.log(info)
    var sql = 'Select a.*, b.username, b.userImg from shuoyun.articles a, shuoyun.user b where a.userId=b.userId and a.type=3 and a.isCheck=1 and activityId=? order by a.updatetime DESC'
    connection.query(sql, [id], function (error, rows, fields) {
        //返回数据给前台
        var data = {};
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
                msg: '获取失败',
            };
        }

        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });
});

router.post('/getAllArticles', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var id = param.id;
    // console.log(info)
    var sql = 'Select a.*, b.username, b.userImg from shuoyun.articles a, shuoyun.user b where a.userId=b.userId and a.type=3 and a.isCheck=1 order by a.updatetime DESC'
    connection.query(sql, [id], function (error, rows, fields) {
        //返回数据给前台
        var data = {};
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
                msg: '获取失败',
            };
        }

        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });
});

//回顾
router.post('/backArticle', function (req, res, next) {
    var _res = res;
    var param = req.body;
    // var id = param.id;
    // console.log(info)
    var time = new Date();
    var startTime = timeformate.formatDate(time, 'yyyy-MM-dd hh:mm:ss');
    var sql = 'SELECT b.articleId, c.userImg, c.username, a.title, a.content, a.imgs FROM shuoyun.activity a, shuoyun.articles b, shuoyun.user c where a.id=b.activityId and b.userId=c.userId and a.type=1 and a.startTime < ? order by startTime DESC;'
    connection.query(sql, [startTime], function (error, rows, fields) {
        //返回数据给前台
        var data = {};
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
                msg: '获取失败',
            };
        }

        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });
});


//删除文章
router.post('/deleteArticle', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var id = param.id;
    // console.log(info)
    var sql = 'DELETE FROM `shuoyun`.`articles` WHERE (`articleId` = ?);'
    connection.query(sql, [id], function (error, rows, fields) {
        //返回数据给前台
        var data = {};
        if (rows) {

            data.result = {
                code: 200,
                msg: '删除成功',
            };
        } else {
            data.result = {
                code: 500,
                msg: '删除失败',
            };
        }
        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });
});

module.exports = router;