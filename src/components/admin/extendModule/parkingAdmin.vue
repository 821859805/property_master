<template>
    <div style="margin:20px">
        <el-form :inline="true" :model="searchParkingForm">
            <el-form-item label="车位号">
                <el-input v-model="searchParkingForm.carNo" type="text" placeholder="请输入车位号"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="searchParkingForm.status">
                    <el-option label="不限状态" value=""></el-option>
                    <el-option label="空闲" value="空闲"></el-option>
                    <el-option label="已租出" value="已租出"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchParking">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="background-color:white">
            <el-button type="warning" style="margin:10px" @click="addParkingVisible = true">添加</el-button>
            <el-button type="danger" style="margin:10px" @click="delParkings">批量删除</el-button>

            <el-table ref="multipleTable" :data="parkingData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="loading">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="carNo" label="车位号" width="120" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="120">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === '空闲' ? 'success' : 'info'">
                            {{ scope.row.status }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="ownerName" label="业主姓名" width="120" align="center"></el-table-column>
                <el-table-column prop="remarks" label="备注" width="200px" align="center"></el-table-column>
                <el-table-column label="操作" width="250px" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <!-- 这里要注意，直接赋值是浅拷贝 -->
                        <el-button type="success" v-if="scope.row.status === '空闲'"
                            @click="rentParkingForm.id = scope.row.id; rentParkingVisible = true">租出</el-button>
                        <el-button type="warning" v-if=" scope.row.status === '已租出' "
                            @click=" withdrawParking(scope.row) ">退回</el-button>
                        <el-button type="primary"
                            @click=" updateParkingForm = Object.assign({}, scope.row); updateParkingVisible = true ">修改</el-button>
                        <el-button type="danger" @click=" delParking(scope.row) ">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>


            <el-pagination @current-change=" handleCurrentChange " :hide-on-single-page=" value "
                :current-page.sync=" pageForm.currentPage " :page-size=" pageForm.pageSize "
                layout="total, prev, pager, next" :total=" totalPage ">
            </el-pagination>
        </div>

        <el-dialog title="添加车位" :visible.sync=" addParkingVisible " width="30%">
            <el-form ref="addParkingForm" :model=" addParkingForm " :rules=" addParkingFormRules " label-width="100px"
                style="width:290px">
                <el-form-item prop="carNo" label="车位号">
                    <el-input v-model=" addParkingForm.carNo "></el-input>
                </el-form-item>
                <el-form-item prop="remarks" label="备注">
                    <el-input type="textarea" v-model=" addParkingForm.remarks "></el-input>
                </el-form-item>
            </el-form>
            <el-form-item prop="remarks" label="备注">
                    <el-input type="textarea" v-model=" addParkingForm.remarks "></el-input>
                </el-form-item>
            <span slot="footer" class="dialog-footer">
                <el-button @click=" addParkingVisible = false ">取 消</el-button>
                <el-button type="primary" @click=" addParking ">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改信息" :visible.sync=" updateParkingVisible " width="30%">
            <el-form ref="updateParkingForm" :model=" updateParkingForm " :rules=" updateParkingFormRules "
                label-width="100px" style="width:290px">
                <el-form-item prop="carNo" label="车位号">
                    <el-input v-model=" updateParkingForm.carNo "></el-input>
                </el-form-item>
                <el-form-item prop="remarks" label="备注">
                    <el-input type="textarea" v-model=" updateParkingForm.remarks "></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click=" updateParkingVisible = false ">取 消</el-button>
                <el-button type="primary" @click=" updateParking ">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="车位租出" :visible.sync=" rentParkingVisible " width="30%">
            <el-form ref="rentParkingForm" :model=" rentParkingForm " :rules=" rentParkingFormRules " label-width="100px"
                style="width:290px">
                <el-form-item prop="ownerId" label="业主id">
                    <el-input v-model=" rentParkingForm.ownerId " placeholder="请输入业主的id"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click=" rentParkingVisible = false ">取 消</el-button>
                <el-button type="primary" @click=" rentParking ">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import {insertParkingApi,selectParkingByAdminApi,updateParkingByAdminApi,selectParkingByConditionsByAdminApi,deleteParkingByAdminApi,delParkingByIdsByAdminApi,rentParkingApi,withdrawParkingApi} from '@/request/api'
import { toastSuccess, toastFail } from '@/utils/notice'
export default {
    mounted() {
        this.queryParking();
    },
    data() {
        return {
            rentParkingForm: {
                status: '',
                ownerName: ''
            },
            rentParkingVisible: false,
            searchParkingForm: {
            },
            loading:true,
            rentParkingFormRules: {
                ownerId: [{ required: true, message: '这个必须写！', trigger: 'blur' }],
            },
            parkingData: [{
                id: 1,
                carNo: 'A0001',
                status: '空闲',

            }, {
                id: 2,
                carNo: 'A0002',
                status: '已租出',
                ownerId:2,
                ownerName: 'admin'
            }],
            multipleSelection: [],
            addParkingVisible: false,
            addParkingForm: {
                carNo: '',
                status: '空闲',
                remarks:''
            },
            addParkingFormRules: {
                carNo: [{ required: true, message: '车位号不能不写', trigger: 'blur' }]
            },
            updateParkingVisible: false,
            updateParkingForm: {},
            updateParkingFormRules: {
                carNo: [{ required: true, message: '车位号不能不写', trigger: 'blur' }],
            },
            totalPage: 100,
            pageForm: {      //当前页面信息
                currentPage: 1,
                pageSize: 7,
                data: ''     //要传给后端的数据
            }
        }
    },
    methods: {
        queryParking() {
            this.loading = true;
            selectParkingByAdminApi(this.pageForm).then(res => {
                this.totalPage = res.data.total;
                this.parkingData = [];//清空当前列表
                res.data.list.forEach(parking => {
                    let tabelData = parking;
                    if (parking.owner != null)
                        tabelData['ownerName'] = parking.owner.name;
                    this.parkingData.push(tabelData);
                })
                this.loading = false;
            });
        },
        searchParking() {
            this.loading = true;
            this.pageForm.data = this.searchParkingForm;
            selectParkingByConditionsByAdminApi(this.pageForm).then(res => {
                this.totalPage = res.data.total;
                this.parkingData = [];//清空当前列表
                res.data.list.forEach(parking => {
                    let tabelData = parking;
                    if (parking.owner != null)
                        tabelData['ownerName'] = parking.owner.name;
                    this.parkingData.push(tabelData);
                })
                this.loading = false;
            })
        },
        delParking(row) {
            this.$confirm('你确定要删?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteParkingByAdminApi(row).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.queryParking();
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        delParkings() {
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
                delParkingByIdsByAdminApi(ids).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.queryParking();
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
        addParking() {
            this.$refs.addParkingForm.validate(valid => {
                if (!valid) return;
                this.$confirm('你确定要提交？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    insertParkingApi(this.addParkingForm).then(res => {
                        this.queryParking();
                        this.addParkingVisible = false;
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
        updateParking() {
            this.$refs.updateParkingForm.validate(valid => {
                if (!valid) return;
                this.$confirm('你确定要修改？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateParkingByAdminApi(this.updateParkingForm).then(res => {
                        toastSuccess(this, "已修改成功！");
                        this.queryParking();
                        this.updateParkingVisible = false;
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            })
        },
        rentParking() {    
            this.$refs.rentParkingForm.validate(valid => {
                if (!valid) return;
                this.$confirm('你确定要把车位租给他？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    rentParkingApi(this.rentParkingForm).then(res => {
                        switch (res.code) {
                            case 20000:
                                toastSuccess(this, "已把车库租给他！");
                                this.queryParking();
                                this.rentParkingVisible = false;
                                break;
                            case 31404:
                                toastFail(this,"业主id不存在！！！");
                                break;
                            case 41404:
                                toastFail(this,"这个业主已经有车位了，本系统致力于缩小贫富差距，因此一个业主只能有一个车位!");
                                break;
                        }

                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            })
        },
        withdrawParking(row) {
            this.$confirm('你确定要让他把车位退回?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                withdrawParkingApi(row).then(res => {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.queryParking();
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        handleCurrentChange(val) {
            this.queryParking();
        }
    }
}
</script>