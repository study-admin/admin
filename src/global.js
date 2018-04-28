import axios from 'axios'
import Vue from 'vue'
import Cookies from 'js-cookie';

const PORER_URL = 'http://qpaper.mxzhzl.com/'

// const PORER_URL = 'http://localhost:8080/'
// const CLIENT_ID = 4
// const CLIENT_SECRET = 'L60f0vTWC-7labXVGDoOj2HVns-YqkbO'

 function authLogin() {
 }

function tokenRequest({method = 'get', baseURL, url, param, data,contentType = 'application/x-www-form-urlencoded'}) {
  let token = Cookies.get('access_token')
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
    if (error.response.status==500&&error.response.data.message=='The resource owner or authorization server denied the request.') {
      Cookies.set('access_token','')  
      window.location.href = 'http://localhost/#/login'                          
    }
    
  })
}
export default {
  PORER_URL,
  tokenRequest,
}