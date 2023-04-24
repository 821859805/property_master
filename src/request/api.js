/**
 * api接口统一管理
 * 好处：当后期工程量越来越大，要维护时就不用去找页面修改了，直接在api里修改
 */

import {get,post} from './http'

export const loginApi = p => post('/login',p);//登录接口



