<template>
    <div style="margin:20px">
        <el-form :inline="true" :model="searchRepairForm">
            <el-form-item label="报修类型">
                <el-select v-model="searchRepairForm.type" placeholder="请选择报修类型">
                    <el-option label="家具类" value="1"></el-option>
                    <el-option label="门窗类" value="2"></el-option>
                    <el-option label="电路类" value="3"></el-option>
                    <el-option label="水暖类" value="4"></el-option>
                    <el-option label="土建类" value="5"></el-option>
                    <el-option label="其它" value="6"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="处理状态">
                <el-select v-model="searchRepairForm.status" placeholder="请选择报修状态">
                    <el-option label="处理中" value="1"></el-option>
                    <el-option label="已完成" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchRepair">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="background-color:white">
            <el-button type="warning" style="margin:10px" @click="addRepairVisible = true">我要报修</el-button>
            <el-button type="primary" style="margin:10px" @click="toggleAll(repairData)">批量选择</el-button>
            <el-button type="danger" style="margin:10px" @click="delRepairs">批量删除</el-button>

            <el-table ref="multipleTable" :data="repairData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="报修类型" width="120" align="center">
                    <template slot-scope="scope">
                        {{ repairType[scope.row.type] }}
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="报修内容" width="120" align="center"></el-table-column>
                <el-table-column prop="ownerName" label="报修人" align="center"></el-table-column>
                <el-table-column prop="submitTime" label="报修时间" align="center"></el-table-column>
                <el-table-column prop="completeTime" label="处理时间" align="center"></el-table-column>
                <el-table-column label="处理状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === 1 ? 'warning' : 'success'">{{ scope.row.status === 1 ? '处理中' :
                            '已完成' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="adminName" label="处理人" align="center"></el-table-column>
                <el-table-column label="操作" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <el-button :type="scope.row.status === 1 ? 'warning' : 'danger'" @click="delRepair(scope.row)">{{
                            scope.row.status === 1 ? '撤回' : '删除' }}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @current-change="handleCurrentChange" :hide-on-single-page="value"
                :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="totalPage">
            </el-pagination>
        </div>

        <el-dialog title="我要报修" :visible.sync="addRepairVisible" width="30%">
            <el-form ref="addRepairForm" :model="addRepairForm" :rules="addRepairFormRules" label-width="100px"
                style="width:290px">
                <el-form-item label="报修类型" prop="type">
                    <el-select style="width: 190px;" v-model="addRepairForm.type" placeholder="请选择报修类型">
                        <el-option label="家具类" value="1"></el-option>
                        <el-option label="门窗类" value="2"></el-option>
                        <el-option label="电路类" value="3"></el-option>
                        <el-option label="水暖类" value="4"></el-option>
                        <el-option label="土建类" value="5"></el-option>
                        <el-option label="其它" value="6"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="content" label="报修内容"><el-input type="textarea"
                        v-model="addRepairForm.content"></el-input></el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRepairVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRepair">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
import { toastSuccess, toastFail } from '@/utils/notice'
export default {
    data() {
        return {
            searchRepairForm: {
                type: '',
                status: ''
            },
            repairData: [{
                id: 1,
                type: 1,
                content: '123',
                ownerName: 'fwe',
                submitTime: '2023-4-1 12:34:56',
                completeTime: '2023-4-2 12:34:56',
                status: 1,
                adminName: 'admin'
            }, {
                id: 2,
                type: 3,
                content: '1234',
                ownerName: 'fwe1',
                submitTime: '2023-12-1 12:34:56',
                completeTime: '2023-4-2 12:34:56',
                status: 2,
                adminName: 'admin'
            }],
            repairType: {
                1: '家具类',
                2: '门窗类',
                3: '电路类',
                4: '水暖类',
                5: '土建类',
                6: '其它'
            },
            multipleSelection: [],
            addRepairVisible: false,
            addRepairForm: {
                type: '',
                content: ''
            },
            addRepairFormRules: {
                type: [{ required: true, message: '报修类型不能不选！', trigger: 'change' }],
                content: [{ required: true, message: '你具体要报修什么？', trigger: 'blur' }]
            },
            currentPage: 1,
            pageSize: 10,
            totalPage: 100
        }
    },
    methods: {
        searchRepair() {
            console.log(this.searchRepairForm);
        },
        delRepair(row) {
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
        toggleAll(rows) {
            rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
            });
        },
        delRepairs() {
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
        addRepair() {
            this.$refs.addRepairForm.validate(valid => {
                if (!valid) return;
                this.$confirm('真的要报修吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '报修信息已经提交了，耐心等!'
                    });
                    console.log(this.addRepairForm);
                }).catch((err) => {
                    this.$message({
                        type: 'info',
                        message: '已取消报修'
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