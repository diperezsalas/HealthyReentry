import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        user: [],
        userReady: false
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setUserReady(state, userReady) {
            state.userReady = userReady;
        }
    }
});

export default store;