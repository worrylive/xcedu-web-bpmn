import { boot } from 'xc-share'
import router from './router'
import store from './store'
import App from './App.vue'
const { bootstrap, mount, unmount } = boot(store, router, App)
export { bootstrap, mount, unmount }
