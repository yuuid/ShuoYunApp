var express = require('express');
var router = express.Router();
//引入mysql
// var mysql = require('mysql');
// var dbsql = require("./db");
var multer = require('multer');

//创建数据库连接
// var connection = mysql.createConnection(dbsql);
// connection.connect();

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

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/images");
    },
    filename: function (req, file, callback) {
        console.log(file)
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
var upload = multer({ storage: Storage }).array("images", 1);

router.post("/img", function (req, res) {
    var _res = res;
    upload(req, res, function (err) {
        // console.log(req)
        var data = {};
        if (err) {
            return res.end("Something went wrong!");
        }
        data = {
            code: 200,
            imageName: req.files[0].filename,
        }
        setTimeout(function () {
            responseJSON(_res, data)
        }, 300);
        // return res.end("File uploaded sucessfully!.");
    });
});


module.exports = router;
