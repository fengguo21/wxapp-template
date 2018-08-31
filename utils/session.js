/**
 * 用户权限认证相关
 * 1.登录态的维护
 * 2.强制授权用户信息（可选）
 */
const req = require('request.js');
/**
 * 检查本地是否有用户登录态
 * 从缓存中获取用户登录态sessionId，并调用wx.checkSession验证登录态是否过期，若已过期则设置服务器端该登录态为过期状态
 * 若本地缓存无登录态，重新登录获取登录态
 */
const _checkSession = function () {
    return new Promise((resolve, reject) => {
        wx.getStorage({
            key: 'sessionId',
            success: res => {
                wx.checkSession({
                    success: () => {
                        resolve(res.data);
                    },
                    fail: () => {
                        // 该接口设置过期的session为无效，后续session表中数据偏多时可以删除无效的
                        // req.post('update_session.php');
                        resolve(false);
                        console.log('session过期');
                    }
                })
            },
            fail: () => {
                resolve(false);
            }
        });
    })
};

/**
 * 获取用户登录态
 * 通过wx.login获取code，传到后台解密出openid,session_key，并返回自定义用户登录态，此处可见微信小程序登录态维护文档
 * 获取登录态后保存至本地（storage）
 */
const _getSession = function () {
    return new Promise((resolve, reject) => {
        wx.login({
            success: res => {
                if (res.code) {
                    req.post('get_session.php', {'code': res.code}, false)
                        .then(res => {
                            wx.setStorage({
                                key: 'sessionId',
                                data: res.data.session_id
                            })
                            resolve(res.data.session_id);
                        })
                } else {
                    reject('登录失败');
                }
            },
            fail: err => {
                reject('登录失败');
            }
        })
    })
};

/**
 * 维护用户登录态（sessionId）
 */
const main = function () {
    _checkSession()
        .then(sessionId => {
            if (sessionId) {
                return Promise.resolve(sessionId);
            } else {
                return _getSession();
            }
        })
        .then(sessionId => {
            resolve(sessionId);
        })
        .catch(err => {
            console.log(err);
            // 发生异常，清除本地缓存sessionId
            wx.removeStorage({
                key: 'sessionId'
            });
        });
};

module.exports = {
    main: main
};