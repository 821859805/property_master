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
                            placeholder="选择日期"></el-date-picker>
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
                    <el-upload action="#" list-type="picture-card" :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
                <el-button type="primary" @click="submitPersonalInfo">提交修改</el-button>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="房产信息">
            <el-form ref="buildingForm" :model="buildingForm" label-width="150px">
                <div style="display: flex">
                    <el-form-item prop="no" label="房产证编号">
                        <el-input v-model="buildingForm.estateNo"></el-input>
                    </el-form-item>
                    <el-form-item label="发证日期">
                        <el-date-picker style="width: 190px;" v-model="buildingForm.ctime" type="date"
                            placeholder="选择日期"></el-date-picker>
                    </el-form-item>
                </div>

                <div style="display: flex">
                    <el-form-item label="产权情况">
                        <el-select style="width: 190px;" v-model="buildingForm.power" placeholder="请选择产权情况">
                            <el-option label="自有" value="自有"></el-option>
                            <el-option label="租入" value="租入"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所在城区">
                        <el-input v-model="buildingForm.urban"></el-input>
                    </el-form-item>
                </div>

                <div style="display: flex">
                    <el-form-item label="所在街道">
                        <el-input v-model="buildingForm.street"></el-input>
                    </el-form-item>
                    <el-form-item label="所在社区">
                        <el-input v-model="buildingForm.community"></el-input>
                    </el-form-item>
                </div>

                <div style="display: flex">
                    <el-form-item label="所在楼盘">
                        <el-input v-model="buildingForm.housing"></el-input>
                    </el-form-item>
                    <el-form-item label="所在单元">
                        <el-input v-model="buildingForm.unit"></el-input>
                    </el-form-item>
                </div>

                <div style="display: flex">
                    <el-form-item label="所在楼层">
                        <el-input v-model="buildingForm.floor"></el-input>
                    </el-form-item>
                    <el-form-item label="所在房号">
                        <el-input v-model="buildingForm.room"></el-input>
                    </el-form-item>
                </div>

                <div style="display: flex">
                    <el-form-item label="总面积">
                        <el-input v-model="buildingForm.acreage"></el-input>
                    </el-form-item>
                    <el-form-item label="上次更新时间">
                        <span>{{ buildingForm.lastupdate }}</span>
                    </el-form-item>
                </div>
                <el-button type="primary" @click="submitBuildingInfo">提交修改</el-button>
            </el-form>
        </el-tab-pane>

        <el-tab-pane label="家庭成员信息">
            <el-button type="primary" @click="addMemberVisible = true">新增</el-button>
            <el-table :data="familyData" stripe style="width: 100%">
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center"></el-table-column>
                <el-table-column prop="age" label="年龄" align="center"></el-table-column>
                <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
                <el-table-column prop="age" label="年龄" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="updateMemberForm.id = scope.row.id; updateMemberForm = scope.row; updateMemberVisible = true">修改</el-button>
                        <el-button type="danger" @click=" deleteMember(scope.row) ">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="新增家庭成员" :visible.sync=" addMemberVisible " width="30%">
                <el-form ref="addMemberForm" :model=" addMemberForm " :rules=" addMemberFormRules " label-width="100px" style="width:290px">
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
                <el-form ref="updateMemberForm" :model=" updateMemberForm " :rules=" updateMemberFormRules" label-width="100px" style="width:290px">
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
export default {
    data() {
        return {
            activeIndex: '',
            personalInfoForm: {
                name: '',
                sex: '',
                birthday: '',
                idNo: '',
                mobile: '',
                email: ''
            },
            buildingForm: {
                id: 1,
                no: '',
                acreage: '',
                community: '',
                floor: '',
                housing: '',
                power: '',
                room: '',
                street: '',
                ctime: '',
                unit: '',
                urban: '',
                lastupdate: '还没有数据'
            },
            familyData: [{
                id: 1,
                name: '王者',
                sex: '男',
                age: 30,
                relationship: '兄弟',
                mobile: '123456'
            }, {
                id: 2,
                name: '原神',
                sex: '男',
                age: 15,
                relationship: '父子',
                mobile: '6123456'
            }, {
                id: 3,
                name: '蛋仔',
                sex: '女',
                age: 12,
                relationship: '父女',
                mobile: '12331456'
            }],
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

            dialogImageUrl: '',
            dialogVisible: false
        }
    },
    methods: {
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
        submitPersonalInfo() {
            this.$refs.personalInfoForm.validate(valid => {
                if (!valid) return;
                console.log(this.personalInfoForm);
            })
        },
        addMember() {
            this.$refs.addMemberForm.validate(valid => {
                if (!valid) return;
                console.log(this.addMemberForm)
            })
        },
        updateMember() {
            this.$refs.updateMemberForm.validate(valid => {
                if (!valid) return;
                console.log(this.updateMemberForm)
            })
        },
        deleteMember(row) {
            this.$confirm('此操作将删除成员信息, 是否继续?', '提示', {
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
        submitBuildingInfo() {
            console.log(this.buildingForm);
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        }
    }

}
</script>