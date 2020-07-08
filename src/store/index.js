import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        // gotSession: false,
        user: null,
        offices: null
    },
    mutations: {
        setUser(state, user) {
            // state.gotSession = true;
            state.user = user;

            // if (user) {
            //     state.userIsTT = user.sso.isTT;
            //     state.userIsMaster = user.sso.masterStatus;
            // } else {
            //     state.userIsTT = false;
            //     state.userIsMaster = false;
            // }
        },
        setOffices(state, offices) {
            state.offices = offices;
        }
    }
});

export default store;