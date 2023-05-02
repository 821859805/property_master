<template>
    <div class="login_body">
        <div class="login_container">
            <div class="login_header">
                <div class="login_title">社区物业管理系统</div>
            </div>
            <div class="login_content">
                <!-- 标签值长度0 -->
                <ElForm ref="loginFormRef" :model="loginForm" :rules="loginFormRules" size="large" class="login_form"
                    label-width="0px">
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username" type="text" placeholder="请输入账号">
                            <i slot="prefix" class="el-icon-user-solid"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码">
                            <i slot="prefix" class="el-icon-lock"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item style="margin: 0;">
                        <el-button style="width: 100%;" type="primary" @click="login">立即登录</el-button>
                    </el-form-item>
                    <el-form-item style="margin: 0;">
                        <div style="text-align: center">
                            <a>还未注册？</a>
                            <el-link type="info" @click="registerDialogVisible = true">立即注册</el-link>
                        </div>

                    </el-form-item>
                </ElForm>
            </div>
        </div>

        <el-dialog title="注册" :visible.sync="registerDialogVisible" width="400px">
            <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules">
                <el-form-item prop="username" label="账号" label-width="120px">
                    <el-input type="text" v-model="registerForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="mobile" label="手机号" label-width="120px">
                    <el-input type="text" v-model="registerForm.mobile" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码" label-width="120px">
                    <el-input v-model="registerForm.password" type="password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="checkpwd" label="重复密码" label-width="120px">
                    <el-input v-model="registerForm.checkpwd" type="password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="registerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="register">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { loginApi, registerApi } from '@/request/api';
import router from '@/router';

export default {
    data() {
        //对第二次输入的密码进行验证
        var validateCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('这里也不能为空！'));
            } else if (value !== this.registerForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            // 登录表单的数据绑定对象
            loginForm: {
                username: '',
                password: '',
            },
            //对表单输入的值进行验证，不准为空等
            loginFormRules: {
                username: [
                    { required: true, message: '用户名不能为空！', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '密码不能为空！', trigger: 'blur' },
                ],
            },
            //注册表单信息
            registerDialogVisible: false,
            registerForm: {
                username: '',
                password: '',
                mobile: '',
                checkpwd: ''
            },

            registerFormRules: {
                username: [
                    { required: true, message: '用户名不能为空！', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '密码不能为空！', trigger: 'blur' },
                ],
                mobile: [
                    { required: true, message: '手机号不能为空！', trigger: 'blur' },
                    { min: 11, max: 11, message: '手机号格式有误！', trigger: 'blur' }
                ],
                checkpwd: [{ validator: validateCheck, trigger: 'blur' }]
            }
        }
    },
    methods: {
        successMsg(msg) {
            this.$message.success(msg);
        },
        failMsg(msg) {
            this.$message.error(msg);
        },
        login() {
            // 登录预验证
            this.$refs.loginFormRef.validate(async valid => {//异步请求方法
                if (!valid) return;//预验证验证失败
                console.log(this.loginForm);
                await loginApi(this.loginForm).then(res => {
                    switch (res.code) {
                        case 20000:
                            //登录成功把token放到sessionStorage中

                            window.sessionStorage.setItem('token', "Bearer " + res.token);
                            res.account.type === '管理员' ? router.push('/adminHome') : router.push('/ownerHome');
                            break;
                        case 11404: this.failMsg("用户名不存在！"); break;
                        case 12404: this.failMsg("密码错误！"); break;
                        case 13404:
                            this.$alert('你的账号已被管理员封禁，请联系管理员解封', '警告', {
                                confirmButtonText: '确定'
                            });
                            break;
                    }
                }).catch(err => {

                    failMsg("服务器繁忙，请稍后再试");
                });

            });


        },
        register() {
            // 注册预验证
            this.$refs.registerFormRef.validate(async valid => {
                if (!valid) return;
                await registerApi(this.registerForm).then(res => {
                    switch (res.code) {
                        case 20000:
                            this.successMsg("恭喜你，注册成功！");
                            this.registerDialogVisible = false;
                            break;
                        case 13404:
                            this.failMsg("注册失败，因为用户名已存在！");
                            break;
                    }
                }).catch(err => {
                    console.log(err);
                    this.failMsg("服务器繁忙，注册失败！");
                })


            });
        }
    }
};
</script>


<!-- 支持less语法格式，scope标志当前样式只在当前组件内生效 -->
<style lang="less" scoped>
.pwd_btns {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.login_form {
    width: 250px;
}


.login_content {
    display: flex;
    height: 350px;
    align-items: center;
    justify-content: center;
}

.login_title {
    font-family: Arial, sans-serif;
    color: #ffffff;
    font-size: 35px;
    text-align: center;
}

.login_body {
    background-image: url(../assets/imags/login.jpg);
    background-repeat: no-repeat;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center; //弹性盒子
    justify-content: center;
    background-size: cover;
}

.login_container {
    width: 400px;
    height: 500px;
    background-color: #ffffff;
    border-radius: 3px;
    // position: absolute;
    // left: 0;
    // right: 0;
    // top: 0;
    // bottom: 0;
    // margin: auto;
}

.login_header {
    border-radius: 3px;
    background-color: #409EFF;
    width: 400px;
    height: 150px;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
</style>
