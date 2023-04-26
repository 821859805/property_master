<template>
    <div style="margin:20px">
        <el-form :inline="true" :model="searchRepairForm">
            <el-form-item label="费用类型">
                <el-select v-model="searchFeeForm.type" placeholder="请选择费用类型">
                    <el-option label="物业费" value="1"></el-option>
                    <el-option label="水费" value="2"></el-option>
                    <el-option label="电费" value="3"></el-option>
                    <el-option label="房租" value="4"></el-option>
                    <el-option label="停车费" value="5"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="缴费状态">
                <el-select v-model="searchFeeForm.status" placeholder="请选择缴费状态">
                    <el-option label="未缴费" value="1"></el-option>
                    <el-option label="已缴费" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchFee">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="background-color:white">
            <el-button type="warning" style="margin:10px" @click="addFeeVisible = true">新增</el-button>
            <el-button type="danger" style="margin:10px" @click="delFees">批量删除</el-button>
            <el-table :data="feeData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" :selectable="selectable"></el-table-column>
                <el-table-column prop="ownerName" label="缴费人" align="center"></el-table-column>
                <el-table-column label="费用类型" width="120" align="center">
                    <template slot-scope="scope">
                        {{ feeType[scope.row.type] }}
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="金额（元）" align="center"></el-table-column>
                <el-table-column prop="submitTime" label="催缴时间" align="center"></el-table-column>
                <el-table-column prop="completeTime" label="缴费时间" align="center"></el-table-column>
                <el-table-column label="缴费状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === 1 ? 'danger' : 'success'">{{ scope.row.status === 1 ? '未缴费' :
                            '已缴费' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" @click="delFee(scope.row)" v-if="scope.row.status === 1">撤回</el-button>
                        <el-button type="danger" @click="delFee(scope.row)" v-if="scope.row.status === 2">删除记录</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @current-change="handleCurrentChange" :hide-on-single-page="value"
                :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="totalPage">
            </el-pagination>
        </div>


        <el-dialog title="新增缴费" :visible.sync="addFeeVisible" width="30%">
            <el-form ref="addFeeForm" :model="addFeeForm" :rules="addFeeFormRules" label-width="100px"
                style="width:290px">
                <el-form-item prop="id" label="业主">
                    <el-select v-model="addFeeForm.id" placeholder="请选择业主">
                        <el-option v-for="item in ownerOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="type" label="费用类型" label-width="120px">
                    <el-select v-model="addFeeForm.type" placeholder="请选择费用类型">
                        <el-option v-for="item in feeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="price" label="价格（元）" label-width="120px">
                    <el-input v-model="addFeeForm.price" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFeeVisible = false">取 消</el-button>
                <el-button type="primary" @click="addFee">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { toastSuccess, toastFail } from '@/utils/notice'
export default {
    data() {
        return {
            searchFeeForm: {
                type: '',
                status: ''
            },
            feeData: [{
                id: 1,
                type: 1,
                ownerName: 'fwe',
                submitTime: '2023-4-1 12:34:56',
                completeTime: '2023-4-2 12:34:56',
                price: 400,
                status: 1,
            }, {
                id: 2,
                type: 3,
                ownerName: 'fwe1',
                submitTime: '2023-12-1 12:34:56',
                completeTime: '2023-4-2 12:34:56',
                price: 800,
                status: 2,
            }],
            feeType: {
                1: '物业费',
                2: '水费',
                3: '电费',
                4: '房租',
                5: '停车费'
            },
            addFeeVisible:false,
            addFeeForm:{},
            addFeeFormRules:{
                id:[{ required: true, message: '不能不选！', trigger: 'change' }],
                type:[{ required: true, message: '不能不选！', trigger: 'change' }],
                price:[{ required: true, message: '不能不写！', trigger: 'blur' }]
            },
            ownerOptions:[{
                value:1,
                label:'业主一'
            },{
                value:2,
                label:'业主二'
            },{
                value:3,
                label:'业主三'
            },{
                value:4,
                label:'业主四'
            },{
                value:5,
                label:'业主五'
            }],
            feeOptions:[{
                value:1,
                label:'物业费'
            },{
                value:2,
                label:'水费'
            },{
                value:3,
                label:'电费'
            },{
                value:4,
                label:'房租'
            },{
                value:5,
                label:'停车费'
            }],
            multipleSelection:[],
            currentPage: 1,
            pageSize: 10,
            totalPage: 100
        }
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        searchFee() {
            console.log(this.searchFeeForm);
        },
        payFee(row) {
            console.log(row)
        },
        delFee(row) {
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
        delFees() {
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
        handleCurrentChange() {
            console.log(this.currentPage);
            console.log(this.pageSize);
        },
        addFee() {
            this.$refs.addFeeForm.validate(valid => {
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
                    console.log(this.addFeeForm);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消添加'
                    });
                });
            })
        },

    }
}
</script>