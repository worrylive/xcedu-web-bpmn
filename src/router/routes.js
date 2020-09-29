const routes = {
  name: 'layout',
  path: '/mfs-xxx',
  redirect: '/mfs-xxx/home',
  component: () => import('@page/layout.vue'),
  children: [{
    name: 'home',
    path: 'home',
    component: () => import('@page/home/index')
  }]
}

export default [routes]
