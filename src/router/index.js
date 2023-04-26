import Vue from 'vue'
import VueRouter from 'vue-router'
import '../assets/css/global.css'


Vue.use(VueRouter)

const Login = () => import('../components/Login.vue')
const ownerHome = () => import('../components/owner/ownerHome.vue')
const ownerInfo = () => import('../components/owner/ownerInfo.vue')
const complaintInfo = () => import('../components/owner/complaintInfo.vue')
const repairInfo = () => import('../components/owner/repairInfo.vue')
const alterPwd = () => import('../components/owner/alterPwd.vue')
const payInfo = () =>import('../components/owner/payInfo.vue')
const adminHome = () => import('../components/admin/adminHome.vue')
const complaintAdmin = () => import('../components/admin/basicModule/complaintAdmin.vue')
const feeAdmin = () => import('../components/admin/basicModule/feeAdmin.vue')
const repairAdmin = () => import('../components/admin/basicModule/repairAdmin.vue')
const buildingAdmin = () => import('../components/admin/extendModule/buildingAdmin.vue')
const ownerAdmin = () => import('../components/admin/basicModule/ownerAdmin.vue')
const parkingAdmin = () => import('../components/admin/extendModule/parkingAdmin.vue')
const userInfo = () =>import('../components/admin/extendModule/userInfo.vue')


const router = new VueRouter({
  routes: [
    // { path: '/', redirect: '/login' },   //当用户访问根路径时，路由到Login.vue界面
    { path: '/', component: Login },
    { path: '/login', component: Login },   //当用户访问login时，路由到Login.vue界面
    {
      path: '/ownerHome', component: ownerHome,   //访问主页
      redirect: '/ownerInfo',                      //访问主页时，自动重定向到ownerInfo.vue
      children: [
        { path: '/alterPwd', component: alterPwd },
        { path: '/ownerInfo', component: ownerInfo} ,
        { path: '/repairInfo', component: repairInfo },
        { path: '/complaintInfo', component: complaintInfo },
        { path: '/payInfo', component: payInfo }
      ]
    },
    { path: '/adminHome', component: adminHome, 
      redirect: '/feeAdmin',
      children:[
        {path: '/feeAdmin',component: feeAdmin},
        {path: '/complaintAdmin',component: complaintAdmin},
        {path: '/repairAdmin',component: repairAdmin},
        {path: '/buildingAdmin',component: buildingAdmin},
        {path: '/ownerAdmin',component: ownerAdmin},
        {path: '/parkingAdmin',component: parkingAdmin},
        {path: '/userInfo',component: userInfo},
      ]
    },
  ]
})

// 挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   // to 是将要访问的路径
//   // from 是代表从哪个路径跳转而来
//   // next 是一个函数，表示放行
//   if (to.path === '/login') return next(); // 访问的是登录页，直接放行
//   //获取token
//   const tokenStr = window.sessionStorage.getItem('token');
//   if (!tokenStr) {//没有登录
//     return next("/login");
//   }
//   next();//登录了
// })

export default router
