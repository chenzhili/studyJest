# jest

## unit test(单元测试)概念 url：https://zhuanlan.zhihu.com/p/55960017

### 单元测试的方向
任何一个单元测试都应该包含：

    正常输入
        离散覆盖参数值域
    边界输入
        空值验证
        零值验证
        最大值验证
    非法输入
        入参数据类型非法
        内存溢出验证  (这个的测试方向不清楚)

前端单元测试的种类划分：
function
    异步function
    同步function
组件类
    根据不同框架生成的 ui层
接口类
    这块目前不用进行测试

### 单元测试对应的术语

幂等：对于单元测试来说，保证其幂等性非常重要，幂等就是在相同输入的前提下，其输出结果不随时间而改变（性质就是纯函数的性质）

mock(模拟)分类： mock的出现是因为 模拟是为了减轻 在真实环境下的一些功能点大量等待时间的出现 而 用 模拟相关功能 取消这段等待时间；
    
    mock数据
    mock环境

    mock事件：比如 react用 enzyme 的 模拟
    Mock模块/第三方包：比如 jest 中的 jest.mock('axios') 模拟这个模块
    mock函数/类

白盒覆盖：白盒覆盖就是测试用例要尽可能的覆盖程序内部的所有分支语句，从而整体性的保证代码质量

单元测试定级
    Level1：正常流程可用，即一个函数在输入正确的参数时，会有正确的输出 （常规输入的 预期 常规输出）
    Level2：异常流程可抛出逻辑异常，即输入参数有误时，不能抛出系统异常，而是用自己定义的逻辑异常通知上层调用代码其错误之处 （捕获功能异常防止程序退出，而是 自定义抛出错误 ====> 错误边界的捕获）
    Level3：极端情况和边界数据可用，对输入参数的边界情况也要单独测试，确保输出是正确有效的 （边界值的输入 正常 输出）
    Level4：所有分支、循环的逻辑走通，不能有任何流程是测试不到的    （功能分支的完善性）
    Level5：输出数据的所有字段验证，对有复杂数据结构的输出，确保每个字段都是正确的   （复杂数据结构的输出，保证 字段的有效性测试）

### 对于现在 virtual DOM 方式的框架测试 （vue，react，angular）
ui组件的测试用例的方向：
    API属性覆盖性测试用例
    DOM快照比对，幂等校验
    私有Utils函数测试用例，千万不能忽略Utils函数的测试用例，很多时候，bug就出在这上面


## 自动化单元测试 ======> jest URL：https://www.dazhuanlan.com/2019/11/08/5dc4590109202/?__cf_chl_jschl_tk__=93da97c566d6ab1aa23715bf5636ddc2cc1376f9-1584000914-0-Adsqh_yhwzcPGRmZeX6Oyq8GvGFGJ7q0Q5Yj-bpkg8IYjmNihG-Mn0SmhItc3DcAClvv3VTlxW-YPSX4d-nhYu18hlJizHOk7uTJXzqa830H17UNeKUz2XIIJK-2T45zdWklO_6UjGbrtKHx8FMvpXMwEtspoUfie9OruIvkR0J-0I2-SNtpasVNMOwssJiUY3yaCehZkHufmA0Sd1BITDJIeUn1sLlSQEyNO9lwV3wS2UX2NWH_ZzSR2hDzhHmzjPAhvVgmLITJlbVJzad8Q8Q4sX6ULCBHFTVd1tKWM8heBmotscMLdWd7e25-gx4QoQ


### 对于 vue 集成 jest 单元测试需要配置的 模块：
1、项目相关： jest + @vue/test-utils

2、为了解析模板 需要的 vue-jest

3、如果是用 babel 集成 的 需要 babel-jest
**********
在用 babel-jest 对于 以 vue 文件结尾 的 解析的时候 必须安装：注意：make sure to install babel-core@bridge
不然：要报错 Cannot find module 'babel-core'
**********

4、jest-serializer-vue 序列化快照信息的，jest.snapshotSerializers 放到

### 对于 react 集成 jest 单元测试 需要的 模块
1、项目相关：jest + enzyme(或者react-test-renderer)
模块包括：yarn add -D jest enzyme enzyme-adapter-react-16 enzyme-to-json
2、集成babel 需要 babel-jest
3、需要 jest 检查 canvas :yarn add -D jest-canvas-mock


### vue 需要测试 的点
1、要分清楚 哪些属于 业务的 测试，哪些是 属于 插件内部的 机制；

2、vue 组件的 测试  主要是 测试 当前这个 组件的 输入 和 输出，但是 不要 去做 不必要的 输入 和 输出；

3、当你只关心调用问题，不关心值的输出，这时候就可以 mock function，不用执行真实的 函数；
如：this.$router.push();其实我不需要关心他是否 真的打开新的页面，只关心 是否 调用，就能模拟 push这个方法；
jest.spyOn(Wrapper,{
    $router:{
        push:() => {}
    }
})

比如：
对于一个 业务的 method方法 中假设 有个 对于 router 跳转的：
1、只需要 证明当前这个 router 跳转到哪这个 渲染就是 vue-router 内部的 机制，不用管；
2、需要测试的 点，只是 router 的 输入的 push 方法 被调用了，就可以了；
```js
    // 用到的 jest 的 Object的 东西
    function createConfig(overrides) {
        const id = 1;
        const mocks = {
            // Vue Auth
            $auth: {
                check: () => false
            },
            // Vue Router
            $router: {
                push: () => { }
            },
            // Vuex
            $store: {
                state: [{ id }],
                commit: () => { }
            }
        };
        const propsData = { id };
        return Object.assign({ mocks, propsData }, overrides);
    }
    // 重要的方法
    const Wrapper = shallowMount('组件', createConfig()); // 第二参数 包含 挂载选项之外的选项时，则会将它们通过扩展覆写到其组件选项， 返回的 对象 就会 重写内部 包含的方法；因为 我们 只 需要 校验 方法 是否被调用
    const spy = jest.spyOn(obj,"function"); // 相当于 生成一个 mock.fn 这个 方法，模拟 当前的 function 这个方法，但是还未调用；
    expect(spy).toBeCalled(); // 这里这样就是 证明当前的 mock的function 被调用了
```

 
