/* import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [{title:"test", id:'12323'}]
  },
  mutations: {
    ADD_TO_CART(state){
      state.list.push({title:"aaaa", id:"2"});
    }
  },
  actions: {
  },
  modules: {
  }
}) */
/* 
  这是 store 封装的 解决方案
*/
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const requireModule = require.context("./", true, /.js$/);

console.log(process.env.NODE_ENV);

const store = ((Vuex) => {
    const modules = {};
    const reg = /^\.\/index/, nameReg = /^[\w\W]+?\/([a-zA-Z_]+)\.js$/;
    let module;
    let moduleName = '';
    requireModule.keys().forEach(rc => {
        moduleName = rc.replace(nameReg, '$1');
        if (reg.test(rc) === false) {
            module = requireModule(rc).default;
            modules[moduleName] = module;
        }
    })
    return new Vuex.Store({
        // 严格按照 commit 的方法进行 state 的修改，不然会报错
        strict: process.env.NODE_ENV !== 'production',
        modules,
        state: {
            count: 1
        },

        // 这个是唯一能够改变 state 状态的 地方
        mutations: {
            changeCount(...args) {
                console.log(args);
                // console.log(state);
                // state.count++;
            }
        },

        // 跟 vue 实例 内的 computed 一样，但是 当他 (state,getters)=>params=>fun 这时候 不会 缓存
        getters: {},

        // 这里 做 异步 状态 的请求 和 控制 
        actions: {},
        
    });
})(Vuex)

/* 
    注意 在 modules 模块 化后的不同 key的值： (有待验证)
        1、state 默认的 局部化；
        2、getters，actions，mutations 默认 的 全局化，就是 会触发 所有的 有关东西
        3、加入 namespaced 命名空间后，就会 局部化 上面三个， 如果 想调用 全局的：
            如果你希望使用全局 state 和 getter，rootState 和 rootGetters 会作为第三和第四参数传入 getter，也会通过 context 对象的属性传入 action。

            若需要在全局命名空间内分发 action 或提交 mutation，将 { root: true } 作为第三参数传给 dispatch 或 commit 即可

    验证的结果：
        state 在 模块 中的 不管 加没加 namespaced 他的 文件都在 vue 的 实例 this.$store 下的 key(模块)的 目录下

        getters、actions、mutations 就有区别了：
        模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应
        （意思就是指 没有 namespaced 为 false的 时候，在实例 上的 获取方法，this.$store.模块下的方法 ）

        如果 namespaced 为 true时，访问的 方式 this.$store.模块的目录.模块下的方法

        简写：const { mapState:aMapState, mapActions:aMapActions } = createNamespacedHelpers('aModule') 在 app.vue 中的写法；这种 必选要namespaced = true
*/

export default store;
