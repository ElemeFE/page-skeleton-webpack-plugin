import Vue from 'vue'
import Vuex from 'vuex'
import { socketWrite } from '../socket'

Vue.use(Vuex)

const shake = (list, type, msg) => {
  list.push({ type, msg })
  if (list.length >= 8) list.shift()
}

const state = {
  connect: false,
  url: '',
  msgList: []
}

const mutations = {
  SET_CONNECT(state, status) {
    state.connect = status
    if (status) {
      shake(state.msgList, 'server', 'Hi, you have been connected!')
    } else {
      shake(state.msgList, 'server', 'Sorry, socket closed!')
    }
  },
  SET_URL(state, url) {
    state.url = url
    shake(state.msgList, 'server', 'Preview page has been updated!')
  },
  SET_MSG(state, { user, msg }) {
    shake(state.msgList, user, msg)
  }
}

const actions = {
  GET_CONNECT({ commit }, status) {
    commit('SET_MSG', { user: 'me', msg: 'Hi, server?' })
    commit('SET_CONNECT', status)
  },
  GET_URL({ commit }, url) {
    commit('SET_MSG', { user: 'me', msg: 'Hi, Preview page updated? please give me the new URL.' })
    commit('SET_URL', url)
  },
  WRITE_SHELL({ commit }) {
    commit('SET_MSG', { user: 'me', msg: 'Hi, Please write the shell.html file for me.' })
    socketWrite('ok')
  },
  WRITE_SHELL_SUCCESS({ commit }, msg) {
    commit('SET_MSG', {user: 'server', msg })
  }
}

const store = new Vuex.Store({
  actions,
  mutations,
  state,
  getters: {}
})

export default store
