const {
    genLocation
} = require('../../common/utils')

// 管理员openid列表，可以在云开发管理页找到，是管理员的话可以看到公告栏页面入口，也可以通过云函数greetings的返回值openid来查看，还可以在本文件getGreetings方法里通过打印openid变量来查看
const MANAGER = ['']

const APP = getApp()
const isRemoved = APP.globalData.isRemoved

Page({
    data: {
        ...APP.globalData,
        isManager: false, // 当前用户是否为管理员
        musicIsPaused: false, // 是否暂停背景音乐
        activeIdx: isRemoved ? 0 : -1, // 祝福语轮播用，当前显示的祝福语索引值
        form: { // 表单信息
            name: '',
            num: '',
            greeting: ''
        },
        weddingTimeStr: [], // 格式化的婚礼日期列表

        // 以上变量都不用动，以下变量是需要手动修改的

        // 是否显示彩蛋（由于彩蛋我没有改动，显示的还是我本人的内容，所以我把它默认隐藏起来，方便别人抄作业）
        showEggs: false,

        // 祝福语列表
        greetings: isRemoved ? [
            // 云开发下架后显示的祝福语数据，可以在云开发环境销毁前把数据库的数据导出来并贴到这里
            {
                name: '新郎 & 新娘',
                num: 2,
                greeting: '欢迎大家来见证我们的幸福时刻，我们婚礼上见哦~'
            }, {
                name: '伴郎 & 伴娘',
                num: 2,
                greeting: '祝帅气的新郎和美丽的新娘新婚快乐~白头偕老💐'
            }
        ] : [],

        // 背景音乐（使用的陶喆的《爱很简单》git）
        music: {
            src: 'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/爱很简单.mp3', // 音频资源链接
            name: '爱，很简单', // 歌名
            singer: '陶喆' // 歌手名
        },

        // 酒店信息（通过页面上的「选择位置并获取定位信息」按钮可以获取定位信息，发布前记得把按钮注释起来）
        location: genLocation([{
          "name":"塞外御花园酒店",
          "address":"内蒙古自治区包头市九原区建设路中段马踏飞燕南侧",
          "latitude":40.618866,
          "longitude":109.943078
        }])[0],


        // 图片信息（其实就是婚纱照了）
        imgs: {
            // 封面图
            cover: 'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/封面.jpg',

            // 音乐封面
            poster: '../../images/音乐封面.jpg',

            // 另一半
            left: 'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/left.jpg',
            right: 'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/right.jpg',

            // 新郎独照
            husband: 'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/新郎照.jpg',

            // 新娘独照
            wife: 'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/新娘照.jpg',

            // 轮播图1
            swiper1: [
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/s1.jpg',
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/s2.jpg',
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/s3.jpg',
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/s4.jpg'
            ],

            // 连续图
            series: [
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/a5.jpg',
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/a4.jpg',
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/a1.jpg'
            ],

            // 左上图
            leftUp: 'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/左上.jpg',

            // 左下图
            leftDown: 'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/左下.jpg',

            // 四宫图
            map: [
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/40.jpg',
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/42.jpg',
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/41.jpg',
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/b1.JPG'
            ],

            // 轮播图2
            swiper2: [
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/底轮1.JPG',
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/底轮2.JPG',
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/底轮3.JPG',
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/底轮下.jpg'
            ],

            // 轮播图2下方常驻图
            swiper2Static: 'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/底轮下.JPG',

            // 轮播图3
            swiper3: [
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/d1.jpg',
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/d2.jpg',
                'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/d3.jpg'
            ],

            // 结尾图1
            end1: 'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/最后.jpg',

            // 结尾图2
            end2: 'https://res.wx.qq.com/t/fed_upload/9b5bad9c-216b-4fd5-a3da-01bdb3a5e832/end2.jpg'
        }
    },

    // 点击放大图片函数
    clickImg: function(e){
      var url = e.currentTarget.dataset.src;
      wx.previewImage({
        current: url,
        urls: [url],
      })
    },

    // 轮播图片
    clickImg_re: function(e){
      var url = e.currentTarget.dataset.src;
      var index = e.currentTarget.dataset.index;
      wx.previewImage({
        current: url[index],
        urls: url,
      })
    },

    // 小程序加载时，拉取表单信息并填充，以及格式化各种婚礼时间
    onLoad() {
        this.timer = null
        this.music = null
        this.isSubmit = false

        if (!isRemoved) {
          /* test
          wx.cloud.callFunction({
            name: 'greetings'
          }).then(({
              result: {
                  greeting,
                  openid
              }
          }) => {
            MANAGER.push(openid)
          })

          const my_db = wx.cloud.database()
          const kkk = my_db.collection('surveys')
          const _ = my_db.command
          kkk.where({
            _openid: _.not(_.eq(''))
          })
          .get()
          .then(my_res => {
            if(my_res.data.length > 0){
              my_res.data.forEach(item => {
                console.log(item._openid)
              });
            } else {
              console.log("not found");
            }
          })
          kkk.get({
            success: my_res => {
              if(my_res.data.length) {
                  MANAGER.push(my_res.data[0]._openid)
              }
            }
          })


          */ 
         //test over
            const db = wx.cloud.database()
            db.collection('surveys').get({
                success: res => {
                    if (res.data.length) {
                        const {
                            name,
                            num,
                            greeting
                        } = res.data[0]
                        this.setData({
                            form: {
                                name,
                                num,
                                greeting
                            }
                        })
                    }
                }
            })
        }

        this.lunisolarDate = this.selectComponent('#calendar').lunisolarDate
        this.setData({
            weddingTimeStr: [
                this.lunisolarDate.format('2024-10-07 12:28'),
                this.lunisolarDate.getSeason(),
                this.lunisolarDate.format('2024年10月07号  12:00'),
                this.lunisolarDate.format('农历九月初五  dddd'),
                this.lunisolarDate.format('2024年10月07号')
            ]
        })
    },

    // 小程序卸载时，取消自动拉取祝福语定时器，销毁背景音乐
    onUnload() {
        if (this.timer !== null) {
            clearInterval(this.timer)
            this.timer = null
        }

        if (this.music !== null) {
            this.music.stop()
            this.music = null
        }
    },

    // 小程序可见时，拉取祝福语，并设置定时器每20s重新拉取一次祝福语
    onShow() {
        if (!isRemoved) {
            // this.getGreetings()
            // this.timer === null && (this.timer = setInterval(() => this.getGreetings(), 20000));
        }
    },

    // 小程序不可见时，取消自动拉取祝福语定时器
    onHide() {
        if (this.timer !== null) {
            clearInterval(this.timer)
            this.timer = null
        }
    },

    // 小程序可用时，初始化背景音乐并自动播放
    onReady() {
        if (this.music === null) {
            this.music = wx.getBackgroundAudioManager()
            this.music.src = this.data.music.src
            this.music.title = this.data.music.name
            this.music.singer = this.data.music.singer
            this.music.coverImgUrl = 'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/音乐封面.jpg'
            this.music.audioType = "music"
            
            this.music.play();
            this.music.paused = false
        }
    },

    // 分享到会话
    onShareAppMessage() {
        return {
            title: '好久不见，婚礼见٩(๑^o^๑)۶',
            imageUrl: 'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/share.jpg'
        }
    },

    // 分享到朋友圈
    onShareTimeline() {
        return {
            title: '好久不见，婚礼见٩(๑^o^๑)۶',
            imageUrl: 'cloud://gz-wedding-8gwf2yh6f9a456d3.677a-gz-wedding-8gwf2yh6f9a456d3-1328999877/share.jpg'
        }
    },

    // 点击右上角音乐按钮控制音频播放和暂停
    toggleMusic() {
        if (this.music.paused) {
            this.music.play()
            this.setData({
                musicIsPaused: false
            })
        } else {
            this.music.pause()
            this.setData({
                musicIsPaused: true
            })
        }
    },

    // 打开酒店定位
    openLocation() {
        const {
            latitude,
            longitude,
            name,
            address
        } = this.data.location
        wx.openLocation({
            latitude,
            longitude,
            name,
            address
        })
    },

    // 仅用于获取定位信息，获取后会打印到控制台并写入到粘贴板，正式发布时记得注释起来
    chooseLocation() {
        wx.chooseLocation({
            success(res) {
                wx.setClipboardData({
                    data: JSON.stringify(res),
                    success() {
                        wx.showToast({
                            title: '已写入剪贴板'
                        })
                        console.log(res)
                    }
                })
            }
        })
    },

    // 呼叫
    call(e) {
        wx.makePhoneCall({
            phoneNumber: e.target.dataset.phone
        })
    },

    // 提交表单
    submit(e) {
        if (!this.isSubmit) {
            const {
                name,
                num
            } = e.detail.value
            if (name === '') {
                wx.showToast({
                    title: '要写上名字哦~',
                    icon: 'error'
                })
            } else if (num === '') {
                wx.showToast({
                    title: '要写上人数哦~',
                    icon: 'error'
                })
            } else if (!/^[1-9]\d*$/.test(num)) {
                wx.showToast({
                    title: '人数不对哦~',
                    icon: 'error'
                })
            } else {
                if (isRemoved) {
                    wx.showToast({
                        title: '婚礼结束了哦~'
                    })
                } else {
                    this.isSubmit = true
                    const wording = this.data.form.name ? '更新' : '提交';
                    wx.showLoading({
                        title: `${wording}中`
                    })
                    wx.cloud.callFunction({
                        name: 'surveys',
                        data: e.detail.value
                    }).then(({
                        result: {
                            name,
                            num,
                            greeting,
                            _id
                        }
                    }) => {
                        const greetings = this.data.greetings
                        !greetings.some(item => {
                            if (item._id === _id) { // 如果找到了该祝福语，更新之
                                item.greeting = greeting
                                return true
                            }
                            return false
                        }) && greetings.push({ // 如果没有找到，追加之
                            name,
                            greeting,
                            _id
                        })
                        this.setData({
                            form: {
                                name,
                                num,
                                greeting
                            },
                            greetings
                        })
                        this.isSubmit = false
                        wx.showToast({
                            title: `${wording}成功`,
                            icon: 'success'
                        })
                    })
                }
            }
        }
    },

    // 获取祝福语
    getGreetings() {
        wx.cloud.callFunction({
            name: 'greetings'
        }).then(({
            result: {
                greetings,
                openid
            }
        }) => {
            const isManager = MANAGER.indexOf(openid) > -1
            greetings.length && this.setData(this.data.activeIdx === -1 ? {
                isManager,
                greetings,
                activeIdx: 0
            } : {
                isManager,
                greetings
            })
        })
    },

    // 轮播动画结束时切换到下一个
    onAnimationend() {
        this.setData({
            activeIdx: (this.data.activeIdx === this.data.greetings.length - 1) ? 0 : (this.data.activeIdx + 1)
        })
    },

    // 跳转到联系新郎新娘板块
    goPhone() {
        wx.pageScrollTo({
            selector: '.phone',
            offsetTop: -200
        })
    },

    // 跳转到写表单板块
    goWrite() {
        wx.pageScrollTo({
            selector: '.form',
            offsetTop: -200
        })
    },

    // 跳转到公告栏页面
    goInfo() {
        wx.navigateTo({
            url: '../info/index'
        })
    }
})