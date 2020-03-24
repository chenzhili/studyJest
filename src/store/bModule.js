export default {
    state:{
        countB:1
    },
    mutations:{
        increment(state){
            state.countB++;
        }
    },
    actions:{
        async incrementActionB(context){
            console.log(context);
        }
    },
    getters:{}
}