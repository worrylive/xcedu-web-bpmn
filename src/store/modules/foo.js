const state = {
  foo: 'foo'
}

const getters = {
  foo: state => state.foo
}

const mutations = {
  setFoo (state, newVal) {
    state.foo = newVal
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
