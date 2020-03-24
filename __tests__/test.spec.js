
import HelloWorld from '@/components/HelloWorld.vue'
// eslint-disable-next-line no-unused-vars
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
/* 
    这个组件需要 做的 单元测试：
    先说这里 的业务逻辑：
    只有点击事件的触发，但是 会触发两个 条件；
    1、if => true 为 会调用 vuex 的 action 方法， 会 让 对应的 state.list 的值 发生变化
    2、if => false 为 会调用 route 的 push 方法 跳转到另一个页面

    这里需要测试的东西：
    1、初始快照比对 整个页面的 渲染
    2、if => true 的时候：
        不要测试的：
            1、action 对于 list 数组的 逻辑，这个是属于 $store 需要 测试的 用例
            2、不需要 测试 在 commit 后 渲染到 组件 是否成功这件事，这是属于 vue 框架的，
        需要测试的：
            就是在 事件 触发的 时候，只要求 对应的 commit 这个动作触发
    3、if => false 的时候：
        不需要测试的：
            1、router发生变化 跳转导致整个页面的 重定向 
        需要测试的：
            就是 事件 触发的 时候，只要求 router 的 push方法 调用就可以了
*/
// 为了 给 组件 添加 属性 或者 覆盖有的 东西



const creatConfig = (overrides) => {
  const mocks = {
    // Vue Router
    $router: {
      push: () => { }
    },
    // Vuex
    $store: {
      state: { list: [{ id: "2", title: "mock-test" }] },
      commit: () => { }
    }
  };
  const propsData = { id: "2" };
  return Object.assign({ mocks, propsData }, overrides);
}
describe('测试 HelloWorld 的 addToCart 的 逻辑测试', () => {
  describe('测试 addToCart方法', () => {
    let localVue = null;
    beforeEach(() => {
      localVue = createLocalVue();
      /* localVue.use(VueRouter);
      router = new VueRouter(); */
    })

    it('if 为 true', () => {
      const config = creatConfig();
      // 这里 只是 模拟了 commit 的这个 方法
      const spy = jest.spyOn(config.mocks.$store, 'commit');

      // 这里才是 把 config 配置到 对应的 HelloWord，并 覆盖 对应的 东西
      const Wrapper = shallowMount(HelloWorld, {
        localVue,
        ...config
      });
      Wrapper.find('button').trigger('click')
      // console.log(Wrapper.find('h2').text());

      // expect(Wrapper).toMatchSnapshot();
      expect(spy).toHaveBeenCalled()
    })

    it('if 为 false', () => {
      const config = creatConfig({
        methods: {
          check() {
            return false;
          }
        }
      });
      console.log(config);
      const spy = jest.spyOn(config.mocks.$router, 'push');
      const Wrapper = shallowMount(HelloWorld, {
        localVue,
        ...config
      });
      
      // expect(Wrapper.vm.check()).toBeFalsy();
      Wrapper.find('button').trigger('click');
      // const route = routes.options.routes.find(item => item.name === 'About');
      // console.log(route);
      expect(spy).toHaveBeenCalledWith({ name: "About" });
    })

    // toHaveBeenCalledWith的含义就是 ，证明当前被调用的时候，有这个参数的传参
    /* it('测试 toHaveBeenCalledWith 的含义', () => {
        const fun = function (test) {
            return test;
        }
        const fn = jest.fn(fun);
        fn(3);
        // 这样会报错
        // expect(fn).toHaveBeenCalledWith(1)
        expect(fn).toHaveBeenCalledWith(3)
    }) */
  })


})

/* 剩下的任务：
    1、vue cli3 配置 代理
    2、测试 axios 的 逻辑的 编写，封装一层 请求；
    3、对于 mock axios 的 方法；
    // axios.get.mockResolvedValue(resp);
    // 考虑这块 封装好后，用 Vue.use() 方式 当 插件 集成进去，不放如 mixin中，放到 原生；(工厂函数)
*/
import axios from 'axios';
Utils = {};
Utils.$http = axios;
Utils.getJson = function ({url, success, error, params = {}, isShowPop = false, urlParams, isFile,method="post",timeout="35000",cancelInsFun}) {
    if (!url) return;
    let loadingInstance;
    if (isShowPop) {
      loadingInstance = Loading.service({
        fullscreen: true,
        customClass: 'loading page-loading'
      });
    }
    let opts = {
      method,
      url,
      timeout,//毫秒
      data: params,
      params: urlParams,
      cancelToken: new Utils.$http.CancelToken(function executor(c) {
        cancelInsFun instanceof Function && cancelInsFun(c);
      })
    }
    if (isFile) {
      opts.headers = {
        'Content-Type': 'multipart/form-data'
      }
    }
    Utils.$http(opts)
      .then(function (res) {
        if (isShowPop) {
          loadingInstance.close()
        }
        if (res.data.code == '0') {
          Utils.showTip("", '', '', res.data.msg)
          if (typeof success == 'function') success(res.data)
        } else {
          Utils.showTip('error', '', '', res.data.msg);
          if (typeof error == 'function') error(res.data)
        }
      }, function (err) {
        if (isShowPop) {
          loadingInstance.close();
        }
        Utils.showTip('error', 'error', '-1');
        if (typeof error == 'function') error(err)
      })
  }