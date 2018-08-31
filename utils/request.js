/**
 * 封装网络请求
 */
const urlPrefix = 'http://192.168.3.145/wxapp-api/'; // 后端接口前缀

/**
 * 登录态在小程序app onLaunch方法中异步获取并存入本地，有可能调用需要检查session的网络请求时sessionId还没获取到，
 * 所以通过一个定时器20ms执行一次，看本地是否缓存了登录态，如果已缓存则正常调用wx.request，无缓存则过20ms继续判断；
 * 将用户登录态放在http header中，后端接口应以该登录态为用户的唯一标识；
 * 接口返回JSON数据，例：{"err":"暂无用户信息", "data":"success"}
 * @param uri 后端接口uri
 * @param data 参数
 * @param method http方法，get，post
 * @param check 是否需要检查登录态
 * @returns {Promise<any>} Promise对象
 * @private
 */
const _request = function (uri, data, method, check) {
    return new Promise((resolve, reject) => {
        let checkSessionIdInterval = setInterval(() => {
            let sessionId = null;
            try{
                sessionId = wx.getStorageSync('sessionId');
            } catch (e) {}
            if (!check || (check && sessionId)) {
                clearInterval(checkSessionIdInterval);
                wx.request({
                    url: urlPrefix + uri,
                    header: {
                        'Content-type': 'application/x-www-form-urlencoded',
                        'SessionId': sessionId
                    },
                    method: method,
                    data: data,
                    success: res => {
                        if (res.data.err) {
                            reject(res.data.err);
                        } else {
                            resolve(res.data.data)
                        }
                    },
                    fail: err => {
                        if (err == '暂无相关用户信息') {
                            wx.removeStorage({
                                key: 'sessionId'
                            });
                            getApp().checkSession();
                        }
                        reject(err);
                    }
                })
            }
        }, 20);
    })
};


const get = function (url, data = {}, check = true) {
    return _request(url, data, 'GET', check);
};
const post = function (url, data = {}, check = true) {
    return _request(url, data, 'POST', check);
};

module.exports = {
    get: get,
    post: post
};