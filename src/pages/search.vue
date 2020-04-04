<template>
    <div class="search">
        <div class="product-box">
            <div class="container">
                <h2>品牌二手车</h2>
                <div class="option">
                    <el-button @click="sort" :class="sortOrder=='#' ? 'active':''">综合排序</el-button>
                    <el-button @click="sortPrice(1)" :class="sortOrder=='ASC' ? 'active':''">价格从低到高</el-button>
                    <el-button @click="sortPrice(0)" :class="sortOrder=='DESC' ? 'active':''">价格从高到底</el-button>
                </div>
                <div class="wrapper">
                    <div class="list-box">
                        <div class="list" v-for="(arr,i) in productList" :key="i">
                            <div class="item" v-for="(item,j) in arr" :key="j">
                                <a :href="'/#/detail/'+item.productId">
                                    <div class="item-img">
                                        <img v-lazy="item.image" alt="">
                                    </div>
                                    <div class="item-info">
                                        <h3 v-html="item.name"></h3>
                                        <p>{{item.mileage}}</p>
                                        <p class="price">{{item.price | currency}}</p>
                                    </div>
                                </a>
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
    </div>
</template>

<script>
    import ServiceBar from "../components/ServiceBar";
    import 'swiper/dist/css/swiper.css';
    import {Pagination} from 'element-ui';
    export default {
        name: 'index',
        components: {
            ServiceBar,
            [Pagination.name]:Pagination,
        },
        data() {
            return {
                phoneList: [],
                productList:[],
                pageSize: 10,
                pageNum:1,
                total:0,
                sortOrder:'#',
                keywords:this.$route.params.keywords,  //获取keywords
            }
        },
        watch:{
            '$route'() {
                this.keywords = this.$route.params.keywords
                this.search()
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
                this.search();
            },
            search() {
                let postData = this.$qs.stringify({
                    keywords:this.keywords,
                    sortOrder:this.sortOrder,
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                })
                this.axios.post(`/search/search`,postData).then(res=>{
                    this.total = res.total;
                    this.productList = [res.rows.slice(0,5),res.rows.slice(5,10)];
                })
            },
            sort(){
                this.sortOrder = '#'
                this.search();
            },
            sortPrice(type){
                if (type == 0) {
                    this.sortOrder = "DESC"
                }else{
                    this.sortOrder = "ASC"
                }
                this.search();
            },
            handleChange(pageNum) {
                this.pageNum = pageNum;
                this.search();
            },
            addCart(id) {
                this.axios.get('/cart/addItem',{
                    params:{
                        productId: id,
                        num:1
                    }
                }).then((res) => {
                    this.$store.dispatch('saveCartCount', res.length);
                }).catch(() => {
                    this.showModal = true;
                })
            },
            goToCart(){
                this.$router.push('/cart');
            },
        },
        mounted() {
            this.init();
        }
    }
</script>

<style lang="scss">
    @import "./../assets/scss/mixin";
    @import "./../assets/scss/config";
    .search {
        .product-box {
            .option{
                a{
                    margin-left: 10px;
                    font-size: 18px;
                }
                margin-bottom: 20px;
                .active{
                    color: #FF6600;
                }
            }
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
                .list-box{
                    .list {
                        display: flex;
                        @include flex();
                        width: 1210px;
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
                                margin-top: 25px;
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
