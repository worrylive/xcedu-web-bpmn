const routes = {
  name: 'layout',
  path: '/mfs-bpmn',
  redirect: '/mfs-bpmn/home',
  component: () => import('@page/layout.vue'),
  children: [{
    name: 'home',
    path: 'home',
    component: () => import('@page/home/index')
  }]
}

export default [routes]
