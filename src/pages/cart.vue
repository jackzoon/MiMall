<template>
    <div class="cart">
        <order-header title="我的购物车">
            <template v-slot:tip>
                <span>温馨提示：产品是否购买成功，以最终下单为准哦，请尽快结算</span>
            </template>
        </order-header>
        <div class="wrapper">
            <div class="container">
                <div class="cart-box">
                    <ul class="cart-item-head">
                        <li class="col-1"><span class="checkbox" :class="{'checked':allChecked}" @click="toggleAll"></span>全选</li>
                        <li class="col-3">商品名称</li>
                        <li class="col-1">单价</li>
                        <li class="col-2">数量</li>
                        <li class="col-1">小计</li>
                        <li class="col-1">操作</li>
                    </ul>
                    <ul class="cart-item-list">
                        <li class="cart-item" v-for="(arr,index) in list" v-bind:key="index">
                            <div class="item-check">
                                <span class="checkbox" :class="{'checked':arr.checked}" @click="updateCart(arr)"></span>
                            </div>
                            <div class="item-name">
                                <img v-lazy="arr.item.image" alt="">
                                <span>{{arr.item.name}}</span>
                            </div>
                            <div class="item-price">{{arr.item.price | currency}}</div>
                            <div class="item-num">
                                <div class="num-box">
                                    <a href="javascript:;" @click="updateCart(arr,'-')">-</a>
                                    <span>{{arr.item.num}}</span>
                                    <a href="javascript:;" @click="updateCart(arr,'+')">+</a>
                                </div>
                            </div>
                            <div class="item-total">{{arr.item.money | currency}}</div>
                            <div class="item-del" @click="delProduct(arr)"></div>
                        </li>
                    </ul>
                </div>
                <div class="order-wrap clearfix">
                    <div class="cart-tip fl">
                        <a href="/#/index">继续购物</a>
                        共<span>{{list.length}}</span>件商品，已选择<span>{{checkedNum}}</span>件
                    </div>
                    <div class="total fr">
                        合计：<span>{{cartTotalPrice | currency}}</span>元
                        <a href="javascript:;" class="btn" @click="order">去结算</a>
                    </div>
                </div>
            </div>
        </div>
        <service-bar></service-bar>
        <nav-footer></nav-footer>
    </div>
</template>
<script>
    import OrderHeader from './../components/OrderHeader'
    import ServiceBar from './../components/ServiceBar'
    import NavFooter from './../components/NavFooter'
    import {Message} from 'element-ui'
    export default{
        name:'index',
        components:{
            OrderHeader,
            ServiceBar,
            NavFooter
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
        data(){
            return{
                list:[],    //商品列表
                allChecked:false,    //是否全选
                cartTotalPrice: 0,   //商品总金额
                checkedNum:0,   //选中商品数量
            }
        },
        mounted() {
            this.getCartList();
        },
        methods:{
            // 获取购物车列表
            getCartList() {
                this.axios.get('/cart/findCartList').then((res) => {
                    this.renderData(res);
                })
            },
            // 删除购物车商品
            delProduct(arr){
                this.axios.get(`/cart/deleteCheckedCart?productId=${arr.item.productId}`).then((res)=>{
                    Message.success('删除成功');
                    this.renderData(res);
                })
            },
            // 更新购物车数量和购物车单选状态
            updateCart(arr,type){
                let num = arr.item.num,
                    selected = arr.checked;
                if (type == '-') {
                    if (num == 1) {
                        Message.warning('商品至少保留一件');
                        return;
                    }
                    num = num - 1;
                } else if (type == '+') {
                    if (num >= arr.stock) {
                        Message.info('商品不能超过库存数量')
                        return;
                    }
                    num = num + 1;
                }else{
                    selected = !arr.checked;
                }
                this.axios.get(`/cart/updateItem?productId=${arr.item.productId}&checked=${selected}&num=${num}`).then((res) => {
                    this.renderData(res);
                })
            },
            // 控制全选功能
            toggleAll(){
                let url = this.allChecked ? '/cart/unSelectAll' : '/cart/selectAll';
                this.axios.get(url).then((res) => {
                    this.renderData(res);
                })
            },
            renderData(res){
                this.cartTotalPrice = 0;
                this.list = res || [];
                this.checkedNum = this.list.filter(item=>item.checked).length;
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].checked) {
                        this.cartTotalPrice += this.list[i].item.money;
                    }
                }
                if (this.list.length == this.checkedNum) {
                    this.allChecked = true;
                } else {
                    this.allChecked = false;
                }
            },
            // 购物车下单
            order(){
                let isCheck = this.list.every(item => !item.checked);
                if (isCheck) {
                    Message.warning('请选择一件商品');
                    return;
                }else {
                    this.$router.push('/order/confirm');
                }
            }
        }

    }
</script>
<style lang="scss">
    .cart{
        .wrapper{
            background-color:#F5F5F5;
            padding-top:30px;
            padding-bottom:114px;
            .cart-box{
                background-color:#fff;
                font-size:14px;
                color:#999999;
                text-align:center;
                .checkbox{
                    display: inline-block;
                    width: 22px;
                    height: 22px;
                    border: 1px solid #E5E5E5;
                    vertical-align: middle;
                    margin-right: 17px;
                    cursor:pointer;
                    &.checked{
                        background:url('/imgs/icon-gou.png') #FF6600 no-repeat center;
                        background-size:16px 12px;
                        border:none;
                    }
                }
                .cart-item-head{
                    display:flex;
                    height: 79px;
                    line-height: 79px;
                    .col-1{
                        flex:1;
                    }
                    .col-2{
                        flex:2;
                    }
                    .col-3{
                        flex:3;
                    }
                }
                .cart-item-list{
                    .cart-item{
                        display:flex;
                        align-items:center;
                        height:125px;
                        border-top:1px solid #E5E5E5;
                        font-size:16px;
                        .item-check{
                            flex:1;
                        }
                        .item-name{
                            flex:3;
                            font-size: 18px;
                            color: #333333;
                            display: flex;
                            align-items: center;
                            img{
                                width:80px;
                                height:80px;
                                vertical-align:middle;
                            }
                            span{
                                margin-left: 30px;
                            }
                        }
                        .item-price{
                            flex:1;
                            color:#333333;
                        }
                        .item-num{
                            flex:2;
                            .num-box{
                                display:inline-block;
                                width:150px;
                                height:40px;
                                line-height:40px;
                                border:1px solid #E5E5E5;
                                font-size:14px;
                                a{
                                    display:inline-block;
                                    width:50px;
                                    color:#333333;
                                }
                                span{
                                    display:inline-block;
                                    width:50px;
                                    color:#333333;
                                }
                            }
                        }
                        .item-total{
                            flex:1;
                            color:#FF6600;
                        }
                        .item-del{
                            flex:1;
                            width:14px;
                            height:12px;
                            background:url('/imgs/icon-close.png') no-repeat center;
                            background-size:contain;
                            cursor:pointer;
                        }
                    }
                }
            }
            .order-wrap{
                font-size:14px;
                color: #666666;
                margin-top: 20px;
                height: 50px;
                line-height: 50px;
                .cart-tip{
                    margin-left: 29px;
                    a{
                        color: #666666;
                        margin-right:37px;
                    }
                    span{
                        color:#FF6600;
                        margin:0 5px;
                    }
                }
                .total{
                    font-size:14px;
                    color:#FF6600;
                    span{
                        font-size:24px;
                    }
                    a{
                        width:202px;
                        height:50px;
                        line-height:50px;
                        font-size:18px;
                        margin-left:37px;
                    }
                }
            }
        }
    }
</style>
