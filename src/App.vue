<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {

  },
  data() {
    return {

    }
  },
  mounted() {
    this.getUser();
    this.getCartCount();
  },
  methods: {
    getUser(){
      this.axios.get('/user').then(() => {
        // todo 保存到vuex里面
      })
    },
    getCartCount(){
      this.axios.get('/carts/products/sum').then(() => {
        // todo 购物车
      })
    }
  }
}
</script>

<style lang="scss">
  @import './assets/scss/config.scss';
  @import './assets/scss/reset.scss';
  @import './assets/scss/button.scss';
</style>
