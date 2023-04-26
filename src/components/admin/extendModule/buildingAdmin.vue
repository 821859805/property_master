<template>
    <div style="margin:20px">
        <el-form :inline="true" :model="searchBuildingForm">
            <el-form-item label="楼号">
                <el-input v-model="searchBuildingForm.housing"  type="text" placeholder="请输入楼号"></el-input>
            </el-form-item>
            <el-form-item label="单元">
                <el-input v-model="searchBuildingForm.unit" type="text" placeholder="请输入单元"></el-input>
            </el-form-item>
            <el-form-item label="房号">
                <el-input v-model="searchBuildingForm.room" type="text" placeholder="请输入房号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchBuilding">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="background-color:white">
            <el-button type="warning" style="margin:10px" @click="addBuildingVisible = true">添加</el-button>
            <el-button type="danger" style="margin:10px" @click="delBuildings">批量删除</el-button>

            <el-table ref="multipleTable" :data="buildingData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="housing" label="楼号" width="120" align="center"></el-table-column>
                <el-table-column prop="unit" label="单元" width="120" align="center"></el-table-column>
                <el-table-column prop="room" label="房号" width="120" align="center"></el-table-column>
                <el-table-column prop="acreage" label="房间大小（m²）" width="120" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="120">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === '空闲' ? 'success' : 'info'">
                            {{ scope.row.status }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="业主" width="120px" align="center"></el-table-column>
                <el-table-column prop="type" label="入住类型" width="120px" align="center"></el-table-column>
                <el-table-column prop="remarks" label="备注" width="200px" align="center"></el-table-column>
                <el-table-column label="操作" width="250px" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <!-- 这里要注意，直接赋值是浅拷贝 -->
                        <el-button type="success" v-if="scope.row.status === '空闲'" @click="lodgeInVisible = true">入住</el-button>
                        <el-button type="warning" v-if="scope.row.status === '已入住'"
                            @click="lodgeOut(scope.row)">退房</el-button>
                        <el-button type="primary"
                            @click="updateBuildingForm = Object.assign({}, scope.row); updateBuildingVisible = true">修改</el-button>
                        <el-button type="danger" @click=" delBuilding(scope.row) ">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @current-change=" handleCurrentChange " :hide-on-single-page=" value "
                :current-page.sync=" currentPage " :page-size=" pageSize " layout="total, prev, pager, next"
                :total=" totalPage ">
            </el-pagination>
        </div>

        <el-dialog title="添加楼盘" :visible.sync=" addBuildingVisible " width="30%">
            <el-form ref="addBuildingForm" :model=" addBuildingForm " :rules=" addBuildingFormRules " label-width="100px"
                style="width:290px">
                <el-form-item prop="housing" label="楼号">
                    <el-input v-model=" addBuildingForm.housing "></el-input>
                </el-form-item>
                <el-form-item prop="unit" label="单元">
                    <el-input v-model=" addBuildingForm.unit "></el-input>
                </el-form-item>
                <el-form-item prop="room" label="房号">
                    <el-input v-model=" addBuildingForm.room "></el-input>
                </el-form-item>
                <el-form-item prop="acreage" label="面积（m²）">
                    <el-input v-model=" addBuildingForm.acreage "></el-input>
                </el-form-item>
                <el-form-item prop="type" label="入住类型">
                    <el-select v-model="addBuildingForm.type" placeholder="请选择入住类型">
                        <el-option label="租住" value="租住"></el-option>
                        <el-option label="全权" value="全权"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="remarks" label="备注">
                    <el-input type="textarea" v-model=" addBuildingForm.remarks "></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click=" addBuildingVisible = false ">取 消</el-button>
                <el-button type="primary" @click=" addBuilding ">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改信息" :visible.sync=" updateBuildingVisible " width="30%">
            <el-form ref="updateBuildingForm" :model=" updateBuildingForm " :rules=" updateBuildingFormRules "
                label-width="100px" style="width:290px">
                <el-form-item prop="housing" label="楼号">
                    <el-input v-model=" updateBuildingForm.housing "></el-input>
                </el-form-item>
                <el-form-item prop="unit" label="单元">
                    <el-input v-model=" updateBuildingForm.unit "></el-input>
                </el-form-item>
                <el-form-item prop="room" label="房号">
                    <el-input v-model=" updateBuildingForm.room "></el-input>
                </el-form-item>
                <el-form-item prop="acreage" label="面积（m²）">
                    <el-input v-model=" updateBuildingForm.acreage "></el-input>
                </el-form-item>
                <el-form-item prop="remarks" label="备注">
                    <el-input type="textarea" v-model=" updateBuildingForm.remarks "></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click=" updateBuildingVisible = false ">取 消</el-button>
                <el-button type="primary" @click=" updateBuilding ">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="入住房间" :visible.sync=" lodgeInVisible " width="30%">
            <el-form ref="lodgeInForm" :model=" lodgeInForm " :rules="lodgeInFormRules " label-width="100px" style="width:290px">
                <el-form-item prop="id" label="业主">
                    <el-select v-model=" lodgeInForm.id " placeholder="请选择业主">
                        <el-option v-for=" item  in  ownerOptions " :key=" item.value " :label=" item.label "
                            :value=" item.value "></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="type" label="入住类型">
                    <el-select v-model="lodgeInForm.type" placeholder="请选择入住类型">
                        <el-option label="租住" value="租住"></el-option>
                        <el-option label="全权" value="全权"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click=" lodgeInVisible = false ">取 消</el-button>
                <el-button type="primary" @click=" lodgeIn ">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { toastSuccess, toastFail } from '@/utils/notice'
export default {
    data() {
        return {
            lodgeInForm:{},
            lodgeInVisible:false,
            searchBuildingForm: {
                housing:'',
                room:'',
                unit:''
            },
            lodgeInFormRules:{
                id:[{ required: true, message: '业主不能不选！', trigger: 'change' }],
                type:[{ required: true, message: '入住类型不能不选！', trigger: 'change' }]
            },
            buildingData: [{
                id: 1,
                housing: 'G栋',
                unit: '3单元',
                room: '105',
                acreage: 100,
                status: '空闲',
                remarks: ''
            }, {
                id: 2,
                housing: 'L栋',
                unit: '105',
                room: 165,
                acreage: 120,
                status: '已入住',
                name: '123',
                remarks: ''
            }],
            multipleSelection: [],
            addBuildingVisible: false,
            addBuildingForm: {},
            addBuildingFormRules: {
                housing: [{ required: true, message: '楼号不能不写！', trigger: 'blur' }],
                unit: [{ required: true, message: '单元不能不写！', trigger: 'blur' }],
                room: [{ required: true, message: '房间号不能不写！', trigger: 'blur' }],
                acreage: [{ required: true, message: '多少平方不能不写！', trigger: 'blur' }],
                type:[{ required: true, message: '租往类型不能不选！', trigger: 'change' }]
            },
            updateBuildingVisible: false,
            updateBuildingForm: {},
            updateBuildingFormRules: {
                housing: [{ required: true, message: '楼号不能不写！', trigger: 'blur' }],
                unit: [{ required: true, message: '单元不能不写！', trigger: 'blur' }],
                room: [{ required: true, message: '房间号不能不写！', trigger: 'blur' }],
                acreage: [{ required: true, message: '多少平方不能不写！', trigger: 'blur' }],
                type:[{ required: true, message: '租住类型不能不选！', trigger: 'change' }]
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
        searchBuilding() {
            console.log(this.searchBuildingForm);
        },
        delBuilding(row) {
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
        delBuildings() {
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
        addBuilding() {
            this.$refs.addBuildingForm.validate(valid => {
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
                    console.log(this.addBuildingForm);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消添加'
                    });
                });
            })
        },
        updateBuilding() {
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
        lodgeIn(){
            this.$refs.lodgeInForm.validate(valid => {
                if (!valid) return;
                this.$confirm('你确定要让他入住？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '已入住！'
                    });
                    console.log(this.lodgeInForm);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            })
        },
        lodgeOut(row){
            this.$confirm('你确定要让他退房?', '提示', {
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