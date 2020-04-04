<template>
    <div class="order-list">
        <order-header title="订单列表">
            <template v-slot:tip>
                <span>请谨防钓鱼链接或诈骗电话，了解更多></span>
            </template>
        </order-header>
        <div class="wrapper">
            <div class="container">
                <div class="order-box">
                    <loading v-if="loading"></loading>
                    <div class="order" v-for="(order,index) in list" :key="index">
                        <div class="order-title">
                            <div class="item-info fl">
                                {{order.order.createTime | dateFormat}}
                                <span>|</span>
                                {{order.order.receiverContact}}
                                <span>|</span>
                                订单号：{{order.order.id}}
                                <span>|</span>
                                {{order.order.payType == 1 ? '在线支付' : '货到付款'}}
                            </div>
                            <div class="item-money fr">
                                <span>应付金额：</span>
                                <span class="money">{{order.order.totalMoney | currency}}</span>
                            </div>
                        </div>
                        <div class="order-content clearfix">
                            <div class="good-box fl">
                                <div class="good-list" v-for="(item,i) in order.orderitem" :key="i">
                                    <div class="good-img">
                                        <img v-lazy="item.image" alt="">
                                    </div>
                                    <div class="good-name">
                                        <div class="p-name">{{item.name}}</div>
                                        <div class="p-money">{{item.price | currency}}{{'X' + item.num}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="good-state fr" v-if="order.order.payStatus == 1">
                                <a href="javascript:;">{{order.order.payStatus == 0 ? '未付款':'已支付'}}</a>
                            </div>
                            <div class="good-state fr" v-else>
                                <a href="javascript:;" @click="goPay(order.order.orderId)">未付款</a>
                            </div>
                        </div>
                    </div>
                    <div class="load-more" v-if="false">
                        <el-button type="primary" :loading="loading" @click="loadMore">加载更多</el-button>
                    </div>
                    <div class="scroll-more"
                         v-infinite-scroll="scrollMore"
                         infinite-scroll-disabled="true"
                         infinite-scroll-distance="410"
                         v-if="false"
                    >
                        <img src="/imgs/loading-svg/loading-spinning-bubbles.svg" alt="" v-show="loading">
                    </div>
                    <el-pagination class="pagination"
                        background
                        layout="prev, pager, next"
                        :pageSize="pageSize"
                        :total="total"
                        @current-change="handleChange"
                    >
                    </el-pagination>
                    <no-data v-if="!loading && list.length==0"></no-data>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import OrderHeader from "../components/OrderHeader";
    import Loading from "../components/Loading";
    import NoData from "../components/NoData";
    import {Pagination} from 'element-ui';
    import '../util/util';
    export default {
        name: 'order-list',
        components:{
            OrderHeader,
            Loading,
            NoData,
            [Pagination.name]:Pagination,
        },
        data(){
            return{
                loading: true,
                list: [],
                pageSize: 10,
                pageNum:1,
                total:0
            }
        },
        mounted() {
            this.getOrderList();
        },
        methods: {
            getOrderList(){
                this.axios.get('/order/findOrderList',{
                    params:{
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                }).then((res)=>{
                    this.list = res.list;
                    this.total = res.total;
                    this.loading = false;
                }).catch(()=>{
                    this.loading = false;
                })
            },
            goPay(orderNo){
                this.$router.push({
                    path: '/order/pay',
                    query:{
                        orderNo
                    }
                })
            },
            handleChange(pageNum) {
                this.pageNum = pageNum;
                this.getOrderList()
            }
        },
        filters: {
            currency(val) {
                if (!val) return '0.00';
                return '￥' + (val/100/10000).toFixed(2) + '万元'
            },
            nameFilter(val){
                return val.split(' ')[0];
            },
            dateFormat(val){
                return (new Date(val)).Format("yyyy-MM-dd hh:mm:ss");
            }
        },
    }
</script>
<style lang="scss">
    @import './../assets/scss/config.scss';
    @import './../assets/scss/mixin.scss';
    .order-list{
        .wrapper{
            background-color:$colorJ;
            padding-top:33px;
            padding-bottom:110px;
            .order-box{
                .order{
                    @include border();
                    background-color:$colorG;
                    margin-bottom:31px;
                    &:last-child{
                        margin-bottom:0;
                    }
                    .order-title{
                        @include height(74px);
                        background-color:$colorK;
                        padding:0 43px;
                        font-size:16px;
                        color:$colorC;
                        .item-info{
                            span{
                                margin:0 9px;
                            }
                        }
                        .money{
                            font-size:26px;
                            color:$colorB;
                        }
                    }
                    .order-content{
                        padding:0 43px;
                        .good-box{
                            width:88%;
                            .good-list{
                                display: flex;
                                align-items: center;
                                height:145px;
                                .good-img{
                                    width:112px;
                                    img{
                                        width:100%;
                                    }
                                }
                                .good-name{
                                    margin-left: 20px;
                                    font-size:20px;
                                    color:$colorB;
                                }
                            }
                        }
                        .good-state{
                            @include height(145px);
                            font-size: 20px;
                            color:$colorA;
                            a{
                                color:$colorA;
                            }
                        }
                    }
                }
                .pagination{
                    text-align:right;
                }
                .el-pagination.is-background .el-pager li:not(.disabled).active{
                    background-color: #FF6600;
                }
                .el-button--primary{
                    background-color: #FF6600;
                    border-color: #FF6600;
                }
                .load-more,.scroll-more{
                    text-align:center;
                }
            }
        }
    }
</style>
