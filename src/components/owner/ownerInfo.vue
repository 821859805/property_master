<template>
    <el-tabs v-model="activeIndex" style="height: 100%" type="border-card" @tab-click="tabClick">
        <el-tab-pane label="业主信息">
            <el-form ref="personalInfoForm" :model="personalInfoForm" label-width="100px" :rules="personalInfoFormRules">
                <div style="display: flex">
                    <el-form-item prop="name" label="姓名">
                        <el-input v-model="personalInfoForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-select style="width: 190px;" v-model="personalInfoForm.sex" placeholder="请选择你的性别">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div style="display: flex">
                    <el-form-item label="出生日期">
                        <el-date-picker style="width: 190px;" v-model="personalInfoForm.birthday" type="date"
                            value-format="yyyy-MM-dd">
                            <!-- 一定要加上上面这句，否则送到后台时间会差两天，因为element用的是别的时区 -->
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="身份证号码">
                        <el-input v-model="personalInfoForm.idNo"></el-input>
                    </el-form-item>
                </div>
                <div style="display: flex">
                    <el-form-item prop="mobile" label="联系电话">
                        <el-input v-model="personalInfoForm.mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮件">
                        <el-input v-model="personalInfoForm.email"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="照片">
                    <el-upload list-type="picture-card" action :http-request="uploadPicture" :show-file-list="false"
                        :on-remove="handleRemove">
                        <img v-if="personalInfoForm.imageUrl" :src="personalInfoForm.imageUrl" class="avatar">
                        <i v-if="!personalInfoForm.imageUrl" class="el-icon-plus"></i>
                    </el-upload>

                </el-form-item>
                <el-button type="primary" @click="submitPersonalInfo">提交修改</el-button>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="房产信息">
            <el-form ref="buildingForm" :model="buildingForm" label-width="150px">
                <div style="display: flex">
                    <el-form-item v-if="buildingForm.type === '全权'" prop="no" label="房产证编号">
                        <el-input v-model="buildingForm.no"></el-input>
                    </el-form-item>
                    <el-form-item v-if="buildingForm.type === '全权'" label="发证日期">
                        <el-date-picker style="width: 190px;" v-model="buildingForm.ctime" type="date" placeholder="选择日期"
                            value-format="yyyy-MM-dd">
                            <!-- 一定要加上上面这句，否则送到后台时间会差两天，因为element用的是别的时区 -->
                        </el-date-picker>
                    </el-form-item>
                </div>

                <div style="display: flex">
                    <el-form-item label="产权情况:">
                        <span>{{ buildingForm.type }}</span>
                    </el-form-item>

                </div>

                <div style="display: flex">
                    <el-form-item label="所在城区">
                        <el-input v-model="buildingForm.city"></el-input>
                    </el-form-item>
                    <el-form-item label="所在街道">
                        <el-input v-model="buildingForm.street"></el-input>
                    </el-form-item>

                </div>

                <div style="display:flex">
                    <el-form-item label="所在社区">
                        <el-input v-model="buildingForm.community"></el-input>
                    </el-form-item>
                </div>

                <div style="display: flex">
                    <el-form-item label="所在楼盘:">
                        <span>{{ buildingForm.housing }}</span>
                    </el-form-item>
                    <el-form-item label="所在单元:">
                        <span>{{ buildingForm.unit }}</span>
                    </el-form-item>
                    <el-form-item label="所在房号:">
                        <span>{{ buildingForm.room }}</span>
                    </el-form-item>
                    <el-form-item label="总面积（m²）:">
                        <span>{{ buildingForm.acreage }}</span>
                    </el-form-item>
                </div>

                <div style="display: flex">
                    <el-form-item label="车位号:">
                        <span>{{ buildingForm.carNo }}</span>
                    </el-form-item>

                </div>

                <div style="display: flex">

                    <el-form-item label="上次更新时间">
                        <span>{{ buildingForm.lastupdate }}</span>
                    </el-form-item>
                </div>
                <el-button type="primary" @click="submitBuildingInfo">提交修改</el-button>
            </el-form>
        </el-tab-pane>

        <el-tab-pane label="家庭成员信息">
            <el-button type="primary" @click="addMemberVisible = true">新增</el-button>
            <el-table :data="familyData" stripe style="width: 100%" v-loading="loading">
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center"></el-table-column>
                <el-table-column prop="age" label="年龄" align="center"></el-table-column>
                <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
                <el-table-column prop="age" label="年龄" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary"
                            @click="updateMemberForm.id = scope.row.id; updateMemberForm = Object.assign({}, scope.row); updateMemberVisible = true">修改</el-button>
                        <el-button type="danger" @click=" deleteMember(scope.row) ">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="新增家庭成员" :visible.sync=" addMemberVisible " width="30%">
                <el-form ref="addMemberForm" :model=" addMemberForm " :rules=" addMemberFormRules " label-width="100px"
                    style="width:290px">
                    <el-form-item prop="name" label="姓名"><el-input v-model=" addMemberForm.name "></el-input></el-form-item>
                    <el-form-item label="性别">
                        <el-select style="width: 190px;" v-model=" addMemberForm.sex " placeholder="请选择你的性别">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年龄"><el-input v-model=" addMemberForm.age "></el-input></el-form-item>
                    <el-form-item prop="relationship" label="与你的关系"><el-input
                            v-model=" addMemberForm.relationship "></el-input></el-form-item>
                    <el-form-item prop="mobile" label="联系方式"><el-input
                            v-model=" addMemberForm.mobile "></el-input></el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click=" addMemberVisible = false ">取 消</el-button>
                    <el-button type="primary" @click=" addMember ">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="修改家庭成员信息" :visible.sync=" updateMemberVisible " width="30%">
                <el-form ref="updateMemberForm" :model=" updateMemberForm " :rules=" updateMemberFormRules "
                    label-width="100px" style="width:290px">
                    <el-form-item prop="name" label="姓名"><el-input
                            v-model=" updateMemberForm.name "></el-input></el-form-item>
                    <el-form-item label="性别">
                        <el-select style="width: 190px;" v-model=" updateMemberForm.sex " placeholder="请选择你的性别">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年龄"><el-input v-model=" updateMemberForm.age "></el-input></el-form-item>
                    <el-form-item prop="relationship" label="与你的关系"><el-input
                            v-model=" updateMemberForm.relationship "></el-input></el-form-item>
                    <el-form-item prop="mobile" label="联系方式"><el-input
                            v-model=" updateMemberForm.mobile "></el-input></el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click=" updateMemberVisible = false ">取 消</el-button>
                    <el-button type="primary" @click=" updateMember ">确 定</el-button>
                </span>
            </el-dialog>

        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { selectParkingApi,selectBuildingApi, uploadOwnerPictureApi, selectOwnerApi, updateOwnerApi, selectHouseApi, updateHouseApi, insertFamilyApi, selectFamilyApi, updateFamilyApi, deleteFamilyApi } from '@/request/api';
