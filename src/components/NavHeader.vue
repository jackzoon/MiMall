<template>
    <div class="header">
        <div class="nav-topbar">
            <div class="container">
                <div class="topbar-menu">
                    <a href="javascript:;">小米二手车</a>
                    <a href="javascript:;">MIUI</a>
                    <a href="javascript:;">云服务</a>
                    <a href="javascript:;">协议规则</a>
                </div>
                <div class="topbar-user">
                    <a href="javascript:;" v-if="username">{{username}}</a>
                    <a href="javascript:;" v-if="!username" @click="login">登录</a>
                    <a href="javascript:;" v-if="username" @click="logout">退出</a>
                    <a href="/#/order/list" v-if="username">我的订单</a>
                    <a href="javascript:;" class="my-cart" @click="goToCart"><span class="icon-cart"></span>购物车({{cartCount}})</a>
                </div>
            </div>
        </div>
        <div class="nav-header">
            <div class="container">
                <div class="header-logo">
                    <a href="/#/index"></a>
                </div>
                <div class="header-menu">
                    <div class="item-menu" v-for="(arr,i) in activityList" :key="i">
                        <span>{{arr.name}}</span>
                        <div class="children">
                            <ul>
                                <li class="product" v-for="(item,index) in arr.productList" :key="index">
                                    <a :href="'/#/detail/'+item.id" target="_blank">
                                        <div class="pro-img">
                                            <img v-lazy="item.image" :alt="item.name">
                                        </div>
                                        <div class="pro-name">{{item.name | nameFilter}}</div>
                                        <div class="pro-price">{{item.price | currency}}</div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
                <div class="header-search">
                    <div class="wrapper">
                        <input type="text" v-model="keywords">
                        <a :href="'/#/search/'+keywords" ></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {Message} from 'element-ui';
export default {
    name: 'nav-header',
    data(){
        return {
            phoneList:[],
            activityList:[],
            keywords:'',
        }
    },
    computed: {
      username(){
          return this.$store.state.username;
      },
        cartCount(){
          return this.$store.state.cartCount;
        }
    },
    filters: {
        currency(val) {
            if (!val) return '0.00';
            return '￥' + (val/100/10000).toFixed(2) + '万元'
        },
        nameFilter(val){
            return val.split(' ')[0];
        }
    },
    mounted() {
        this.getActivityList();
        let params = this.$route.params;
        if (params && params.from == 'login') {
            this.getCartCount();
        }
    },
    methods: {
        login() {
            this.$router.push('/login');
        },
        logout(){
          this.axios.post('/sso/logout').then(() => {
              Message.success('退出成功');
              this.$cookie.set('token','',{expires: '-1'});
              this.$store.dispatch('saveUserName', '');
              this.$store.dispatch('saveCartCount', '0');
          })
        },
        getActivityList() {
            this.axios.get(`/index/findActivityList`).then(res=>{
                this.activityList = res;
            })
        },
        goToCart(){
            this.$router.push('/cart');
        },
        getCartCount(){
            this.axios.get('/cart/findCartList').then(res => {
                this.$store.dispatch('saveCartCount',res.length);
            })
        },
        goToSearch() {
            this.$router.push('/search/奥迪')
        }
    }
}
</script>

<style lang="scss">
    @import './../assets/scss/base.scss';
    @import './../assets/scss/mixin.scss';
    @import "./../assets/scss/config.scss";
    .header {
        .nav-topbar{
            height: 39px;
            line-height: 39px;
            background-color: #333333;
            color: #B0B0B0;

            .container{
                @include flex();
                a{
                    display: inline-block;
                    color:#B0B0B0;
                    margin-right: 17px;
                }
                .my-cart {
                    width: 110px;
                    background-color: #FF6600;
                    text-align: center;
                    color: #ffffff;
                    margin-right: 0;
                    .icon-cart{
                        @include bgImg(16px,12px,'/imgs/icon-cart-checked.png');
                        margin-right: 4px;
                    }
                }
            }
        }
        .nav-header{
            .container{
                position: relative;
                height: 112px;
                @include flex();
                .header-menu {
                    display: inline-block;
                    padding-left: 209px;
                    width: 643px;
                    .item-menu{
                        display: inline-block;
                        color: #333333;
                        font-weight: bold;
                        font-size: 16px;
                        line-height: 112px;
                        margin-right: 20px;
                        span {
                            cursor: pointer;
                        }
                        &:hover{
                            color:$colorA;
                            .children{
                                height: 220px;
                                opacity: 1;
                            }
                        }
                        .children {
                            position: absolute;
                            top: 112px;
                            left: 0;
                            width: 1226px;
                            height: 0px;
                            opacity: 0;
                            overflow: hidden;
                            border-top: 1px solid #e5e5e5;
                            box-shadow: 0px 7px 6px 0px rgba(0, 0, 0, 0.11);
                            z-index: 10;
                            transition: height .5s;
                            background-color: #ffffff;
                            }
                            .product {
                                position: relative;
                                float: left;
                                width: 16.6%;
                                height: 220px;
                                font-size: 12px;
                                line-height: 12px;
                                text-align: center;
                                a{
                                    display: inline-block;
                                }
                                img {
                                    height: 111px;
                                    width: auto;
                                    margin-top: 26px;
                                }
                                .pro-img{
                                    height: 137px;
                                }
                                .pro-name {
                                    font-weight: bold;
                                    margin-top: 19px;
                                    margin-bottom: 8px;
                                    color: $colorB;
                                }
                                .pro-price{
                                    color: $colorA;
                                }
                                &:before {
                                    content: ' ';
                                    position: absolute;
                                    top: 28px;
                                    right: 0;
                                    border-left: 1px solid $colorF;
                                    height: 100px;
                                    width: 1px;
                                }
                                &:last-child:before{
                                    display: none;
                                }
                        }
                    }
                }
                .header-search {
                    width: 319px;
                    .wrapper{
                        height: 50px;
                        border: 1px solid #e0e0e0;
                        display: flex;
                        align-items: center;
                        input{
                            border:none;
                            box-sizing: border-box;
                            border-right: 1px solid #e0e0e0;
                            width: 264px;
                            height: 50px;
                            padding-left: 14px;
                        }
                        a{
                            @include bgImg(18px,18px,'/imgs/icon-search.png');
                            margin-left: 17px;
                        }
                    }
                }
            }
        }
    }
</style>
