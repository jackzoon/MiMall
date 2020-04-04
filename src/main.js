import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import VueAxios from 'vue-axios'
import VueLazyLozd from 'vue-lazyload'
import VueCookie from 'vue-cookie'
import store from './store'
import {Message,Select,Option,Button } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import env from './env'

// mock 开关
const mock = false;
if(mock){
  require('./mock/api')
}


// 根据前端的跨域方式做调整
axios.defaults.baseURL = '/api';
axios.defaults.timeout = 8000;
// 根据环境变量获取不同的请求地址
// axios.defaults.baseURL = env.baseURL;
// 接口错误拦截
axios.interceptors.request.use(config => {
    //if (true) {
    config.headers['Authorization'] = VueCookie.get("token") || '';
    //}
    return config;
})
axios.interceptors.response.use(function (response) {
    let res = response.data;
    let path = location.hash;
    if(res.code === 200){
      return res.data;
    }else if(res.code === 401){
        if (path != '#/index') {
            window.location.href = '/#/login';
        }
        return Promise.reject(res);
    }else{
        Message.warning(res.message);
      return Promise.reject(res);
    }
  },(error)=>{
    let res = error.response;
    Message.error(res);
    return Promise.reject(error);
});

Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(VueCookie);
Vue.use(VueAxios,axios);
Vue.use(VueLazyLozd,{
    loading: '/imgs/loading-svg/loading-bars.svg'
});
Vue.config.productionTip = false
Vue.prototype.$qs = qs;
new Vue({
    store,
  router,
  render: h => h(App)
}).$mount('#app')
