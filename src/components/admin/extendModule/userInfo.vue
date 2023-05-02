<template>
    <div style="margin:20px">

        <div style="background-color:white">
            <el-button type="warning" style="margin:10px" @click="addUserVisible = true">添加</el-button>
            <el-button type="danger" style="margin:10px" @click="delUsers">批量删除</el-button>

            <el-table ref="multipleTable" :data="userData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">

                <el-table-column type="selection" :selectable="selectable" width="55" align="center"></el-table-column>

                <el-table-column prop="username" label="用户名" width="120" align="center"></el-table-column>
                <el-table-column label="身份" align="center" width="120">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.type === '业主' ? 'warning' : 'success'">{{ scope.row.type }}</el-tag>
                    </template>

                </el-table-column>
                <el-table-column label="帐号状态" align="center" width="120">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === '正常' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="400px" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <!-- 这里要注意，直接赋值是浅拷贝 -->
                        <el-button
                            @click="updateUserForm = Object.assign({}, scope.row); updateUserVisible = true">修改信息</el-button>
                        <el-button type="primary" @click=" resetPwd(scope.row) ">重置密码</el-button>
                        <el-button type="danger" v-if=" scope.row.type === '业主' "
                            @click=" delUser(scope.row) ">删除</el-button>
                        <el-button type="warning" v-if=" scope.row.type === '业主' && scope.row.status === '正常' "
                            @click=" lockUser(scope.row) ">封号</el-button>
                        <el-button type="success" v-if=" scope.row.status === '封禁' "
                            @click=" unlockUser(scope.row) ">解封</el-button>
                    </template>
                </el-table-column>
            </el-table>



            <el-pagination @current-change=" handleCurrentChange " :hide-on-single-page=" value "
                :current-page.sync=" pageForm.currentPage " :page-size=" pageForm.pageSize "
                layout="total, prev, pager, next" :total=" totalPage ">
            </el-pagination>
        </div>

        <el-dialog title="添加用户" :visible.sync=" addUserVisible " width="30%">
            <el-form ref="addUserForm" :model=" addUserForm " :rules=" addUserFormRules " label-width="100px"
                style="width:290px">
                <el-form-item prop="name" label="用户名">
                    <el-input v-model=" addUserForm.username "></el-input>
                </el-form-item>
                <el-form-item prop="mobile" label="手机号" label-width="120px">
                    <el-input type="text" v-model=" addUserForm.mobile " autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码" label-width="120px">
                    <el-input v-model=" addUserForm.password " type="password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="checkpwd" label="重复密码" label-width="120px">
                    <el-input v-model=" addUserForm.checkpwd " type="password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click=" addOwnerVisible = false ">取 消</el-button>
                <el-button type="primary" @click=" addUser ">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改信息" :visible.sync=" updateUserVisible " width="30%">
            <el-form ref="updateUserForm" :model=" updateUserForm " :rules=" updateUserFormRules " label-width="100px"
                style="width:290px">
                <el-form-item prop="password" label="密码" label-width="120px">
                    <el-input v-model=" updateUserForm.password " type="password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="checkpwd" label="重复密码" label-width="120px">
                    <el-input v-model=" updateUserForm.checkpwd " type="password" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click=" updateUserVisible = false ">取 消</el-button>
                <el-button type="primary" @click=" updateUser ">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
