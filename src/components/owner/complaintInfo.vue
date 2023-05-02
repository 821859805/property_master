<template>
    <div style="margin:20px">
        <el-form :inline="true" :model="searchComplaintForm">
            <el-form-item label="投诉类型">
                <el-select v-model="searchComplaintForm.type" placeholder="请选择投诉类型">
                    <el-option label="不限类型" value="0"></el-option>
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
                    <el-option label="不限状态" value="0"></el-option>
                    <el-option label="处理中" value="1"></el-option>
                    <el-option label="已完成" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchComplaint">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="background-color:white">
            <el-button type="warning" style="margin:10px" @click="addComplaintVisible = true">我要投诉</el-button>
            <el-button type="primary" style="margin:10px" @click="toggleAll(complaintData)">批量选择</el-button>
            <el-button type="danger" style="margin:10px" @click="delComplaints">批量删除</el-button>

            <el-table ref="multipleTable" :data="complaintData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
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
                        <el-tag :type="scope.row.status === 1 ? 'warning' : 'success'">{{ complaintStatus[scope.row.status]
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <el-button :type="scope.row.status === 1 ? 'warning' : 'danger'" @click="delComplaint(scope.row)">{{
                            scope.row.status === 1 ? '撤回' : '删除' }}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @current-change="handleCurrentChange" :hide-on-single-page="value"
                :current-page.sync="pageForm.currentPage" :page-size="pageForm.pageSize" layout="total, prev, pager, next"
                :total="totalPage">
            </el-pagination>
        </div>

        <el-dialog title="我要投诉" :visible.sync="addComplaintVisible" width="30%">
            <el-form ref="addComplaintForm" :model="addComplaintForm" :rules="addComplaintFormRules" label-width="100px"
                style="width:290px">
                <el-form-item label="投诉类型" prop="type">
                    <el-select style="width: 190px;" v-model="addComplaintForm.type" placeholder="请选择投诉类型">

                        <el-option label="质量类" value="1"></el-option>
                        <el-option label="维修类" value="2"></el-option>
                        <el-option label="扰民类" value="3"></el-option>
                        <el-option label="安全类" value="4"></el-option>
                        <el-option label="停车类" value="5"></el-option>
                        <el-option label="物业不作为" value="6"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="content" label="投诉内容"><el-input type="textarea"
                        v-model="addComplaintForm.content"></el-input></el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addComplaintVisible = false">取 消</el-button>
                <el-button type="primary" @click="addComplaint">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
import { toastSuccess, toastFail } from '@/utils/notice'
import { insertComplaintApi, selectComplaintApi, updateComplaintApi, deleteComplaintApi, selectComplaintByConditionsApi, delComplaintByIdsApi } from '@/request/api'
export default {
    mounted() {
        this.queryComplaint();
    },
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
            }],
            complaintType: {
                1: '质量类',
                2: '维修类',
                3: '扰民类',
                4: '安全类',
                5: '停车类',
                6: '物业不作为'
            },
            complaintStatus: {
                0: '不限状态',
                1: '处理中',
                2: '已完成',
            },
            multipleSelection: [],
            addComplaintVisible: false,
            addComplaintForm: {
                type: '',
                content: '',
                status: 1
            },
            addComplaintFormRules: {
                type: [{ required: true, message: '投诉类型不能不选！', trigger: 'change' }],
                content: [{ required: true, message: '你具体要投诉什么？', trigger: 'blur' }]
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
        queryComplaint() {//分页查询所有的投诉并展示
            selectComplaintApi(this.pageForm).then(res => {
                this.totalPage = res.data.total;
                this.complaintData = [];//清空当前列表
                res.data.list.forEach(complaint => {
                    let tabelData = complaint;
                    tabelData['ownerName'] = complaint.owner.name;
                    this.complaintData.push(tabelData);
                })
            });
        },
        searchComplaint() {//搜索框搜索
            this.pageForm.data = this.searchComplaintForm
            selectComplaintByConditionsApi(this.pageForm).then(res => {
                this.totalPage = res.data.total;
                this.complaintData = [];//清空当前列表
                res.data.list.forEach(complaint => {
                    let tabelData = complaint;
                    tabelData['ownerName'] = complaint.owner.name;
                    this.complaintData.push(tabelData);
                })
            })
        },
        delComplaint(row) {
            this.$confirm('你确定要删?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteComplaintApi(row).then(res => {
                    this.queryComplaint();
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
        toggleAll(rows) {
            rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
            });
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

                delComplaintByIdsApi(ids).then(res => {
                    this.queryComplaint();
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
        addComplaint() {
            this.$refs.addComplaintForm.validate(valid => {
                if (!valid) return;
                this.$confirm('真的要投诉吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    insertComplaintApi(this.addComplaintForm).then(res => {
                        toastSuccess(this, "投诉信息已经提交了，耐心等!");
                        this.addComplaintVisible = false;
                        this.queryComplaint();
                    }).catch(err => {
                        toastFail(this, "服务器繁忙，请稍后重试！");
                    })

                }).catch((err) => {
                    this.$message({
                        type: 'info',
                        message: '已取消投诉'
                    });
                });
            })
        },
        handleCurrentChange() {
            this.queryComplaint();
        }

    }
}
</script>