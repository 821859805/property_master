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
            <el-table :data="feeData" tooltip-effect="dark" style="width: 100%">
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
                        <el-button type="success" @click="payFee(scope.row)" v-if="scope.row.status===1">缴费</el-button>
                        <el-button type="danger" @click="delFee(scope.row)" v-if="scope.row.status===2">删除记录</el-button>
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
                price:400,
                status: 1,
            }, {
                id: 2,
                type: 3,
                ownerName: 'fwe1',
                submitTime: '2023-12-1 12:34:56',
                completeTime: '2023-4-2 12:34:56',
                price:800,
                status: 2,
            }],
            feeType: {
                1: '物业费',
                2: '水费',
                3: '电费',
                4: '房租',
                5: '停车费'
            },
            currentPage: 1,
            pageSize: 10,
            totalPage: 100
        }
    },
    methods: {
        searchFee() {
            console.log(this.searchFeeForm);
        },
        payFee(row){
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
        handleCurrentChange() {
            console.log(this.currentPage);
            console.log(this.pageSize);
        }

    }
}
</script>