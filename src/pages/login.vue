<template>
    <div class="login">
        <div class="container">
            <a href="/#/index"><img src="/imgs/login-logo.png" alt=""></a>
        </div>
        <div class="wrapper">
            <div class="container">
                <!--用户登录-->
                <div class="login-form" v-if="type == 0">
                    <h3>
                        <span class="checked">帐号登录</span><span class="sep-line">|</span><span>扫码登录</span>
                    </h3>
                    <div class="input">
                        <input type="text" placeholder="请输入帐号" v-model="username">
                    </div>
                    <div class="input">
                        <input type="password" placeholder="请输入密码" v-model="password">
                    </div>
                    <div class="btn-box">
                        <a href="javascript:;" class="btn" @click="login">登录</a>
                    </div>
                    <div class="tips">
                        <div class="sms" @click="register"><input type="checkbox" checked>同意小米二手车用户协议</div>
                        <div class="reg"><span @click="type=1">立即注册</span><span>|</span><span @click="type=2">忘记密码？</span></div>
                    </div>
                </div>

                <!--用户注册-->
                <div class="login-form" v-if="type == 1">
                    <h3>
                        <span class="checked">用户注册</span>
                    </h3>
                    <div class="input">
                        <input type="text" placeholder="请输入用户名" v-model="username">
                    </div>
                    <div class="input">
                        <input type="password" placeholder="请输入密码" v-model="password">
                    </div>
                    <div class="input">
                        <input type="password" placeholder="请再次输入密码" v-model="repassword">
                    </div>
                    <div class="input">
                        <div class="towinput">
                            <input type="text" class="phone" placeholder="请输入手机号" v-model="phone">
                            <span class="sep-line">|</span>
                            <input type="text" class="code" placeholder="输入验证码" v-model="code">
                            <el-button type="text" :disabled="codeMsg!='发送验证码'" @click="sendCode">{{codeMsg}}</el-button>
                        </div>
                    </div>
                    <div class="btn-box">
                        <a href="javascript:;" class="btn" @click="register">注册</a>
                    </div>
                    <div class="tips">
                        <div class="sms" @click="register"><input type="checkbox" checked>同意小米二手车用户协议</div>
                        <div class="reg"><span @click="type=0">立即登录</span><span>|</span><span @click="type=2">忘记密码？</span></div>
                    </div>
                </div>

                <!--忘记密码-->
                <div class="login-form" v-if="type == 2">
                    <h3>
                        <span class="checked">忘记密码</span>
                    </h3>
                    <div class="input">
                        <input type="text" placeholder="请输入用户名" v-model="username">
                    </div>
                    <div class="input">
                        <div class="towinput">
                            <input type="text" class="phone" placeholder="请输入手机号" v-model="phone">
                            <span class="sep-line">|</span>
                            <input type="text" class="code" placeholder="输入验证码" v-model="code">
                            <el-button type="text" :disabled="codeMsg!='发送验证码'" @click="sendCode">{{codeMsg}}</el-button>
                        </div>
                    </div>
                    <div class="input">
                        <input type="password" placeholder="请输入新密码" v-model="password">
                    </div>
                    <div class="input">
                        <input type="password" placeholder="请再次输入新密码" v-model="repassword">
                    </div>
                    <div class="btn-box">
                        <a href="javascript:;" class="btn" @click="login">修改密码</a>
                    </div>
                    <div class="tips">
                        <div class="sms" @click="updatePassword"><input type="checkbox" checked>同意小米二手车用户协议</div>
                        <div class="reg"><span @click="type=0">立即登录</span><span>|</span><span @click="type=1">立即注册？</span></div>
                    </div>
                </div>

            </div>
        </div>
        <div class="footer">
            <div class="footer-link">
                <a href="https://www.imooc.com/u/1343480" target="_blank">河畔一角主页</a><span>|</span>
                <a href="https://coding.imooc.com/class/113.html" target="_blank">Vue全栈课程</a><span>|</span>
                <a href="https://coding.imooc.com/class/236.html" target="_blank">React全家桶课程</a><span>|</span>
                <a href="https://coding.imooc.com/class/343.html" target="_blank">微信支付专项课程（H5+小程序/云+Node+MongoDB）</a>
            </div>
            <p class="copyright">Copyright ©2019 mi.futurefe.com All Rights Reserved.</p>
        </div>
    </div>
</template>

