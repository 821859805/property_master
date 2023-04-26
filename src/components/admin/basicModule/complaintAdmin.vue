<template>
    <div style="margin:20px">
        <el-form :inline="true" :model="searchComplaintForm">
            <el-form-item label="投诉类型">
                <el-select v-model="searchComplaintForm.type" placeholder="请选择投诉类型">
                    <el-option label="质量类" value="1"></el-option>
                    <el-option label="维修类" value="2"></el-option>
                    <el-option label="扰民类" value="3"></el-option>
                    <el-option label="安全类" value="4"></el-option>
                    <el-option label="停车类" value="5"></el-option>
                    <el-option label="物业不作为" value="6"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="处理状态">
                <el-select v-model="searchComplaintForm.status" placeholder="请选择投诉状态">
                    <el-option label="处理中" value="1"></el-option>
                    <el-option label="已完成" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchComplaint">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="background-color:white">
            <el-button type="danger" style="margin:10px" @click="delComplaints">批量删除</el-button>

            <el-table ref="multipleTable" :data="complaintData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" :selectable="selectable"></el-table-column>
                <el-table-column label="投诉类型" width="120" align="center">
                    <template slot-scope="scope">
                        {{ complaintType[scope.row.type] }}
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="投诉内容" width="120" align="center"></el-table-column>
                <el-table-column prop="ownerName" label="投诉人" align="center"></el-table-column>
                <el-table-column prop="submitTime" label="投诉时间" align="center"></el-table-column>
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
                            @click="handleComplaint(scope.row)">处理</el-button>
                        <el-button v-if="scope.row.status === 2" type='danger'
                            @click="delComplaint(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @current-change="handleCurrentChange" :hide-on-single-page="value"
                :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="totalPage">
            </el-pagination>
        </div>

    </div>
</template>

<script>
import { toastSuccess, toastFail } from '@/utils/notice'
export default {
    data() {
        return {
            searchComplaintForm: {
                type: '',
                status: ''
            },
            complaintData: [{
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
            }, {
                id: 3,
                type: 4,
                content: '12334',
                ownerName: 'fw4e1',
                submitTime: '2023-12-1 12:34:56',
                completeTime: '2023-4-2 12:34:56',
                status: 1,
                adminName: 'admin'
            }],
            complaintType: {
                1: '质量类',
                2: '维修类',
                3: '扰民类',
                4: '安全类',
                5: '停车类',
                6: '物业不作为'
            },
            multipleSelection: [],
            currentPage: 1,
            pageSize: 10,
            totalPage: 100,

        }
    },
    methods: {
        searchComplaint() {
            console.log(this.searchComplaintForm);
        },
        delComplaint(row) {
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
        handleComplaint(row) {
            this.$confirm('是否处理完成?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(row);
                this.$message({
                    type: 'success',
                    message: '处理完成!'
                });
            })
        },
        delComplaints() {
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
        handleCurrentChange() {
            console.log(this.currentPage);
            console.log(this.pageSize);
        },
        selectable: function (row, index) {
            if (row.status === 1)
                return true;
        }

    }
}
</script>