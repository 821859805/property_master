<template>
    <div style="margin:20px">
        <el-form :inline="true" :model="searchBuildingForm">
            <el-form-item label="楼号">
                <el-input v-model="searchBuildingForm.housing" type="text" placeholder="请输入楼号"></el-input>
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
                @selection-change="handleSelectionChange" v-loading="loading">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="housing" label="楼号" width="80" align="center"></el-table-column>
                <el-table-column prop="unit" label="单元" width="80" align="center"></el-table-column>
                <el-table-column prop="room" label="房号" width="80" align="center"></el-table-column>
                <el-table-column prop="acreage" label="房间大小（m²）" width="120" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="80">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === '空闲' ? 'success' : 'warning'">
                            {{ scope.row.status }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="ownerName" label="业主" width="80px" align="center"></el-table-column>
                <el-table-column prop="type" label="入住类型" width="80px" align="center"></el-table-column>
                <el-table-column prop="remarks" label="备注" width="200px" align="center"></el-table-column>
                <el-table-column label="操作" width="250px" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <!-- 这里要注意，直接赋值是浅拷贝 -->
                        <el-button type="success" v-if="scope.row.status === '空闲'"
                            @click="lodgeInForm.id = scope.row.id; lodgeInVisible = true">入住</el-button>
                        <el-button type="warning" v-if=" scope.row.status === '已入住' "
                            @click=" lodgeOut(scope.row) ">退房</el-button>
                        <el-button type="primary"
                            @click=" updateBuildingForm = Object.assign({}, scope.row); updateBuildingVisible = true ">修改</el-button>
                        <el-button type="danger" @click=" delBuilding(scope.row) ">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @current-change=" handleCurrentChange " :hide-on-single-page=" value "
                :current-page.sync=" pageForm.currentPage " :page-size=" pageForm.pageSize "
                layout="total, prev, pager, next" :total=" totalPage ">
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
            <el-form ref="lodgeInForm" :model=" lodgeInForm " :rules=" lodgeInFormRules " label-width="100px"
                style="width:290px">
                <el-form-item prop="ownerId" label="业主id">
                    <el-input v-model=" lodgeInForm.ownerId " placeholder="请输入业主的id"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="入住类型">
                    <el-select v-model=" lodgeInForm.type " placeholder="请选择入住类型">
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
import { insertBuildingApi, selectBuildingByAdminApi, selectBuildingByConditionsByAdminApi, deleteBuildingByAdminApi, delBuildingByIdsByAdminApi, lodgeInApi, lodgeOutApi, updateBuildingByAdminApi } from '@/request/api'
import { toastSuccess, toastFail } from '@/utils/notice'
export default {
    mounted() {
        this.queryBuilding();
    },
    data() {
        return {
            lodgeInForm: {
                ownerId: '',
                type: '',
            },
            lodgeInVisible: false,
            searchBuildingForm: {
                housing: '',
                room: '',
                unit: ''
            },
            lodgeInFormRules: {
                ownerId: [{ required: true, message: '业主id不能不写！', trigger: 'blur' }],
                type: [{ required: true, message: '入住类型不能不选！', trigger: 'change' }]
            },
            buildingData: [],
            multipleSelection: [],
            addBuildingVisible: false,
            addBuildingForm: {
                housing: '',
                unit: '',
                room: '',
                acreage: '',
                remarks: '',
                status: '空闲'
            },
            addBuildingFormRules: {
                housing: [{ required: true, message: '楼号不能不写！', trigger: 'blur' }],
                unit: [{ required: true, message: '单元不能不写！', trigger: 'blur' }],
                room: [{ required: true, message: '房间号不能不写！', trigger: 'blur' }],
                acreage: [{ required: true, message: '多少平方不能不写！', trigger: 'blur' }],
                type: [{ required: true, message: '租往类型不能不选！', trigger: 'change' }]
            },
            updateBuildingVisible: false,
            updateBuildingForm: {},
            updateBuildingFormRules: {
                housing: [{ required: true, message: '楼号不能不写！', trigger: 'blur' }],
                unit: [{ required: true, message: '单元不能不写！', trigger: 'blur' }],
                room: [{ required: true, message: '房间号不能不写！', trigger: 'blur' }],
                acreage: [{ required: true, message: '多少平方不能不写！', trigger: 'blur' }],
                type: [{ required: true, message: '租住类型不能不选！', trigger: 'change' }]
            },
            totalPage: 100,
            pageForm: {      //当前页面信息
                currentPage: 1,
                pageSize: 7,
                data: ''     //要传给后端的数据
            },
            loading: true
        }
    },
    methods: {
        queryBuilding() {
            this.loading = true;
            selectBuildingByAdminApi(this.pageForm).then(res => {
                this.totalPage = res.data.total;
                this.buildingData = [];//清空当前列表
                res.data.list.forEach(building => {
                    let tabelData = building;
                    if (building.owner != null)
                        tabelData['ownerName'] = building.owner.name;
                    this.buildingData.push(tabelData);
                })
                this.loading = false;
            });
        },
        searchBuilding() {
            this.loading = true;
            this.pageForm.data = this.searchBuildingForm;
            selectBuildingByConditionsByAdminApi(this.pageForm).then(res => {
                this.totalPage = res.data.total;
                this.buildingData = [];//清空当前列表
                res.data.list.forEach(building => {
                    let tabelData = building;
                    if (building.owner != null)
                        tabelData['ownerName'] = building.owner.name;
                    this.buildingData.push(tabelData);
                })
                this.loading = false;
            })
        },
        delBuilding(row) {
            this.$confirm('你确定要删?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteBuildingByAdminApi(row).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.queryBuilding();
                })
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
                delBuildingByIdsByAdminApi(ids).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.queryBuilding();
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
        addBuilding() {
            this.$refs.addBuildingForm.validate(valid => {
                if (!valid) return;
                this.$confirm('你确定要提交？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    insertBuildingApi(this.addBuildingForm).then(res => {
                        this.queryBuilding();
                        this.addBuildingVisible = false;
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
        updateBuilding() {
            this.$refs.updateBuildingForm.validate(valid => {
                if (!valid) return;
                this.$confirm('你确定要修改？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateBuildingByAdminApi(this.updateBuildingForm).then(res => {
                        toastSuccess(this, "已修改成功！");
                        this.queryBuilding();
                        this.updateBuildingVisible = false;
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            })
        },
        lodgeIn() {
            this.$refs.lodgeInForm.validate(valid => {
                if (!valid) return;
                this.$confirm('你确定要让他入住？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    lodgeInApi(this.lodgeInForm).then(res => {
                        switch (res.code) {
                            case 20000:
                                toastSuccess(this, "已把房子给他住！");
                                this.queryBuilding();
                                this.lodgeInVisible = false;
                                break;
                            case 31404:
                                toastFail(this, "业主id不存在！！！");
                                break;
                            case 41404:
                                toastFail(this, "这个业主已经有房子了，本系统致力于缩小贫富差距，因此一个业主只能有一个房子!");
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
        lodgeOut(row) {
            this.$confirm('你确定要让他退房?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                lodgeOutApi(row).then(res => {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.queryBuilding();
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        handleCurrentChange(val) {
            this.queryBuilding();
        }
    }
}
</script>