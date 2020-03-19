
import HelloWorld from '@/components/HelloWorld.vue'
import { mount, shallowMount } from '@vue/test-utils'
import router from "@/router";

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
    const $props = { id: "2" };
    return Object.assign({ mocks, $props }, overrides);
}
describe('测试 HelloWorld 的 addToCart 的 逻辑测试', () => {
    describe('测试 addToCart方法', () => {
        it('if 为 true', () => {
            const config = creatConfig();
            // 这里 只是 模拟了 commit 的这个 方法
            const spy = jest.spyOn(config.mocks.$store, 'commit');

            // 这里才是 把 config 配置到 对应的 HelloWord，并 覆盖 对应的 东西
            const Wrapper = shallowMount(HelloWorld, config);
            Wrapper.find('button').trigger('click')
            // console.log(Wrapper.find('h2').text());

            // expect(Wrapper).toMatchSnapshot();
            expect(spy).toHaveBeenCalled()
        })

        it('if 为 false', () => {
            const config = creatConfig({ check: () => false });
            const spy = jest.spyOn(config.mocks.$router, 'push');

            const Wrapper = shallowMount(HelloWorld, config);
            Wrapper.find('button').trigger('click');
            // console.log(router);
            const route = router.options.routes.find(item => item.name === 'About');
            console.log(route);

            expect(spy).toBe(route)
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