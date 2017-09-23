import axios from 'axios'
import qs from 'qs'


// 允许跨域情况下携带cookie
axios.defaults.withCredentials = true
// 设置超时时间
axios.defaults.timeout = 100000
// 标识这是一个 ajax 请求
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'


axios.interceptors.response.use(response => {
  if (response.data.retcode === 2000000) {
    return response.data.data || response.data
  }
  else {
    throw Error(response.data.msg || '服务异常')
  }
})

export default {
  /**
   *
   */
  post(url, params) {
    return axios.post(url, qs.stringify(params))
  },

  /**
   *
   */
  get(url, params = {}) {
    return axios.get(url, { params })
  },
}