import { insertUserApi, selectUserApi, selectUserByContentApi, updateUserApi, deleteUserApi, delUserByIdsApi, lockUserApi, unlockUserApi,resetPwdApi } from '@/request/api'
import { toastSuccess, toastFail } from '@/utils/notice'
export default {
    mounted() {
        this.queryUser();
    },
    data() {
        //对第二次输入的密码进行验证
        var validateCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('这里也不能为空！'));
            } else if (value !== this.addUserForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        var validateCheck2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('这里也不能为空！'));
            } else if (value !== this.updateUserForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            searchUserForm: {
                content: ''
            },
            userData: [{
                id: 1,
                username: 'admin',
                type: '管理员',
                status: '正常'
            }, {
                id: 2,
                username: 'wef',
                type: '业主',
                status: '封禁'
            }, {
                id: 3,
                username: 'weff',
                type: '业主',
                status: '正常'
            }],
            multipleSelection: [],
            addUserVisible: false,
            addUserForm: {
                username: '',
                password: '',
                checkpwd: ''
            },
            addUserFormRules: {
                username: [
                    { required: true, message: '用户名不能为空！', trigger: 'blur' },
                    { min: 6, max: 12, message: '用户名长度在 6 到 12 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空！', trigger: 'blur' },
                    { min: 6, max: 12, message: '密码长度在 6 到 12 个字符', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '手机号不能为空！', trigger: 'blur' },
                    { min: 11, max: 11, message: '手机号格式有误！', trigger: 'blur' }
                ],
                checkpwd: [{ validator: validateCheck, trigger: 'blur' }]
            },
            updateUserVisible: false,
            updateUserForm: {
                username: '',
                password: '',
                checkpwd: ''
            },
            updateUserFormRules: {
                username: [
                    { required: true, message: '用户名不能为空！', trigger: 'blur' },
                    { min: 6, max: 12, message: '用户名长度在 6 到 12 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空！', trigger: 'blur' },
                    { min: 6, max: 12, message: '密码长度在 6 到 12 个字符', trigger: 'blur' }
                ],
                checkpwd: [{ validator: validateCheck2, trigger: 'blur' }]
            },
            totalPage: 100,
            pageForm: {      //当前页面信息
                currentPage: 1,
                pageSize: 7,
                data: ''     //要传给后端的数据
            },
        }
    },
    methods: {
        queryUser() {//分页查询所有用户并展示
            selectUserApi(this.pageForm).then(res => {
                this.totalPage = res.data.total;
                this.userData = res.data.list;
            }).catch(err => {
                toastFail(this, "服务器繁忙，操作失败！")
            });
        },
        searchUser() {
            console.log(this.searchUserForm);
            selectUserByContentApi(this.searchUserForm).then(res => {
                console.log(res.data);
                this.totalPage = res.data.total;
                this.userData = res.data;
            })
        },
        delUser(row) {
            this.$confirm('你确定要删?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(row);
                deleteUserApi(row).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.queryUser();
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        delUsers() {
            let ids = [];
            this.multipleSelection.forEach(row => ids.push(row.id));
            if (ids.length === 0) {
                toastFail(this, '请选择要删除的行');
                return;
            }
            this.$confirm('你确定要删这么多?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delUserByIdsApi(ids).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.queryUser();
                })

            }).catch((err) => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        addUser() {
            this.$refs.addUserForm.validate(valid => {
                if (!valid) return;
                this.$confirm('你确定要提交？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    insertUserApi(this.addUserForm).then(res => {
                        this.queryUser();
                        this.addUserVisible = false;
                        this.$message({
                            type: 'success',
                            message: '已添加成功！'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消添加'
                    });
                });
            })
        },
        updateUser() {
            console.log(this.updateUserForm);

            this.$refs.updateUserForm.validate(valid => {
                if (!valid) return;
                this.$confirm('你确定要修改？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateUserApi(this.updateUserForm).then(res => {
                        this.updateUserVisible = false;
                        this.queryUser();
                        this.$message({
                            type: 'success',
                            message: '已修改成功！'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            })
        },
        handleCurrentChange() {
            console.log(this.currentPage);
            console.log(this.pageSize);
        },
        unlockUser(row) {
            console.log(row);
            this.$confirm('你确定要解封他的号？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                unlockUserApi(row).then(res => {
                    this.$message({
                        type: 'success',
                        message: '解封成功！'
                    });
                    this.queryUser();
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消解封'
                });
            });

        },
        lockUser(row) {
            console.log(row);
            this.$confirm('你确定要封他号？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                lockUserApi(row).then(res => {
                    this.$message({
                        type: 'success',
                        message: '已经把他的号封了！'
                    });
                    this.queryUser();
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消封号'
                });
            });

        },
        resetPwd(row) {
            this.$confirm('你确定要重置密码？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                resetPwdApi(row).then(res => {
                    this.$message({
                        type: 'success',
                        message: '已经重置成功！新密码为123456！'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消重置密码'
                });
            });
        },
        selectable: function (row, index) {
            // 只有业主才能被选中
            if (row.type === '业主') {
                return true;
            }

        },

    }
}
</script>