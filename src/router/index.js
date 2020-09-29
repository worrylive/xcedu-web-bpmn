import routes from './routes'

// 由于Vue Vue-router 是 global import， vue-roter 会自动调用  vue-router的install方法， 所以不再需要手动use
// Vue.use(VueRouter)

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return originalReplace.call(this, location).catch(err => err)
}
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(error => error)
}
export default new VueRouter({
  mode: 'history',
  routes
})
