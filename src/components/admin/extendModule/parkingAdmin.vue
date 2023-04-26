<template>
    <div style="margin:20px">
        <el-form :inline="true" :model="searchParkingForm">
            <el-form-item label="车位号">
                <el-input v-model="searchParkingForm.carNo" type="text" placeholder="请输入车位号"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="searchParkingForm.status">
                    <el-option label="空闲" value="空闲"></el-option>
                    <el-option label="已租出" value="已租出"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="业主名">
                <el-input v-model="searchParkingForm.room" type="text" placeholder="请输入业主名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchParking">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="background-color:white">
            <el-button type="warning" style="margin:10px" @click="addParkingVisible = true">添加</el-button>
            <el-button type="danger" style="margin:10px" @click="delParkings">批量删除</el-button>

            <el-table ref="multipleTable" :data="parkingData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="carNo" label="车位号" width="120" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="120">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === '空闲' ? 'success' : 'info'">
                            {{ scope.row.status }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="业主姓名" width="120" align="center"></el-table-column>
                <el-table-column label="操作" width="250px" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <!-- 这里要注意，直接赋值是浅拷贝 -->
                        <el-button type="success" v-if="scope.row.status === '空闲'"
                            @click="rentParkingVisible = true">租出</el-button>
                        <el-button type="warning" v-if="scope.row.status === '已租出'"
                            @click="withdrawParking(scope.row)">退回</el-button>
                        <el-button type="primary"
                            @click="updateParkingForm = Object.assign({}, scope.row); updateParkingVisible = true">修改</el-button>
                        <el-button type="danger" @click=" delParking(scope.row) ">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @current-change=" handleCurrentChange " :hide-on-single-page=" value "
                :current-page.sync=" currentPage " :page-size=" pageSize " layout="total, prev, pager, next"
                :total=" totalPage ">
            </el-pagination>
        </div>

        <el-dialog title="添加车位" :visible.sync=" addParkingVisible " width="30%">
            <el-form ref="addParkingForm" :model=" addParkingForm " :rules=" addParkingFormRules " label-width="100px"
                style="width:290px">
                <el-form-item prop="carNo" label="车位号">
                    <el-input v-model=" addParkingForm.carNo "></el-input>
                </el-form-item>
            </el-form>
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click=" updateParkingVisible = false ">取 消</el-button>
                <el-button type="primary" @click=" updateParking ">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="车位租出" :visible.sync=" rentParkingVisible " width="30%">
            <el-form ref="rentParkingForm" :model=" rentParkingForm " :rules=" rentParkingFormRules " label-width="100px"
                style="width:290px">
                <el-form-item prop="id" label="业主">
                    <el-select v-model=" rentParkingForm.id " placeholder="请选择业主">
                        <el-option v-for="     item      in      ownerOptions     " :key=" item.value " :label=" item.label "
                            :value=" item.value "></el-option>
                    </el-select>
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
import { toastSuccess, toastFail } from '@/utils/notice'
export default {
    data() {
        return {
            rentParkingForm: {
                carNo: '',
                status: '',
                name: ''
            },
            rentParkingVisible: false,
            searchParkingForm: {
            },
            rentParkingFormRules: {
                id: [{ required: true, message: '业主不能不选！', trigger: 'change' }],
            },
            parkingData: [{
                id:1,
                carNo: 'A0001',
                status: '空闲',

            }, {
                id:2,
                carNo: 'A0002',
                status: '已租出',
                name: 'admin'
            }],
            multipleSelection: [],
            addParkingVisible: false,
            addParkingForm: {
                carNo:''
            },
            addParkingFormRules: {
                carNo: [{ required: true, message: '车位号不能不写', trigger: 'blur' }]
            },
            updateParkingVisible: false,
            updateParkingForm: {},
            updateParkingFormRules: {
                carNo: [{ required: true, message: '车位号不能不写', trigger: 'blur' }]
            },
            currentPage: 1,
            pageSize: 10,
            totalPage: 100,
            ownerOptions: [{
                value: 1,
                label: '业主一'
            }, {
                value: 2,
                label: '业主二'
            }, {
                value: 3,
                label: '业主三'
            }, {
                value: 4,
                label: '业主四'
            }, {
                value: 5,
                label: '业主五'
            }]
        }
    },
    methods: {
        searchParking() {
            console.log(this.searchParkingForm);
        },
        delParking(row) {
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
        addParking() {
            this.$refs.addParkingForm.validate(valid => {
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
                    console.log(this.addParkingForm);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消添加'
                    });
                });
            })
        },
        updateParking() {
            this.$refs.updateBuildingForm.validate(valid => {
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
                    console.log(this.updateBuildingForm);
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
        rentParking() {
            this.$refs.rentParkingForm.validate(valid => {
                if (!valid) return;
                this.$confirm('你确定要让他用这个车位？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '操作成功！'
                    });
                    console.log(this.rentParkingForm);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            })
        },
        withdrawParking(row) {
            this.$confirm('你确定不让他用这个车位了?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(row);
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        }
    }
}
</script>