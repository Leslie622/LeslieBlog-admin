import axios from 'axios'

const api = axios.create({
  baseURL:
    import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true'
      ? '/proxy/'
      : import.meta.env.VITE_APP_API_BASEURL,
  timeout: 1000 * 60
})

/* 请求拦截 */
api.interceptors.request.use((request) => {
  //如果存在token，每次请求带上token信息
  const token = localStorage.getItem('token')
  if (token) {
    request.headers.Authorization = 'Bearer ' + token
  }
  return request
})

/* 响应拦截 */
api.interceptors.response.use(
  (response) => {
    // 根据status返回不同的信息
    if (response.data.status === 200) {
      ElMessage.success(response.data.message)
    } else {
      ElMessage.error(response.data.message)
      return Promise.reject(response.data)
    }
    return Promise.resolve(response.data)
  },
  (error) => {
    let message = error.message
    if (message === 'Network Error') {
      message = '后端网络故障'
    } else if (message.includes('timeout')) {
      message = '接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = `接口${message.substr(message.length - 3)}异常`
    }
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default api