import { toastSuccess, toastFail } from '@/utils/notice';

export default {
    mounted() {
        this.queryPersonalInfo();
        this.queryBuildingInfo();
        this.queryMemberInfo();
    },
    data() {
        return {
            loading:true,
            activeIndex: '',
            personalInfoForm: {
                name: '',
                sex: '',
                birthday: '',
                idNo: '',
                mobile: '',
                email: '',
                imageUrl: ''
            },
            buildingForm: {
                id: 1,
                no: '',
                acreage: '',
                community: '',
                floor: '',
                housing: '',
                type: '自有',
                room: '33',
                street: '33',
                ctime: '',
                unit: '11',
                city: '12',
                lastupdate: '还没有数据'
            },
            familyData: [],
            personalInfoFormRules: {
                name: [{ required: true, message: '姓名不能为空！', trigger: 'blur' }],
                mobile: [{ required: true, message: '手机号不能为空！', trigger: 'blur' }]
            },

            addMemberVisible: false,
            addMemberForm: {
                name: '',
                sex: '',
                relationship: '',
                mobile: ''
            },
            addMemberFormRules: {
                name: [{ required: true, message: '姓名不能不写！', trigger: 'blur' }],
                relationship: [{ required: true, message: '和你的关系不能不写!', trigger: 'blur' }],
                mobile: [{ required: true, message: '手机号不能不写!', trigger: 'blur' }]
            },

            updateMemberVisible: false,
            updateMemberForm: {
                id: '',
                name: '',
                sex: '',
                relationship: '',
                mobile: ''
            },
            updateMemberFormRules: {
                name: [{ required: true, message: '姓名不能不写！', trigger: 'blur' }],
                relationship: [{ required: true, message: '和你的关系不能不写!', trigger: 'blur' }],
                mobile: [{ required: true, message: '手机号不能不写!', trigger: 'blur' }]
            },

        }
    },
    methods: {
        queryPersonalInfo() {//查询业主个人信息
            this.loading = true;
            selectOwnerApi().then(res => {
                this.personalInfoForm = res.data;
            }).catch(err => {
                console.log(err);
            });
            this.loading = false;

        },
        queryBuildingInfo() {//查询业主住房信息
            this.loading = true;
            selectHouseApi().then(res => {
                this.buildingForm = res.data.house
                selectBuildingApi().then(res => {
                    this.buildingForm.type = res.data.type;
                    this.buildingForm.acreage = res.data.acreage;
                    this.buildingForm.lastupdate = res.data.updateTime;
                    this.buildingForm.housing = res.data.housing;
                    this.buildingForm.unit = res.data.unit;
                    this.buildingForm.room = res.data.room;
                    selectParkingApi().then(res =>{
                        this.buildingForm.carNo=res.data.carNo;
                    })
                    this.loading = false;
                });
            }).catch(err => {
                console.log(err);
            })

        },
        queryMemberInfo() {//查询业主家庭成员信息
            selectFamilyApi().then(res => {
                this.familyData = res.data.familyList
            }).catch(err => {
                console.log(err);
            })
        },
        tabClick() {
            switch (this.activeIndex) {
                case '0':
                    console.log(0);
                    break;
                case '1':
                    console.log(1);
                    break;
                case '2':
                    console.log(2);
                    break;
            }
        },
        submitPersonalInfo() {//修改业主个人信息
            //一定要加await和async，否则执行语句顺序会颠倒
            this.$refs.personalInfoForm.validate(async valid => {
                if (!valid) return;
                await updateOwnerApi(this.personalInfoForm).then(res => { });
                await this.queryPersonalInfo();
                toastSuccess(this, "恭喜你，修改信息成功了！");

            })
        },
        addMember() {//新增业主家庭成员
            this.$refs.addMemberForm.validate(valid => {
                if (!valid) return;
                insertFamilyApi(this.addMemberForm).then(res => {
                    toastSuccess(this, "新增成功！");
                    this.addMemberVisible = false;
                    this.queryMemberInfo();
                }).catch(err => {
                    console.log(err);
                    toastFail(this, "服务器忙，新增失败！")
                })
            })
        },
        updateMember() {
            this.$refs.updateMemberForm.validate(valid => {
                if (!valid) return;
                updateFamilyApi(this.updateMemberForm).then(res => {
                    toastSuccess(this, "修改成功！");
                    this.updateMemberVisible = false;
                    this.queryMemberInfo();
                }).catch(err => {
                    console.log(err);
                    toastFail(this, "服务器忙，修改失败！")
                })
            })
        },
        deleteMember(row) {
            this.$confirm('此操作将删除成员信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteFamilyApi(row).then(res => {
                    toastSuccess(this, "删除成功！");
                    this.queryMemberInfo();
                }).catch(err => {
                    console.log(err);
                    toastFail(this, "服务器忙，删除失败！")
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        submitBuildingInfo() {//修改业主住房信息
            updateHouseApi(this.buildingForm).then(res => {
                toastSuccess(this, "修改成功！")
            }).catch(err => {
                toastFail(this, "服务器忙，修改失败！")
            })
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        uploadPicture(param) {
            const formData = new FormData();
            formData.append("file", param.file);
            uploadOwnerPictureApi(formData).then(resp => {
                this.personalInfoForm.imageUrl = "http://localhost:8086/api/images/upload/" + resp
            }).catch(err => {

            })
        },
        handleCurrentChange(val) {
            this.queryMemberInfo();
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