<script>
    import {Message} from 'element-ui'
    export default {
        name: 'login',
        data(){
            return {
                type:'0',// 0 显示登陆 1 显示注册 2 忘记密码
                username: '',
                password: '',
                repassword:'',
                phone:'',
                code:'',
                userId: '',
                codeMsg:'发送验证码',
                timerid:'',//定时器ID
            }
        },
        mounted() {
            this.$vaptcha.getInvisibleVaptcha()
                .then(obj => {
                    obj.listen('pass', () => {
                        this.token = obj.getToken()
                        //this.login()
                        console.log("验证成功")
                    })
                    this.captcha = obj
                })
        },
        methods: {
            sendCode(){
                let phone = this.phone;
                if (phone == '' || !/\d{11}/.test(phone)) {
                    Message.warning("请输入正确格式的手机号")
                    return;
                }
                this.axios.get(`/sso/getAuthCode?telephone=${phone}`).then(res=>{
                    Message.info(res);
                    let count = 60;
                    this.codeMsg = `${count}秒后可发送`;
                    this.timerid = setInterval(() => {
                        this.codeMsg = `${--count}秒后可发送`;
                        if (count == 0){
                            this.codeMsg = '发送验证码';
                            clearInterval(this.timerid);
                        }
                    },1000);
                })
            },
            login(){
                let {username,password} = this;
                this.axios.get(`/sso/login?username=${username}&password=${password}`,).then((res) => {
                    this.$cookie.set('token', res.tokenHead+res.token,{expires: 'Session'});
                    this.axios.interceptors.request.use(config => {
                        config.headers['Authorization'] = this.$cookie.get("token") || '';
                        return config;
                    })
                    this.$store.dispatch('saveUserName',res.username)
                    this.$router.push({
                        name: 'index',
                        params: {
                            from: 'login'
                        }
                    });
                })
            },
            register(){
                let {username,password,repassword,phone,code} = this;
                if (username == '') {
                    Message.warning("请输入用户名");
                    return;
                }else if (password == '') {
                    Message.warning("请输入密码")
                    return;
                }else if (repassword == '') {
                    Message.warning("请输入确认密码")
                    return;
                }else if (password != repassword) {
                    Message.warning("两次输入的密码不一致")
                    return;
                }else if (phone == '') {
                    Message.warning("请输入合法手手机号")
                    return;
                }else if (code == '') {
                    Message.warning("请输入验证码")
                    return;
                }
                let postData = this.$qs.stringify({
                    username:username,
                    password:password,
                    telephone:phone,
                    authCode:code
                })
                this.axios.post('/sso/register',postData).then((res) => {
                    console.log(res)
                    if (res == 200) {
                        this.type = '0';
                    }
                });
            },
            updatePassword(){
                // 忘记密码

            },
        }
    }
</script>
<style lang="scss">
    .login{
        &>.container{
            height:113px;
            img{
                width:auto;
                height:100%;
            }
        }
        .wrapper{
            background:url('/imgs/login-bg2.webp') no-repeat center;
            .container{
                height:576px;
                .login-form{
                    box-sizing: border-box;
                    padding-left: 31px;
                    padding-right: 31px;
                    width:410px;
                    height:510px;
                    background-color:#ffffff;
                    position:absolute;
                    bottom:29px;
                    right:0;
                    h3{
                        line-height:23px;
                        font-size:24px;
                        text-align:center;
                        margin:40px auto 49px;
                        .checked{
                            color:#FF6600;
                        }
                        .sep-line{
                            margin:0 32px;
                        }
                    }
                    .validCode{
                        .vaptcha-init-main {
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-color: #EEEEEE;
                        }
                        .vaptcha-init-loading {
                            display: table-cell;
                            vertical-align: middle;
                            text-align: center
                        }
                        .vaptcha-init-loading>a {
                            display: inline-block;
                            width: 18px;
                            height: 18px;
                            border: none;
                        }
                        .vaptcha-init-loading>a img {
                            vertical-align: middle
                        }
                        .vaptcha-init-loading .vaptcha-text {
                            font-family: sans-serif;
                            font-size: 12px;
                            color: #CCCCCC;
                            vertical-align: middle
                        }
                    }
                    .input{
                        display:inline-block;
                        width:348px;
                        height:50px;
                        border:1px solid #E5E5E5;
                        margin-bottom:20px;
                        input{
                            width: 100%;
                            height: 100%;
                            border: none;
                            padding: 18px;
                        }
                        .towinput{
                            height: 100%;
                            .phone{
                                width: 35%;
                                height: 100%;
                                border: none;
                            }
                            .code{
                                width: 31%;
                                height: 100%;
                                border: none;
                            }
                            .sep-line{
                                width: 4%;
                                font-size: 30px;
                                opacity: 0.6;
                            }
                            .btn-small{
                                display: inline-block;
                                width: 30%;
                                height: 100%;
                                text-align: center;
                                background-color: #FF6600;
                                color: #ffffff;
                                border: none;
                                cursor: pointer;
                            }
                        }
                    }
                    .btn{
                        width:100%;
                        line-height:50px;
                        margin-top:10px;
                        font-size:16px;
                    }
                    .tips{
                        margin-top:14px;
                        display:flex;
                        justify-content:space-between;
                        font-size:14px;
                        cursor:pointer;
                        .sms{
                            color:#FF6600;
                        }
                        .reg{
                            color:#999999;
                            span{
                                margin:0 7px;
                            }
                        }
                    }
                }
            }
        }
        .footer{
            height:100px;
            padding-top:60px;
            color:#999999;
            font-size:16px;
            text-align:center;
            .footer-link{
                a{
                    color:#999999;
                    display:inline-block;
                }
                span{
                    margin:0 10px;
                }
            }
            .copyright{
                margin-top:13px;
            }
        }
    }
</style>
