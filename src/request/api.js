/**
 * api接口统一管理
 * 好处：当后期工程量越来越大，要维护时就不用去找页面修改了，直接在api里修改
 */

import {get1,get2,post1,post2,uploadPicture} from './http'//请求方式分为get，post两种，我个人是不喜欢用get的，因为太不安全了

export const loginApi = p => post2('/login',p);//登录接口

export const registerApi = p => post2('/register',p);//注册接口

/**
 *  业主端
 */

export const alterPasswordApi = p => post2('/alterPassword',p);//修改密码

export const selectOwnerApi = () => post1('/selectOwner');//查询当前业主信息
export const updateOwnerApi = p => post2('/updateOwner',p);//修改当前业主信息

export const selectHouseApi = () => post1('/selectHouse');//查询当前业主住房信息
export const updateHouseApi = p => post2('/updateHouse',p);//修改业主住房信息
export const selectBuildingApi = () => post1('selectBuilding');//查询业主房产具体信息
export const selectParkingApi = () => post1('/selectParking');//查询业主车位信息

export const insertFamilyApi = p =>post2('/insertFamily',p);//新增业主家人信息
export const selectFamilyApi = () =>post1('/selectFamily');//查询业主家人信息
export const updateFamilyApi = p =>post2('/updateFamily',p);//修改业主家人信息
export const deleteFamilyApi = p =>post2('/deleteFamily',p);//删除业主家人信息

export const insertComplaintApi = p =>post2('/insertComplaint',p);//新增业主投诉信息
export const selectComplaintApi = p =>post2('/selectComplaint',p);//查询业主投诉信息
export const selectComplaintByConditionsApi = p => post2('/selectComplaintByConditions',p);//按照条件查询业主投诉信息
export const updateComplaintApi = p =>post2('/updateComplaint',p);//修改业主投诉信息
export const deleteComplaintApi = p =>post2('/deleteComplaint',p);//删除业主投诉信息
export const delComplaintByIdsApi = p => post2('/delComplaintByIds',p);//批量删除业主投诉信息

export const insertRepairApi = p =>post2('/insertRepair',p);//新增业主报修信息
export const selectRepairApi = p =>post2('/selectRepair',p);//查询业主报修信息
export const selectRepairByConditionsApi = p => post2('/selectRepairByConditions',p);//按照条件查询业主报修信息
export const updateRepairApi = p =>post2('/updateRepair',p);//修改业主报修信息
export const deleteRepairApi = p =>post2('/deleteRepair',p);//删除业主报修信息
export const delRepairByIdsApi = p => post2('/delRepairByIds',p);//批量删除业主报修信息

export const uploadOwnerPictureApi = p => uploadPicture('/uploadOwnerPicture',p);//上传业主的照片


export const selectFeeApi = p =>post2('/selectFee',p);//查询物业费信息
export const selectFeeByConditionsApi = p => post2('/selectFeeByConditions',p);//按照条件查询物业费信息
export const deleteFeeApi = p =>post2('/deleteFee',p);//删除物业费信息
export const completeFeeApi = p =>post2('/completeFee',p);//处理报修


/**
 * 管理员端
 */

export const insertUserApi = p =>post2('/insertUser',p);//新增用户（业主）
export const selectUserApi = p =>post2('/selectUser',p);//查询全部用户信息
export const selectUserByContentApi = p => post2('/selectUserByContent',p);//按照内容查询用户信息
export const updateUserApi = p =>post2('/updateUser',p);//修改用户信息
export const deleteUserApi = p =>post2('/deleteUser',p);//删除用户
export const delUserByIdsApi = p => post2('/delUserByIds',p);//批量删除用户信息
export const lockUserApi = p => post2('/lockUser',p);//封用户的号
export const unlockUserApi = p => post2('/unlockUser',p);//解封用户的号
export const resetPwdApi = p => post2('/resetPwd',p);//重置账号的密码

export const selectOwnerByAdminApi = p =>post2('/selectOwnerByAdmin',p);//查看所有业主
export const selectOwnerByContentByAdminApi = p =>post2('/selectOwnerByContentByAdmin',p);//按照输入内容查找业主
export const updateOwnerByAdminApi = p =>post2('/updateOwnerByAdmin',p);//更新业主信息


export const selectComplaintByAdminApi = p =>post2('/selectComplaintByAdmin',p);//查询业主投诉信息
export const selectComplaintByConditionsByAdminApi = p => post2('/selectComplaintByConditionsByAdmin',p);//按照条件查询业主投诉信息
export const completeComplaintByAdminApi = p =>post2('/completeComplaintByAdmin',p);//处理投诉
export const deleteComplaintByAdminApi = p =>post2('/deleteComplaintByAdmin',p);//删除业主投诉信息
export const delComplaintByIdsByAdminApi = p => post2('/delComplaintByIdsByAdmin',p);//批量删除业主投诉信息

export const selectRepairByAdminApi = p =>post2('/selectRepairByAdmin',p);//查询业主报修信息
export const selectRepairByConditionsByAdminApi = p => post2('/selectRepairByConditionsByAdmin',p);//按照条件查询业主报修信息
export const completeRepairByAdminApi = p =>post2('/completeRepairByAdmin',p);//处理报修
export const deleteRepairByAdminApi = p =>post2('/deleteRepairByAdmin',p);//删除业主报修信息
export const delRepairByIdsByAdminApi = p => post2('/delRepairByIdsByAdmin',p);//批量删除业主报修信息

export const insertFeeApi = p =>post2('/insertFee',p);//新增催收物业费
export const selectFeeByAdminApi = p =>post2('/selectFeeByAdmin',p);//查询物业费信息
export const selectFeeByConditionsByAdminApi = p => post2('/selectFeeByConditionsByAdmin',p);//按照条件查询物业费信息
export const deleteFeeByAdminApi = p =>post2('/deleteFeeByAdmin',p);//删除物业费信息
export const delFeeByIdsByAdminApi = p => post2('/delFeeByIdsByAdmin',p);//批量删除物业费信息

export const insertBuildingApi = p =>post2('/insertBuilding',p);//新增建筑
export const selectBuildingByAdminApi = p =>post2('/selectBuildingByAdmin',p);//查询建筑信息
export const updateBuildingByAdminApi = p =>post2('/updateBuildingByAdmin',p);//修改建筑信息
export const selectBuildingByConditionsByAdminApi = p => post2('/selectBuildingByConditionsByAdmin',p);//按照条件查询建筑
export const deleteBuildingByAdminApi = p =>post2('/deleteBuildingByAdmin',p);//删除建筑
export const delBuildingByIdsByAdminApi = p => post2('/delBuildingByIdsByAdmin',p);//批量删除建筑
export const lodgeInApi = p =>post2('/lodgeIn',p);//用户居住
export const lodgeOutApi = p =>post2('/lodgeOut',p);//用户退居

export const insertParkingApi = p =>post2('/insertParking',p);//新增车位
export const selectParkingByAdminApi = p =>post2('/selectParkingByAdmin',p);//查询车位信息
export const updateParkingByAdminApi = p =>post2('/updateParkingByAdmin',p);//修改车位信息
export const selectParkingByConditionsByAdminApi = p => post2('/selectParkingByConditionsByAdmin',p);//按照条件查询车位
export const deleteParkingByAdminApi = p =>post2('/deleteParkingByAdmin',p);//删除车位
export const delParkingByIdsByAdminApi = p => post2('/delParkingByIdsByAdmin',p);//批量删除车位
export const rentParkingApi = p =>post2('/rentParking',p);//车位租出
export const withdrawParkingApi = p =>post2('/withdrawParking',p);//车位退回