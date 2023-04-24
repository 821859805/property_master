import Vue from 'vue'
import VueRouter from 'vue-router'
import '../assets/css/global.css'


Vue.use(VueRouter)

const Login = () => import('../components/Login.vue')
const familyHome = () => import('../components/family/familyHome.vue')
const adminHome = () => import('../components/admin/adminHome.vue')

const router = new VueRouter({
  routes: [
    // { path: '/', redirect: '/login' },   //当用户访问根路径时，路由到Login.vue界面
    {path:'/',component: familyHome},
    { path: '/login', component: Login },   //当用户访问login时，路由到Login.vue界面
    { path: '/familyHome', component: familyHome },
    { path: '/adminHome', component: adminHome }
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
