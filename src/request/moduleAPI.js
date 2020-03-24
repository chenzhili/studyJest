/**
  * article模块接口列表
  */

 import base from './baseURL'; // 导入接口域名列表
 import axios from './http'; // 导入http中创建的axios实例
 import qs from 'qs'; // 根据需求是否导入qs模块
 
 const moduleAPI = {
     // 新闻列表
     articleList () {
         return axios.get(`${base.sq}/topics`);
     },
     // 新闻详情,演示
     articleDetail (id, params) {
         return axios.get(`${base.sq}/topic/${id}`, {
             params: params
         });
     },
     // post提交
     login (params) {
         return axios.post(`${base.sq}/accesstoken`, qs.stringify(params));
     }
 }
 
 export default moduleAPI;

 /* 这里 集成 axios 的需求
    1、如何集成 取消请求的 方法；
    2、断网处理 和 router 以及 vuex 一起用
    3、token 失效 的做法 
    4、把这个 模块 以 插件的 方式 集成 到 vue 中 ，Vue.use()
 */
 