import axios from 'axios'
import Vue from 'vue'
import Cookies from 'js-cookie';

const PORER_URL = 'http://qpaper.mxzhzl.com/'
// const PORER_URL = 'http://localhost/'
// const CLIENT_ID = 4
// const CLIENT_SECRET = 'L60f0vTWC-7labXVGDoOj2HVns-YqkbO'
const _this = Vue.prototype

 function authLogin() {
  this.$router.push({path:'/login'})  
 }

function tokenRequest({method = 'get', baseURL, url, param, data,contentType = 'application/x-www-form-urlencoded'}) {
  let token = Cookies.get('access_token')
  if (!token) {
    authLogin()
    return
  }
  axios.defaults.baseURL = baseURL
  axios.defaults.transformRequest = [function (data) {
    // Do whatever you want to transform the data
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
  }]
  axios.defaults.withCredentials = true
  axios.defaults.headers.post['Content-Type'] = contentType;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return axios({
    method: method,
    url: url,
    params: param,
    data:data
  }).catch((error) => {
    if (error.response.status === 401) {
      authLogin()
    }
  })
}

// function request({method = 'get', baseURL, url, param = null, data = null}) {
//   axios.defaults.baseURL = baseURL
//   axios.defaults.transformRequest = [function (data) {
//     // Do whatever you want to transform the data
//     let ret = ''
//     for (let it in data) {
//       ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
//     }
//     return ret
//   }]
//   axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//   return axios({
//     method: method,
//     url: url,
//     param: param,
//     data: data
//   })
// }

export default {
  PORER_URL,
  tokenRequest,
}