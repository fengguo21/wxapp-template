/**
 * 强制授权用户信息
 * 通过增强Page对象，监控每个页面的onShow方法，可以做到强制授权，即在每个页面的
 * onShow方法中判断是否有用户信息，若无用户信息跳转到授权用户信息页面，这样可以做到
 * 无论用户从哪个页面进入都必须要授权用户信息，而且不可返回；
 * 判断是否有用户信息优先从app.globalData.userInfo中去获取，没有则去请求接口，通过
 * sessionId去查找openid，然后查找用户表是否有该openid对应的用户信息；
 */

const req = require('request.js');

const authRoute = '/pages/auth-user/index'; // 授权用户信息的页面，即用户未授权会跳到该页面，以/开头

const main = function () {
    const originalPage = Page
    Page = function(config) {
        const { onShow } = config
        config.onShow = function() {
            let route = '/' + this.route;
            if (!getApp().globalData.userInfo && authRoute != route) {
                req.get('get_userinfo')
                    .then(userInfo => {
                        getApp().globalData.userInfo = userInfo;
                    })
                    .catch(err => {
                        wx.navigateTo({
                            url: '/pages/auth-user/index'
                        });
                    })
            }
            if (typeof onShow === 'function') {
                onShow.call(this)
            }
        }
        return originalPage(config);
    }
};

main();