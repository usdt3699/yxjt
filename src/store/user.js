import axios from "../net/axios";
import api from "@/net/api";

export default {
    namespaced: true,
    state: {
        userInfo: {},
        identifyInfo: {},
        bankCardInfo: {},
        userWallet: {},
    },
    mutations: {
        setUserInfo(state, payload) {
            state.userInfo = payload
        },
        setIdentifyInfo(state, payload) {
            state.identifyInfo = payload || {}
        },
        setBankCardInfo(state, payload) {
            state.bankCardInfo = payload
        },
        setUserWallet(state, payload) {
            state.userWallet = payload||{}
        },
    },
    actions: {
        getUserInfo({commit}, payload) {
            console.log('获取用户信息')
            axios.get(api.userInfo)
                .then(res => {
                    commit('setUserInfo', res.data.userInfo)
                })
                .catch(e => {

                })
        },
        getIdentifyInfo({commit}, payload) {
            console.log('获取实名信息')
            axios.get(api.identifyInfo)
                .then(res => {
                    commit('setIdentifyInfo', res.data)
                })
                .catch(e => {

                })
        },
        getBankCardInfo({commit}, payload) {
            console.log('获取银行卡信息')
            axios.get(api.bankCardInfo)
                .then(res => {
                    commit('setBankCardInfo', res.data)
                })
                .catch(e => {

                })
        },
        getUserWallet({commit}, payload) {
            console.log('')
            axios.get(api.userWallet)
                .then(res => {
                    const wallet = res.data.coinList.reduce((acc, coin) => {
                        acc[coin.name_en] = coin.num;
                        return acc;
                    }, {});
                    commit('setUserWallet', wallet)
                })
                .catch(e => {

                })
        },
    },
}

