import Vue from 'vue'
import Vuex from 'vuex'
import { socketWrite } from '../socket'
import Bus from '../bus'

Vue.use(Vuex)

const state = {
  connect: false,
  routes: null
}

const mutations = {
  SET_CONNECT(state, status) {
    state.connect = status
    if (status) {
      Bus.$emit('message', { type: 'success', message: 'Hi, you have been connected!' })
    } else {
      Bus.$emit('message', { type: 'error', message: 'Socket has been closed.' })
    }
  },
  SET_URL(state, data) {
    console.log(data)
    state.routes = data
    Bus.$emit('message', { type: 'success', message: 'Skeleton page has been updated.' })
  },
  SET_MSG(state, { type, message }) {
    Bus.$emit('message', { type, message })
  }
}

const actions = {
  GET_CONNECT({ commit }, status) {
    commit('SET_CONNECT', status)
  },
  GET_URL({ commit }, data) {
    commit('SET_URL', data)
  },
  WRITE_SHELL({ commit }) {
    socketWrite('writeShellFile')
  },
  SAVE_CODE ({ commit }, value) {
    socketWrite('saveShellFile', value)
  },
  WRITE_SHELL_SUCCESS({ commit }, message) {
    commit('SET_MSG', {type: 'success', message })
  }
}

const store = new Vuex.Store({
  actions,
  mutations,
  state,
  getters: {}
})

export default store
