
import router from '@/router';
import axios from 'axios'; // 引入axios
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据
import { toastFail, toastSuccess } from '@/utils/notice';

axios.defaults.baseURL = '/api'//要访问的接口的api
axios.defaults.timeout = 5000; //5s内服务器没响应则请求失败

//post请求时，我们需要加上一个请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

/*
 *我们在发送请求前可以进行一个请求的拦截，为什么要拦截呢，我们拦截请求是用来做什么的呢？比如，有些请求是需要用户登录之后才能访问的，
 *或者post请求的时候，我们需要序列化我们提交的数据。这时候，我们可以在请求被发送之前进行一个拦截，从而进行我们想要的操作。
**/

//先导入vuex，因为我们要使用到里面的状态对象
import store from 'vuex'

//添加请求拦截器
axios.interceptors.request.use(config => {
    //每次发送请求前判断vuex中是否存在token
    //如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    //即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    config.headers.Authorization = window.sessionStorage.getItem('token');//把token加到请求头中
    console.log(config);
    return config;
}, error => {
    return Promise.reject(error);
});

//添加响应拦截器
axios.interceptors.response.use(response => {
    // 2xx 的状态码都会触发该函数
    // 对响应数据做点什么
    if (response.status === 200) {    //只有200才是成功        
        switch (response.data.code) {
            case 401://token错误，用户在前端篡改了token，拒绝登录
                router.push('/login');
                return Promise.reject(response);
        }
        return Promise.resolve(response);

    } else {
        return Promise.reject(response);
    }
}, error => {
    // 对不是2xx的状态码触发该函数
    // 对响应错误做点什么
    console.log(error.response.status);
    if (error.response.status) {

        switch (error.response.status) {
            case 403://token过期，对用户提示,清除本地token和清空vuex中token对象
                sessionStorage.removeItem('token');
                break;
            case 404://请求不存在
                router.push('/notFound');
                break;
            case 500://服务器错误
                router.push('/serverError');
                break;
            default:
                toastFail(this, '非法请求！');
        }
    }
    return Promise.reject(error);
})

//get请求，不带参数
export function get1(url) {
    return new Promise((resolve, reject) => {
        axios.get(url).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data);
        })
    })
}

//get请求，带参数
export function get2(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data);
        })
    })
}

//post请求，不带参数
export function post1(url) {
    return new Promise((resolve, reject) => {
        axios.post(url, {}).then(res => {//post请求需要序列化
            resolve(res.data);
        }).catch(err => {
            reject(err.data);
        })
    })
}

//post请求，带参数
export function post2(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params).then(res => {//post请求需要序列化
            resolve(res.data);
        }).catch(err => {
            reject(err.data);
        })
    })
}


export function uploadPicture(url, formData) {
    return new Promise((resolve, reject) => {
        axios({
            method: "post",
            headers: {
                "Content-Type": "multipart/form-data"
            },
            url: url,
            data: formData
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err.data)
        })
    })
}





