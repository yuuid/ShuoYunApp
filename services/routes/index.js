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

/* 获取关注 */
router.post('/getArticle', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var userId = param.userId;
    //发送查询语句.一个参数是sql,第二个参数是得到值，第三个参数是回调函数，回调函数有三个值，
    //第一个是error,第二个是rows数组，第三个是filde
    var sql = 'Select a.*, b.username, b.userImg from articles a, user b where a.userId in (Select follower_userId from shuoyun.folow where userId=?) and a.userId=b.userId and a.isCheck=1 order by a.updatetime DESC;'
    connection.query(sql, [userId], function (error, rows, fields) {
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

//广场
router.post('/getArticleNoUser', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var userId = param.userId;
    //发送查询语句.一个参数是sql,第二个参数是得到值，第三个参数是回调函数，回调函数有三个值，
    //第一个是error,第二个是rows数组，第三个是filde
    var sql = 'Select a.*, b.username, b.userImg from shuoyun.articles a, shuoyun.user b where a.userId=b.userId and a.type=1 and a.isCheck=1 order by a.updatetime DESC;'
    connection.query(sql, [userId], function (error, rows, fields) {
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

//一书
router.post('/getBook', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var userId = param.userId;
    //发送查询语句.一个参数是sql,第二个参数是得到值，第三个参数是回调函数，回调函数有三个值，
    //第一个是error,第二个是rows数组，第三个是filde
    var sql = 'Select a.*, b.username, b.userImg from shuoyun.articles a, shuoyun.user b where a.userId=b.userId and a.type=2 order by a.updatetime DESC;'
    connection.query(sql, [userId], function (error, rows, fields) {
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


//获取单个用户文章列表
router.post('/getUserArticle', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var userId = param.userId;
    //创建数据库连接
    var sql = 'Select * from shuoyun.articles where userId=? order by shuoyun.articles.updatetime DESC;'
    connection.query(sql, [userId], function (error, rows, fields) {
        //返回数据给前台
        // if (error) {
        //     res.json(500);
        // } else {
        //     res.json(rows);
        // }
        var data = {};
        if (error) {
            data.error = error
        }
        if (rows) {
            data.result = {
                code: 200,
                msg: '获取文章列表成功',
                data: rows,
            };
        } else {
            data.result = {
                code: 500,
                msg: '获取文章列表失败',
            };
        }
        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });

});

//获取用户关注列表
router.post('/getFollowUser', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var userId = param.userId;
    var sql = 'SELECT username,userImg,sex FROM shuoyun.user where userId in (Select follower_userId from shuoyun.folow where userId=?);'
    connection.query(sql, [userId], function (error, rows, fields) {
        //返回数据给前台
        var data = {};
        if (error) {
            data.error = error
        }
        if (rows) {
            data.result = {
                code: 200,
                msg: '获取关注列表成功',
                data: rows,
            };
        } else {
            data.result = {
                code: 500,
                msg: '获取关注列表失败',
            };
        }
        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });

});

//获取用户粉丝列表
router.post('/getFansUser', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var userId = param.userId;
    var sql = 'SELECT username,userImg,sex FROM shuoyun.user where userId in (Select userId from shuoyun.folow where follower_userId=?);'
    connection.query(sql, [userId], function (error, rows, fields) {
        //返回数据给前台
        var data = {};
        if (error) {
            data.error = error
        }
        if (rows) {
            data.result = {
                code: 200,
                msg: '获取关注列表成功',
                data: rows,
            };
        } else {
            data.result = {
                code: 500,
                msg: '获取关注列表失败',
            };
        }
        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });

});

//推送一篇文章
router.post('/insertArticle', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var userId = param.userId;
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
    var type = param.type;
    var time = new Date();
    var updatetime = timeformate.formatDate(time, 'yyyy-MM-dd hh:mm:ss');
    var activityId = param.activityId;
    var huatiId = param.huatiId;
    var isCheck = param.isCheck;
    var sql = 'INSERT INTO `articles` (`title`, `content`, `updatetime`, `userId`, `type`, `imgs`, `activityId`, `huatiId`, `isCheck`) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?);'
    connection.query(sql, [title, info, updatetime, userId, type, imgs, activityId, huatiId, isCheck], function (error, rows, fields) {
        //返回数据给前台
        var data = {};
        if (error) {
            data.error = error
        }
        if (rows) {
            data.result = {
                code: 200,
                msg: '发表成功，请等待审核',
                data: rows,
            };
            // res.json(500);
        } else {
            data.result = {
                code: 500,
                msg: '发表失败',
                // data: rows,
            };
            // res.json(rows);
        }
        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
    });
});

//文章浏览量
router.post('/addpageView', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var id = param.id;
    // console.log(info)
    var sql = 'UPDATE `articles` SET `pageview` = `pageview`+1 WHERE (`articleId` = ?);'
    connection.query(sql, [id], function (error, rows, fields) {
        //返回数据给前台
        var data = {};
        if (error) {
            data.error = error
        }
        var querysql = 'SELECT * from `articles` WHERE `articleId` = ? '
        connection.query(querysql, [id], function (err, result) {
            if (result) {

                var info = result[0]
                // console.log(info)
                if (info.imgs != null && info.imgs != '') {
                    var image = info.imgs.split(',');
                    info.imgList = image;
                }
                data.result = {
                    code: 200,
                    data: info,
                };
            } else {
                data.result = {
                    code: 500,
                };
            }

        });
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
    var sql = 'SELECT COUNT(*) AS total FROM shuoyun.folow where userId=?;'
    connection.query(sql, [id], function (error, rows, fields) {
        //返回数据给前台
        var data = {};
        if (rows) {
            var info = rows[0]
            data.result = {
                code: 200,
                msg: '发表成功',
                data: info,
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

//获取粉丝数量
router.post('/countFan', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var id = param.id;
    var sql = 'SELECT COUNT(*) AS total FROM shuoyun.folow where follower_userId=?;'
    connection.query(sql, [id], function (error, rows, fields) {
        //返回数据给前台
        var data = {};
        if (rows) {
            var info = rows[0]
            data.result = {
                code: 200,
                msg: '发表成功',
                data: info,
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

//获取文章数量
router.post('/countArticles', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var id = param.id;
    // console.log(info)
    var sql = 'SELECT COUNT(*) AS total FROM shuoyun.articles where userId=?;'
    connection.query(sql, [id], function (error, rows, fields) {
        //返回数据给前台
        var data = {};
        if (rows) {
            var info = rows[0]
            data.result = {
                code: 200,
                msg: '发表成功',
                data: info,
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

//优文
router.post('/getTopArticle', function (req, res, next) {
    var _res = res;
    var param = req.body;
    // var userId = param.userId;
    //发送查询语句.一个参数是sql,第二个参数是得到值，第三个参数是回调函数，回调函数有三个值，
    //第一个是error,第二个是rows数组，第三个是filde
    var sql = 'SELECT b.username, b.userImg, a.* FROM shuoyun.articles a, shuoyun.user b where a.type in (1,3,5) and a.userId=b.userId order by a.pageview Desc LIMIT 3;'
    connection.query(sql, [], function (error, rows, fields) {
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
//书屋
router.post('/getBookHouse', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var time = new Date();
    var createTime = timeformate.formatDate(time, 'yyyy-MM-dd');
    // var userId = param.userId;
    //发送查询语句.一个参数是sql,第二个参数是得到值，第三个参数是回调函数，回调函数有三个值，
    //第一个是error,第二个是rows数组，第三个是filde
    var sql = 'Select a.*, b.username, b.userImg from shuoyun.articles a, shuoyun.user b where a.userId=b.userId and a.type=2 and a.updatetime>?;'
    connection.query(sql, [createTime], function (error, rows, fields) {
        var data = {};

        if (error) {
            data.error = error
        }
        if (rows) {
            var info = rows[0];
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
//一书
router.post('/getBook', function (req, res, next) {
    var _res = res;
    var param = req.body;
    var userId = param.userId;
    //发送查询语句.一个参数是sql,第二个参数是得到值，第三个参数是回调函数，回调函数有三个值，
    //第一个是error,第二个是rows数组，第三个是filde
    var sql = 'Select a.*, b.username, b.userImg from shuoyun.articles a, shuoyun.user b where a.userId=b.userId and a.type=2 and a.isCheck=1 order by a.updatetime DESC;'
    connection.query(sql, [userId], function (error, rows, fields) {
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

//获取未审核文章
router.post('/noshenhe', function (req, res, next) {
    var _res = res;
    // var param = req.body;
    // var userId = param.userId;
    //发送查询语句.一个参数是sql,第二个参数是得到值，第三个参数是回调函数，回调函数有三个值，
    //第一个是error,第二个是rows数组，第三个是filde
    var sql = 'Select a.*, b.username, b.userImg from shuoyun.articles a, shuoyun.user b where a.userId=b.userId and a.isCheck=0 order by a.updatetime DESC;'
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

//进行审核
router.post('/setCheck', function (req, res, next) {
    var _res = res
    var param = req.body;
    var articleId = param.id;
    var isCheck = param.isCheck;

    var sql = "UPDATE articles SET isCheck=? WHERE articleId=?;"
    connection.query(sql, [isCheck, articleId], function (err, rows, fields) {
        //返回数据给前台
        var data = {};
        if (err) {
            data.error = error
        }
        if (rows) {
            var info = rows[0]
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
module.exports = router;