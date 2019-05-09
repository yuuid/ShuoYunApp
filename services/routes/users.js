var express = require('express');
var router = express.Router();
//引入mysql
var mysql = require('mysql');
var dbsql = require("./db");

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
    console.log(ret)
    res.json(ret);
  }
};


//登录
router.post('/login', function (req, res, next) {
  var _res = res
  var param = req.body;
  var mobile = param.mobile;
  var password = param.password;
  const sql = 'select * from user where mobile=?;'
  connection.query(sql, [mobile], function (error, rows, fields) {
    //返回数据给前台
    // if
    var data = {};
    if (error) {
      data.err = error
    } else if (rows) {
      var info = rows[0]
      if (info.password === password) {
        data.result = {
          code: 200,
          msg: '登录成功',
          data: info,
        };
      } else {
        data.result = {
          code: 201,
          msg: '密码错误',
        };
      }

    } else {
      data.result = {
        code: 500,
        msg: '登录失败',
        // data: rows,
      };
    }
    setTimeout(function () {
      responseJSON(_res, data)
    }, 300);
  });
});

//注销
router.get('/loginout', function (req, res, next) {
  var userId = req.query.userId;
  //创建数据库连接
  var sql = 'SELECT * FROM articles WHERE userId= ?'
  connection.query(sql, [userId], function (error, rows, fields) {
    //返回数据给前台
    if (error) {
      res.json(500);
    } else {
      res.json(rows);
    }
  });

});

//注册
router.post('/reg', function (req, res, next) {

  var _res = res;
  var param = req.body;
  var mobile = param.mobile;
  var username = param.username;
  var password = param.password;
  var userImg = param.userImg;
  var truename = param.truename;
  var studentId = param.studentId;

  //用户是否已注册
  var sqlall = 'SELECT username from `user`'
  connection.query(sqlall, function (err, rows, fields) {
    var isTrue = false;
    if (rows) {
      //获取用户列表，循环遍历判断当前用户是否存在
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].mobile == mobile) {
          isTrue = true;
        }
      }
    }
    var data = {};
    data.isreg = !isTrue; //如果isTrue布尔值为true则注册成功 有false则失败
    if (isTrue) {
      data.result = {
        code: 1,
        msg: '用户已存在'
      };
    } else {
      var sql = 'INSERT INTO `user` (`username`, `mobile`, `password`, `userImg`, `truename`, `studentId`) VALUES (?, ?, ?, ?, ?, ?);'
      connection.query(sql, [username, mobile, password, userImg, truename, studentId], function (err, result) {
        if (result) {
          // console.log(result)
          data.result = {
            code: 200,
            msg: '注册成功'
          };
          var sql2 = 'INSERT INTO `folow` (`userId`, `follower_userId`) VALUES (?, 23);'
          connection.query(sql2, [result.insertId], function (err, ret) {
            if (ret) {
              console.log(ret)
            }
          })
        } else {
          data.result = {
            code: -1,
            msg: '注册失败'
          };
        }
      });
    }
    if (err) data.err = err;
    // 以json形式，把操作结果返回给前台页面
    setTimeout(function () {
      responseJSON(_res, data)
    }, 300);
    // 释放链接
  });

});

//修改密码
router.post('/updatepsd', function (req, res, next) {
  var _res = res
  var param = req.body;
  var password = param.oldpsd;
  var newpsd = param.newpsd;
  var userId = param.userId;
  var sqluser = 'SELECT password from user WHERE userId=?;'
  var sql = 'UPDATE user SET password=? WHERE (userId=?);'
  connection.query(sqluser, [userId], function (error, rows, fields) {
    var data = {};
    if (password === rows[0].password) {
      connection.query(sql, [newpsd, userId], function (err, result, fields) {
        //返回数据给前台
        if (err) {
          data.err = err
        } else if (result) {
          data.result = {
            code: 200,
            msg: '修改成功, 请重新登陆',
          };
        } else {
          data.result = {
            code: 500,
            msg: '修改失败',

          };
        }
      });
    } else {
      data.error = error
    }
    setTimeout(function () {
      responseJSON(_res, data)
    }, 300);
  });

});

//修改个人信息
router.post('/updateUserInfo', function (req, res, next) {
  var _res = res
  var param = req.body;
  var username = param.username;
  var userImg = param.userImg;
  var userId = param.userId;
  var sex = param.sex;

  var sql = "UPDATE user SET username=?,userImg=?,sex=? WHERE userId=?;"
  connection.query(sql, [username, userImg, sex, userId], function (err, result, fields) {
    //返回数据给前台
    var data = {}
    if (err) {
      data.err = err
    } else if (result) {
      var sqluser = 'SELECT * FROM user WHERE userId=?;'
      connection.query(sqluser, [userId], function (error, rows, fields) {
        if (rows) {
          var info = rows[0]
          data.result = {
            code: 200,
            msg: '修改个人信息成功',
            data: info,
          };
        }
      });
    } else {
      data.result = {
        code: 500,
        msg: '修改失败',

      };
    }
    setTimeout(function () {
      responseJSON(_res, data)
    }, 300);
  });
});

//获取所有用户信息
router.post('/allusers', function (req, res, next) {
  var _res = res
  // var param = req.body;
  // var mobile = param.mobile;
  // var password = param.password;
  const sql = 'select user.userId, user.username, user.userImg, user.truename, user.studentId from shuoyun.user;'
  connection.query(sql, [], function (error, rows, fields) {
    //返回数据给前台

    var data = {};  
    if (error) {
      data.err = error
    } else if (rows) {
      var info = rows
      data.result = {
        code: 200,
        msg: '获取用户成功',
        data: info,
      };

    } else {
      data.result = {
        code: 500,
        msg: '登录失败',
        // data: rows,
      };
    }
    setTimeout(function () {
      responseJSON(_res, data)
    }, 300);
  });
});

module.exports = router;
