<template>
    <div style="margin:20px">
        <el-form :inline="true" :model="searchRepairForm">
            <el-form-item label="报修类型">
                <el-select v-model="searchRepairForm.type" placeholder="请选择报修类型">
                    <el-option label="不限类型" value="0"></el-option>
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
                    <el-option label="不限状态" value="0"></el-option>
                    <el-option label="处理中" value="1"></el-option>
                    <el-option label="已完成" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchRepair">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="background-color:white">
            <el-button type="danger" style="margin:10px" @click="delRepairs">批量删除</el-button>

            <el-table ref="multipleTable" :data="repairData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="loading">
                <el-table-column type="selection" width="55" align="center" :selectable="selectable"></el-table-column>
                <el-table-column label="报修类型" width="120" align="center">
                    <template slot-scope="scope">
                        {{ repairType[scope.row.type] }}
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="报修内容" width="120" align="center"></el-table-column>
                <el-table-column label="报修图片" align="center">
                    <template slot-scope="scope">
                        <img v-if="scope.row.imageUrl" width="140px" height="140px" :src="scope.row.imageUrl">
                    </template>
                </el-table-column>
                <el-table-column prop="ownerName" label="报修人" align="center"></el-table-column>
                <el-table-column prop="submitTime" label="报修时间" align="center"></el-table-column>
                <el-table-column prop="completeTime" label="处理时间" align="center"></el-table-column>
                <el-table-column label="处理状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === 1 ? 'warning' : 'success'">{{ scope.row.status === 1 ? '处理中' :
                            '已完成' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status === 1" type='warning'
                            @click="handleRepair(scope.row)">处理</el-button>
                        <el-button v-if="scope.row.status === 2" type='danger'
                            @click="delRepair(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @current-change="handleCurrentChange" :hide-on-single-page="value"
                :current-page.sync="pageForm.currentPage" :page-size="pageForm.pageSize" layout="total, prev, pager, next"
                :total="totalPage">
            </el-pagination>
        </div>

    </div>
</template>

<script>
import {selectRepairByAdminApi,selectRepairByConditionsByAdminApi,completeRepairByAdminApi,deleteRepairByAdminApi,delRepairByIdsByAdminApi} from '@/request/api'
import { toastSuccess, toastFail } from '@/utils/notice'
export default {
    mounted() {
        this.queryRepair();
    },
    data() {
        return {
            searchRepairForm: {
                type: '',
                status: ''
            },
            repairData: [],
            repairType: {
                1: '质量类',
                2: '维修类',
                3: '扰民类',
                4: '安全类',
                5: '停车类',
                6: '物业不作为'
            },
            multipleSelection: [],
            totalPage: 100,
            pageForm: {      //当前页面信息
                currentPage: 1,
                pageSize: 7,
                data: ''     //要传给后端的数据
            },
            loading:true

        }
    },
    methods: {
        queryRepair() {//分页查询所有的投诉并展示
            this.loading = true;
            selectRepairByAdminApi(this.pageForm).then(res => {
                this.totalPage = res.data.total;
                this.repairData = [];//清空当前列表
                res.data.list.forEach(repair => {
                    let tabelData = repair;
                    tabelData['ownerName'] = repair.owner.name;
                    this.repairData.push(tabelData);
                })
                this.loading = false;
            });
        },
        searchRepair() {
            this.loading = true;
            this.pageForm.data = this.searchRepairForm
            selectRepairByConditionsByAdminApi(this.pageForm).then(res => {
                this.totalPage = res.data.total;
                this.repairData = [];//清空当前列表
                res.data.list.forEach(repair => {
                    let tabelData = repair;
                    tabelData['ownerName'] = repair.owner.name;
                    this.repairData.push(tabelData);
                })
                this.loading = false;
            })
        },
        delRepair(row) {
            this.$confirm('你确定要删?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteRepairByAdminApi(row).then(res => {
                    this.queryRepair();
                    toastSuccess(this, "删除成功!");
                }).catch(err => {
                    toastFail(this, "服务器繁忙，请稍后重试！");
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        handleRepair(row) {
            this.$confirm('是否处理完成?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => { 
                completeRepairByAdminApi(row).then(res => {
                    this.queryRepair();
                    this.$message({
                        type: 'success',
                        message: '处理完成!'
                    });
                })

            })
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
                delRepairByIdsByAdminApi(ids).then(res => {
                    this.queryRepair();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch((err) => {
                    this.$message({
                        type: 'error',
                        message: '删除失败，服务器繁忙！'
                    });
                });
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
        selectable: function (row, index) {
            if (row.status === 2)
                return true;
        },
        handleCurrentChange(val) {
            this.queryRepair();
        }

    }
}
</script>