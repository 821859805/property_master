<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../../assets/imags/logo.png" style="width: 75px;height: 60px;" alt="">
                <span>社区物业后台管理系统</span>
            </div>
            <div>
                退出
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu background-color="rgb(14,9,42)" text-color="#fff" active-text-color="#ffd04b" router>
                        <el-menu-item index="/ownerInfo">
                            <i class="el-icon-office-building"></i>
                            <span>住户信息查询</span>
                        </el-menu-item>
                        <el-menu-item index="/complaintInfo">
                            <i class="el-icon-phone-outline"></i>
                            <span>投诉管理</span>
                        </el-menu-item>
                        <el-menu-item index="/payInfo">
                            <i class="el-icon-s-order"></i>
                            <span>缴费信息管理</span>
                        </el-menu-item>
                        <el-menu-item index="/repairInfo">
                            <i class="el-icon-s-cooperation"></i>
                            <span>报修管理</span>
                        </el-menu-item>
                        <el-menu-item index="./alterPwd">
                            <i class="el-icon-s-tools"></i>
                            <span>修改密码</span>
                        </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main style="padding:0">
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import router from '@/router';


export default {
    components: { router }
}
</script>

<style lang="less" scoped>
.el-header {
    background-color: rgb(1, 23, 46);
    display: flex;
    justify-content: space-between; //左右贴边对齐
    padding-left: 0;
    color: white;
    font-size: 20px;

    >div {
        display: flex;
        align-items: center;

        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background-color: rgb(14, 9, 42);
}

.el-main {
    background-color: aliceblue;
    overflow: hidden;
}

.home-container {
    height: 100vh;

}
</style>