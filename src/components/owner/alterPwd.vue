
<template>
    <el-form :model="alterPwdForm" status-icon :rules="rules" ref="alterPwdRuleForm" label-width="100px"
        style="width: 300px;" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oldPwd">
            <el-input type="password" v-model="alterPwdForm.oldPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="alterPwdForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="alterPwdForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm()">修改</el-button>
            <el-button @click="resetForm('alterPwdRuleForm')">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { alterPasswordApi } from '@/request/api'
import { toastSuccess, toastFail } from '@/utils/notice'
export default {
    data() {
        var validateOldPwd = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入旧密码'));
            }
            callback();
        };
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码'));
            } else {
                if (this.alterPwdForm.checkPass !== '') {
                    this.$refs.alterPwdRuleForm.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入新密码'));
            } else if (value !== this.alterPwdForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            alterPwdForm: {
                oldPwd: '',
                password: '',
                checkPass: ''
            },
            rules: {
                oldPwd: [
                    { validator: validateOldPwd, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        submitForm() {
            //每一个validator里面都要有callback()，否则validate里面方法不执行
            this.$refs.alterPwdRuleForm.validate(valid => {
                if (!valid) return;
                console.log(this.alterPwdForm);
                alterPasswordApi(this.alterPwdForm).then(res => {
                    switch (res.code) {
                        case 20000:
                            toastSuccess(this, "恭喜你！修改密码成功了！");
                            break;
                        case 12404:
                            toastFail(this, "旧密码错误！！！");
                            break;
                    }

                }).catch(err => {
                    console.log(err);
                });
            });

        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>