<template>
    <div class="index">
        <div class="container">
            <div class="swiper-box">
                <div class="nav-menu">
                    <ul class="menu-wrap">
                        <li class="menu-item">
                            <a href="javascript:;">奥迪</a>
                        </li>
                        <li class="menu-item">
                            <a href="javascript:;">宝马</a>
                            <div class="children"></div>
                        </li>
                        <li class="menu-item">
                            <a href="javascript:;">奔驰</a>
                        </li>
                        <li class="menu-item">
                            <a href="javascript:;">沃尔沃</a>
                        </li>
                        <li class="menu-item">
                            <a href="javascript:;">保时捷</a>
                        </li>
                        <li class="menu-item">
                            <a href="javascript:;">凯迪拉克</a>
                        </li>
                        <li class="menu-item">
                            <a href="javascript:;">哈弗</a>
                        </li>
                    </ul>
                </div>
                <swiper :options="swiperOption">
                    <swiper-slide v-for="(item,index) in sliderList" :key="index">
                        <a :href="'/#/detail/'+item.productId"><img :src="item.image" alt=""></a>
                    </swiper-slide>
                    <!-- Optional controls -->
                    <div class="swiper-pagination"  slot="pagination"></div>
                    <div class="swiper-button-prev" slot="button-prev"></div>
                    <div class="swiper-button-next" slot="button-next"></div>
                </swiper>
            </div>
            <div class="ads-box">
                <a :href="'/#/detail/'+item.id" v-for="(item,index) in adsList" :key="index">
                    <img v-lazy="item.img" alt="点击购买">
                </a>
            </div>
            <div class="banner">
                <div class="item-video">
                    <div class="video-bg" @click="showSlide='slideDown'">
                        <img src="/imgs/video-btn2.png" alt="点击播放视频">
                    </div>
                    <div class="video-box" v-if="showSlide">
                        <div class="overlay" ></div>
                        <div class="video" :class="showSlide">
                            <span class="icon-close" @click="closeVideo"></span>
                            <video src="/imgs/pdp1233.mp4" muted autoplay controls="controls"></video>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="product-box">
            <div class="container">
                <h2>品牌二手车</h2>
                <div class="wrapper">
                    <div class="banner-left">
                        <a href="/#/product/35">
                            <img v-lazy="'https://fastcar.oss-cn-shenzhen.aliyuncs.com/goods/ad-left1.jpg'" alt="">
                        </a>
                    </div>
                    <div class="list-box">
                        <div class="list" v-for="(arr,i) in productList" :key="i">
                            <div class="item" v-for="(item,j) in arr" :key="j">
                                <span :class="{'new-pro': j % 2=== 0}">新品</span>
                                <div class="item-img">
                                    <img v-lazy="item.image" alt="">
                                </div>
                                <div class="item-info">
                                    <h3>{{item.name | nameFilter}}</h3>
                                    <p>{{item.mileage}}</p>
                                    <p class="price" @click="addCart(item.id)">{{item.price | currency}}</p>
                                </div>
                            </div>
                        </div>
                        <el-pagination class="pagination"
                                       background
                                       layout="prev, pager, next"
                                       :pageSize="pageSize"
                                       :total="total"
                                       @current-change="handleChange"
                        >
                        </el-pagination>
                    </div>

                </div>
            </div>

        </div>
        <service-bar></service-bar>
        <modal title="提示" sure-text="查看购物车" btn-type="1" modal-type="middle"
               :show-modal="showModal" @submit="goToCart" @cancel="showModal=false">
            <template v-slot:body>
                <p>商品添加成功!</p>
            </template>
        </modal>
    </div>
</template>

