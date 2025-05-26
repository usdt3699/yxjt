import * as mtypes from './mutation-types.js'

export default {
  namespaced:true,
  state: {
    sidebar: {
      opened: false,
    },
    Loading: {
      show: false,
      contain: '',
    },
    imageCarousel: {
      show: false,
      imageList: [],
      currentIndex: '',
    },
    app: {
      visitedViews: [],
    },
  },
  mutations: {
    [mtypes.MODAL.CHANGE_SIDEBAR_STATE] (state, payload) {
      state.sidebar.opened = payload.opened
    },
    [mtypes.MODAL.CHANGE_LOADING_STATE] (state, payload) {
      // state.Loading = payload
    },
    [mtypes.MODAL.CHANGE_IMAGE_CAROUSEL_STATE] (state, payload) {
      state.imageCarousel = payload
    },
    [mtypes.MODAL.ADD_VISITE_STATE] (state, payload) {
      if (state.app.visitedViews.some(v => v.path === payload.path)) return
      state.app.visitedViews.push({ name: payload.name, path: payload.path })
    },
    [mtypes.MODAL.DEL_VISITE_STATE] (state, payload) {
      let index
      for (const [i, v] of state.app.visitedViews.entries()) {
        if (v.path === payload.path) {
          index = i
          break
        }
      }
      state.app.visitedViews.splice(index, 1)
    },
  },
  actions: {
    changeSiderbarState ({ commit }, payload) {
      commit(mtypes.MODAL.CHANGE_SIDEBAR_STATE, payload)
    },
    changeLoadingState ({ commit }, payload) {
      commit(mtypes.MODAL.CHANGE_LOADING_STATE, payload)
    },
    changeImageCarouselState ({ commit }, payload) {
      commit(mtypes.MODAL.CHANGE_IMAGE_CAROUSEL_STATE, payload)
    },
    addVisitedViews ({ commit }, payload) {
      commit(mtypes.MODAL.ADD_VISITE_STATE, payload)
    },
    delVisitedViews ({ commit, state }, payload) {
      return new Promise(resolve => {
        commit(mtypes.MODAL.DEL_VISITE_STATE, payload)
        resolve(state.app.visitedViews)
      })
    },
  },
} 
