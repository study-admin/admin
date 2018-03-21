import axios from 'axios'
import Vue from 'vue'

const PORER_URL = 'http://qpaper.mxzhzl.com/'
// const CLIENT_ID = 4
// const CLIENT_SECRET = 'L60f0vTWC-7labXVGDoOj2HVns-YqkbO'
const _this = Vue.prototype

// function authLogin() {
//   request({
//     method: 'post',
//     baseURL: PORER_URL,
//     url: 'api/oauth/access_token',
//     data: {
//       grant_type: 'password',
//       client_id: 1,
//       client_secret:'base64:QHlQ+oBcTcIFdIShPLvPOmu5ZChdY4fcA',
//       username,
//       passworld
//       // redirect_url: window.location.href
//     }
//   }).then(({data: data}) => {
//     _this.$cookie.set('access_token', data.access_token, '')
//     window.location.href = login_url;
//     return false
//   })
// }

function tokenRequest({method = 'get', baseURL, url, param, data,contentType = 'application/x-www-form-urlencoded'}) {
  let token = _this.$cookie.get('access_token')
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
    param: param,
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