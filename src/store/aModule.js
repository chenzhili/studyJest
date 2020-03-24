export default {
    namespaced: true,
    state:{
        countA:1
    },
    mutations:{
        increment(state){
            state.countA++;
        }
    },
    actions:{
        async incrementActionA(context){
            console.log(context);
        }
    },
    getters:{}
}