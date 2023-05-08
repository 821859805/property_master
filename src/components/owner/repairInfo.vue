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
            <el-button type="warning" style="margin:10px" @click="addRepairVisible = true">我要报修</el-button>
            <el-button type="primary" style="margin:10px" @click="toggleAll(repairData)">批量选择</el-button>
            <el-button type="danger" style="margin:10px" @click="delRepairs">批量删除</el-button>

            <el-table ref="multipleTable" :data="repairData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="loading">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="ownerName" label="报修人" align="center"></el-table-column>
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
                <el-table-column prop="submitTime" label="报修时间" align="center"></el-table-column>
                <el-table-column prop="completeTime" label="处理时间" align="center"></el-table-column>
                <el-table-column label="处理状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === 1 ? 'warning' : 'success'">{{ repairStatus[scope.row.status]
                        }}</el-tag>
                    </template>

                </el-table-column>
                <el-table-column label="操作" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <el-button :type="scope.row.status === 1 ? 'warning' : 'danger'" @click="delRepair(scope.row)">{{
                            scope.row.status === 1 ? '撤回' : '删除' }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="handleCurrentChange" :hide-on-single-page="value"
                :current-page.sync="pageForm.currentPage" :page-size="pageForm.pageSize" layout="total, prev, pager, next"
                :total="totalPage">
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
                        v-model="addRepairForm.content"></el-input>
                </el-form-item>
                <el-form-item label="报修图片">
                    <el-upload list-type="picture-card" action :http-request="uploadPicture" :show-file-list="false">
                        <img v-if="addRepairForm.imageUrl" :src="addRepairForm.imageUrl" class="avatar">
                        <i v-if="!addRepairForm.imageUrl" class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRepairVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRepair">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
import { uploadOwnerPictureApi, insertRepairApi, selectRepairApi, updateRepairApi, deleteRepairApi, selectRepairByConditionsApi, delRepairByIdsApi } from '@/request/api'
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
            repairData: [{
                id: 1,
                type: 1,
                content: '123',
                ownerName: 'fwe',
                submitTime: '2023-4-1 12:34:56',
                imageUrl: "123",
                completeTime: '2023-4-2 12:34:56',
                status: 1,
                adminName: 'admin'
            }, {
                id: 2,
                type: 3,
                content: '1234',
                imageUrl: "123",
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
            repairStatus: {
                0: '不限状态',
                1: '处理中',
                2: '已完成',
            },
            multipleSelection: [],
            addRepairVisible: false,
            addRepairForm: {
                type: '',
                content: '',
                imageUrl: '',
                status: 1
            },
            addRepairFormRules: {
                type: [{ required: true, message: '报修类型不能不选！', trigger: 'change' }],
                content: [{ required: true, message: '你具体要报修什么？', trigger: 'blur' }]
            },
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
        uploadPicture(param) {
            const formData = new FormData();
            formData.append("file", param.file);
            uploadOwnerPictureApi(formData).then(resp => {
                this.addRepairForm.imageUrl = "http://localhost:8086/api/images/upload/" + resp
            })
        },
        queryRepair() {//分页查询所有的报修并展示
            this.loading = true;
            selectRepairApi(this.pageForm).then(res => {
                this.totalPage = res.data.total;
                this.repairData = [];//清空当前列表
                res.data.list.forEach(repair => {
                    let tabelData = repair;
                    tabelData['ownerName'] = repair.owner.name;
                    this.repairData.push(tabelData);
                })
            });
            this.loading = false;
        },
        searchRepair() {//搜索框搜索
            this.loading = true;
            this.pageForm.data = this.searchRepairForm
            selectRepairByConditionsApi(this.pageForm).then(res => {
                this.totalPage = res.data.total;
                this.repairData = [];//清空当前列表
                res.data.list.forEach(repair => {
                    let tabelData = repair;
                    tabelData['ownerName'] = repair.owner.name;
                    this.repairData.push(tabelData);
                })
            })
            this.loading = false;
        },

        delRepair(row) {
            this.$confirm('你确定要删?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteRepairApi(row).then(res => {
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
                delRepairByIdsApi(ids).then(res => {
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
        addRepair() {
            this.$refs.addRepairForm.validate(valid => {
                if (!valid) return;
                this.$confirm('真的要报修吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    insertRepairApi(this.addRepairForm).then(res => {
                        toastSuccess(this, "报修信息已经提交了，耐心等!");
                        this.addRepairVisible = false;
                        this.queryRepair();
                    }).catch(err => {
                        toastFail(this, "服务器繁忙，请稍后重试！");
                    })
                }).catch((err) => {
                    this.$message({
                        type: 'info',
                        message: '已取消报修'
                    });
                });
            })
        },
        handleCurrentChange(val) {
            this.queryRepair();
        }
    }
}
</script>

<style lang="less" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
}

.avatar {
    width: 140px;
    height: 140px;
    display: block;
}
</style>