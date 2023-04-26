<template>
    <div style="margin:20px">
        <el-form :inline="true" :model="searchOwnerForm">
            <el-form-item>
                <el-input v-model="searchOwnerForm.content" type="text" placeholder="请输入业主相关信息"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchOwner">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="background-color:white">
            <el-button type="warning" style="margin:10px" @click="addOwnerVisible = true">添加</el-button>
            <el-button type="danger" style="margin:10px" @click="delOwners">批量删除</el-button>

            <el-table ref="multipleTable" :data="ownerData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" width="120" align="center"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center"></el-table-column>
                <el-table-column prop="birthday" label="生日" align="center"></el-table-column>
                <el-table-column prop="idNo" label="身份证号码" align="center"></el-table-column>
                <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
                <el-table-column prop="email" label="电子邮件" align="center"></el-table-column>
                <el-table-column label="操作" width="200px" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <!-- 这里要注意，直接赋值是浅拷贝 -->
                        <el-button type="primary" @click="updateOwnerForm=Object.assign({},scope.row);updateOwnerVisible=true">修改</el-button>
                        <el-button type="danger" @click="delOwner(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @current-change="handleCurrentChange" :hide-on-single-page="value"
                :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="totalPage">
            </el-pagination>
        </div>

        <el-dialog title="添加业主" :visible.sync="addOwnerVisible" width="30%">
            <el-form ref="addOwnerForm" :model="addOwnerForm" :rules="addOwnerFormRules" label-width="100px"
                style="width:290px">
                <el-form-item prop="name" label="姓名">
                    <el-input v-model="addOwnerForm.name"></el-input>
                </el-form-item>
                <el-form-item prop="sex" label="性别">
                    <el-select style="width: 190px;" v-model="addOwnerForm.sex" placeholder="请选择性别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出生日期">
                    <el-date-picker style="width: 190px;" v-model="addOwnerForm.birthday" type="date"
                        placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="身份证号码">
                    <el-input v-model="addOwnerForm.idNo"></el-input>
                </el-form-item>
                <el-form-item prop="mobile" label="联系电话">
                    <el-input v-model="addOwnerForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="电子邮件">
                    <el-input v-model="addOwnerForm.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addOwnerVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOwner">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改信息" :visible.sync="updateOwnerVisible" width="30%">
            <el-form ref="updateOwnerForm" :model="updateOwnerForm" :rules="updateOwnerFormRules" label-width="100px"
                style="width:290px">
                <el-form-item prop="name" label="姓名">
                    <el-input v-model="updateOwnerForm.name"></el-input>
                </el-form-item>
                <el-form-item prop="sex" label="性别">
                    <el-select style="width: 190px;" v-model="updateOwnerForm.sex" placeholder="请选择性别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出生日期">
                    <el-date-picker style="width: 190px;" v-model="updateOwnerForm.birthday" type="date"
                        placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="身份证号码">
                    <el-input v-model="updateOwnerForm.idNo"></el-input>
                </el-form-item>
                <el-form-item prop="mobile" label="联系电话">
                    <el-input v-model="updateOwnerForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="电子邮件">
                    <el-input v-model="updateOwnerForm.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateOwnerVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateOwner">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
import { toastSuccess, toastFail } from '@/utils/notice'
export default {
    data() {
        return {
            searchOwnerForm: {
                content:''
            },
            ownerData: [{
                id:1,
                name: '王者荣耀',
                sex: '男',
                birthday: '2023-4-1',
                idNo: '124123123123',
                mobile: '132312132',
                email: '123123@qq.com'
            }, {
                id:2,
                name: '原神',
                sex: '女',
                birthday: '2023-4-2',
                idNo: '313123123',
                mobile: '12323214',
                email: '821223@qqq.com'
            }],
            multipleSelection: [],
            addOwnerVisible: false,
            addOwnerForm: {},
            addOwnerFormRules: {
                name: [{ required: true, message: '名字不能不写！', trigger: 'blur' }],
                mobile: [{ required: true, message: '电话不能不写！', trigger: 'blur' }]
            },
            updateOwnerVisible: false,
            updateOwnerForm: {
                id:1
            },
            updateOwnerFormRules: {
                name: [{ required: true, message: '名字不能不写！', trigger: 'blur' }],
                mobile: [{ required: true, message: '电话不能不写！', trigger: 'blur' }]
            },
            currentPage: 1,
            pageSize: 10,
            totalPage: 100
        }
    },
    methods: {
        searchOwner() {
            console.log(this.searchOwnerForm);
        },
        delOwner(row) {
            this.$confirm('你确定要删?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(row);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        delOwners() {
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
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                console.log(ids);
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
        addOwner() {
            this.$refs.addOwnerForm.validate(valid => {
                if (!valid) return;
                this.$confirm('你确定要提交？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '已添加成功！'
                    });
                    console.log(this.addOwnerForm);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消添加'
                    });
                });
            })
        },
        updateOwner() {

            console.log(this.updateOwnerForm);

            this.$refs.updateOwnerForm.validate(valid => {
                if (!valid) return;
                this.$confirm('你确定要修改？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '已修改成功！'
                    });
                    console.log(this.addUpdateForm);
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
        }

    }
}
</script>