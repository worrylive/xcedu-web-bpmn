import { axios } from 'xc-share'

// 测试环境需要在请求url前加前缀
// const prefix = '/api-personalized'
// const prefix = ''

export function getUserInfo () {
  return axios.get('/api-base/users/userInfo')
}
