const req = require('utils/request.js'); // 网络请求封装
const session = require('utils/session.js'); // 维护session登录态
const au = require('utils/auth-user.js'); // 引入该文件则强制授权用户信息，相关配置在该文件中
App({

    onLaunch: function (options) {
        this.checkSession();
    },
    checkSession: function () {
        // 维护用户登录态
        session.main();
    },
    globalData: {
        userInfo: null, // 强制授权用户信息该字段为用户信息对象，不强制授权可自行选择使不使用该字段
        req: req,
    }
});