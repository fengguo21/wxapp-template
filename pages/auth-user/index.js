const app = getApp();
const req = app.globalData.req;
Page({

    /**
     * 页面的初始数据
     */
    data: {},
    getUserinfo: function (e) {
        if (e.detail.userInfo !== undefined) {
            wx.showLoading({
              title: '授权登录中...'
            })
            req.post('save_userinfo.php', {
                'iv': e.detail.iv,
                'encryptedData': e.detail.encryptedData
            })
                .then(res => {
                    app.globalData.userInfo = res.data;
                    wx.hideLoading();
                    wx.showToast({
                      title: '授权成功!'
                    });
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 1000);

                })
                .catch(err => {
                    wx.showToast({
                        title: '获取用户信息失败',
                        icon: 'none'
                    })
                })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})