<script>
import ServiceBar from "../components/ServiceBar";
import {swiper, swiperSlide} from 'vue-awesome-swiper';
import Modal from "../components/Modal";
import 'swiper/dist/css/swiper.css';
import {Pagination} from 'element-ui';
export default {
    name: 'index',
    components: {
        ServiceBar,
        swiper,
        swiperSlide,
        Modal,
        [Pagination.name]:Pagination,
    },
    data() {
        return {
            swiperOption: {
                autoplay:true,
                loop: true,
                effect: 'cube',
                cubeEffect: {
                    slideShadows: true,
                    shadow: true,
                    shadowOffset: 100,
                    shadowScale: 0.6
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }
            },
            showSlide:'',
            sliderList: [],
            menuList:[
                [
                    {
                        id: '30',
                        img: '/imgs/item-box-1.png',
                        name: '小米CC9'
                    },
                    {
                        id: '31',
                        img: '/imgs/item-box-2.png',
                        name: '小米8青春版'
                    },
                    {
                        id: '32',
                        img: '/imgs/item-box-3.jpg',
                        name: 'RedMi K20 Pro'
                    },
                    {
                        id: '33',
                        img: '/imgs/item-box-4.jpg',
                        name: '移动4G专区'
                    }
                ],
                [
                    0,0,0,0
                ],
                [
                    0,0,0,0
                ],
                [
                    0,0,0,0
                ],
                [
                    0,0,0,0
                ],
                [
                    0,0,0,0
                ]
            ],
            adsList: [
                {
                    id: '1',
                    img: 'https://fastcar.oss-cn-shenzhen.aliyuncs.com/goods/Snipaste_2020-03-27_22-19-38.png'
                },
                {
                    id: '10',
                    img: 'https://fastcar.oss-cn-shenzhen.aliyuncs.com/goods/cq5dam.resized.img.585.low.time1560761736936.jpg'
                },
                {
                    id: '1047',
                    img: 'https://fastcar.oss-cn-shenzhen.aliyuncs.com/goods/Snipaste_2020-03-27_22-30-09.png'
                },
                {
                    id: '1164',
                    img: 'https://fastcar.oss-cn-shenzhen.aliyuncs.com/goods/2000_1125.jpg'
                }
            ],
            phoneList: [],
            showModal: false,
            productList:[],
            pageSize: 10,
            pageNum:1,
            total:0
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
    methods: {
        init() {
            // 获取首页轮播图数据
            this.getSliderList();
            this.axios.get('/product/productListByBrand',{
                params:{
                    brandId: 1,
                }
            }).then((res) => {
                this.phoneList = res;
            });
            this.getProductByPage();
        },
        getProductByPage() {
            this.axios.get(`/product/productList?pageSize=${this.pageSize}&pageNum=${this.pageNum}`).then(res=>{
                this.productList = res.list;
                this.total = res.total;
                this.productList = [res.list.slice(0,4),res.list.slice(4,8)];
            })
        },
        getSliderList(){
          this.axios.get(`/index/findSliderList`).then(res=>{
              this.sliderList = res;
          })
        },
        handleChange(pageNum) {
            this.pageNum = pageNum;
            this.getProductByPage()
        },
        addCart(id) {
            this.axios.get('/cart/addItem',{
                params:{
                    productId: id,
                    num:1
                }
            }).then((res) => {
                this.showModal = true;
                this.$store.dispatch('saveCartCount', res.length);
            }).catch(() => {
                this.showModal = true;
            })
        },
        goToCart(){
            this.$router.push('/cart');
        },
        closeVideo(){
            this.showSlide='slideUp';
            setTimeout(()=>{
                this.showSlide='';
            },600)
        }
    },
    mounted() {
        this.init();
    }
}
</script>

<style lang="scss">
    @import "./../assets/scss/mixin";
    @import "./../assets/scss/config";
    .index {
        .swiper-box{
            .nav-menu {
                position: absolute;
                width: 264px;
                height: 451px;
                z-index: 9;
                padding: 26px 0;
                background-color: #55585A7A;
                box-sizing: border-box;
                .menu-wrap{
                    .menu-item {
                        height: 50px;
                        line-height: 50px;
                        a {
                            position: relative;
                            display: block;
                            font-size: 16px;
                            color: #ffffff;
                            padding-left: 30px;
                            &:after {
                                position: absolute;
                                right: 30px;
                                top: 17.5px;
                                content: ' ';
                                @include bgImg(10px, 15px, '/imgs/icon-arrow.png');
                            }
                        }
                    }
                }
            }
            .swiper-container{
                height: 451px;
                .swiper-button-prev{
                    left: 274px;
                }
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .ads-box {
            @include flex();
            margin-top: 14px;
            margin-bottom: 31px ;
            a {
                width: 296px;
                height: 167px;
            }
        }
        .banner {
            margin-bottom: 20px;
            .item-video{
                height:440px;
                background-color:#070708;
                margin-bottom:76px;
                color:#FFFFFF;
                text-align:center;
                h2{
                    font-size:60px;
                    padding-top:82px;
                    margin-bottom:47px;
                }
                p{
                    font-size:24px;
                    margin-bottom:58px;
                }
                .video-bg{
                    background: url('https://assets.volvocars.com/zh-cn/~/media/china/images/cars/s90-20180521/gallerygrid/0601_05.jpg?w=1536') no-repeat center;
                    background-size:cover;
                    width:1226px;
                    height:440px;
                    margin:0 auto 120px;
                    cursor:pointer;
                    img {
                        margin-top: 13%;
                        height: 100px;
                        width: 100px;
                        opacity: 0.5;
                        z-index: 9;
                    }
                }
                .video-box{
                    .overlay{
                        @include position(fixed);
                        background-color:#333333;
                        opacity:.4;
                        z-index:10;
                    }
                    @keyframes slideDown {
                        from{
                            top:-50%;
                            opacity: 0;
                        }
                        to{
                            top: 50%;
                            opacity: 1;
                        }
                    }
                    @keyframes slideUp {
                        from{
                            top:50%;
                            opacity: 1;
                        }
                        to{
                            top: -50%;
                            opacity: 0;
                        }
                    }
                    .video {
                        position: fixed;
                        top: -50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 10;
                        width: 1000px;
                        height: 536px;
                        opacity: 1;
                        &.slideDown{
                            animation: slideDown .6s linear;
                            top:50%;
                        }
                        &.slideUp{
                            animation: slideUp .6s linear;
                        }
                        .icon-close {
                            position: absolute;
                            top: 20px;
                            right: 20px;
                            @include bgImg(20px, 20px, '/imgs/icon-close.png');
                            cursor: pointer;
                            z-index: 11;
                        }

                        video {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            outline: none;
                        }
                    }
                }
            }
        }
        .product-box {
            background-color: $colorJ;
            padding: 30px 0 50px;
            h2 {
                font-size: $fontF;
                height: 21px;
                line-height: 21px;
                color: $colorB;
                margin-bottom: 20px;
            }
            .wrapper {
                display: flex;
                .banner-left{
                    margin-right: 16px;
                    img{
                        width: 224px;
                        height: 619px;
                    }
                }
                .list-box{
                    .list {
                        display: flex;
                        @include flex();
                        width: 986px;
                        margin-bottom: 14px;
                        &:last-child{
                            margin-bottom: 0;
                        }
                        .item {
                            width: 236px;
                            height: 302px;
                            background-color: $colorG;
                            text-align: center;
                            span {
                                display: inline-block;
                                width: 67px;
                                height: 24px;
                                font-size: 14px;
                                line-height: 24px;
                                color: $colorG;
                                &.new-pro {
                                    background-color: #7ECF68;
                                }

                                &.kill-pro {
                                    background-color: #E82626;
                                }
                            }
                            .item-img{
                                img{
                                    height: 185px;
                                    width: 190px;
                                }
                            }
                            .item-info{
                                h3 {
                                    font-size: $fontJ;
                                    color: $colorB;
                                    line-height: $fontJ;
                                    font-weight: bold;
                                }
                                p{
                                    color: $colorD;
                                    line-height: 13px;
                                    margin: 6px auto 13px;
                                }
                                .price {
                                    color: #F20A0A;
                                    font-size: $fontJ;
                                    font-weight: bold;
                                    cursor: pointer;
                                    &:after {
                                        @include bgImg(22px, 22px, '/imgs/icon-cart-hover.png');
                                        content: ' ';
                                        margin-left: 5px;
                                        vertical-align: middle;
                                    }
                                }
                            }
                        }
                    }
                    .pagination{
                        text-align:center;
                    }
                }
            }
        }
    }
</style>
