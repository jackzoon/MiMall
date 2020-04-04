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
    if (this.$cookie.get('token')) {
      this.getUser();
      this.getCartCount();
    }
  },
  methods: {
    getUser(){
      this.axios.get('/sso/username').then((res={}) => {
        this.$store.dispatch('saveUserName', res);
      })
    },
    getCartCount(){
      this.axios.get('/cart/findCartList').then(res => {
        this.$store.dispatch('saveCartCount',res.length);
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
