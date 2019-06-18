import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedUnit: '',
    options: []
  },
  mutations: {
    setUnit (state, payload) {
      state.selectedUnit = payload
    }
  },
  actions: {

  }
})
