import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios'
import router from '@/router/index'
import NProgress from '@/utils/nprogress'

const env = import.meta.env //环境变量
const isUseProxy = env.VITE_OPEN_PROXY //是否开启代理
const baseURL = env.VITE_APP_API_BASEURL // BaseUrl

export class Request {
  instance: AxiosInstance
  baseConfig: AxiosRequestConfig = {
    //根据环境变量动态指定BaseUrl
    baseURL: env.DEV && isUseProxy === 'true' ? '/proxy/' : baseURL,
    timeout: 60000
  }

  constructor(config: AxiosRequestConfig) {
    /* 实例 */
    this.instance = axios.create(Object.assign(this.baseConfig, config))
    /* 请求拦截 */
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        //携带token
        const token = localStorage.getItem('token') as string
        if (token) {
          config.headers!.Authorization = 'Bearer ' + token
        }
        return config
      },
      (err: AxiosError) => {
        return Promise.reject(err)
      }
    )
    /* 响应拦截 */
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const result: Result<any> = response.data
        const { status, message } = result
        if (status === 200) {
          //成功
        } else {
          if (status === 401) {
            //token失效跳转到登录页
            router.push('/welcome')
          }
          ElMessage.error(message)
          return Promise.reject(response.data)
        }
        NProgress.done()
        return response.data
      },
      (err: AxiosError) => {
        let message = ''
        switch (err.response?.status) {
          case 400:
            message = '请求错误(400)'
            break
          case 401:
            message = '未授权，请重新登录(401)'
            break
          case 403:
            message = '拒绝访问(403)'
            break
          case 404:
            message = '请求出错(404)'
            break
          case 408:
            message = '请求超时(408)'
            break
          case 500:
            message = '服务器错误(500)'
            break
          case 501:
            message = '服务未实现(501)'
            break
          case 502:
            message = '网络错误(502)'
            break
          case 503:
            message = '服务不可用(503)'
            break
          case 504:
            message = '网络超时(504)'
            break
          case 505:
            message = 'HTTP版本不受支持(505)'
            break
          default:
            message = `连接出错(${err.response?.status})!`
        }
        ElMessage({
          message: `${message}，请检查网络或联系管理员！`,
          type: 'error'
        })
        return Promise.reject(err.response)
      }
    )
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.get(url, config)
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.post(url, data, config)
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.put(url, data, config)
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.delete(url, config)
  }
}

export default new Request({})

// import axios from 'axios'
// import router from '@/router/index'
// import NProgress from '@/utils/nprogress'

// const api = axios.create({
//   baseURL:
//     import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true'
//       ? '/proxy/'
//       : import.meta.env.VITE_APP_API_BASEURL,
//   timeout: 1000 * 60
// })

// /* 请求拦截 */
// api.interceptors.request.use((request) => {
//   NProgress.start()
//   //如果存在token，每次请求带上token信息
//   const token = localStorage.getItem('token')
//   if (token) {
//     request.headers.Authorization = 'Bearer ' + token
//   }
//   return request
// })

// /* 响应拦截 */
// api.interceptors.response.use(
//   (response) => {
//     const { data } = response
//     // 根据status返回不同的信息
//     if (data.status === 200) {
//       //成功
//     } else {
//       ElMessage.error(data.message)
//       //token失效跳转到登录页
//       if (data.status === 401) {
//         router.push('/welcome')
//       }
//       return Promise.reject(data)
//     }
//     NProgress.done()
//     return Promise.resolve(data)
//   },
//   (error) => {
//     let message = error.message
//     if (message === 'Network Error') {
//       message = '后端网络故障'
//     } else if (message.includes('timeout')) {
//       message = '接口请求超时'
//     } else if (message.includes('Request failed with status code')) {
//       message = `接口${message.substr(message.length - 3)}异常`
//     }
//     ElMessage.error(message)
//     return Promise.reject(error)
//   }
// )

// export default api
