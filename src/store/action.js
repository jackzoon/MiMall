/**
 * 商城Vuex-actions
 */
export default {
    saveUserName(contenxt, username) {
        contenxt.commit('saveUserName', username);
    },
    saveCartCount(context, count) {
        context.commit('saveCartCount', count);
    }
}
