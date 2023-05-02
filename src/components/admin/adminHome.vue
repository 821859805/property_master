<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../../assets/imags/logo.png" style="width: 75px;height: 60px;" alt="">
                <span>社区物业后台管理系统-管理员</span>
            </div>
            <div>
                <a href="#" style="color: aliceblue;text-decoration: none;" @click="logout">退出</a>
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu background-color="rgb(14,9,42)" text-color="#fff" active-text-color="#ffd04b" router>
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-s-claim"></i>
                            <span>基本业务管理</span>
                        </template>
                        <el-menu-item index="/ownerAdmin">
                            <i class="el-icon-s-order"></i>
                            <span>业主信息管理</span>
                        </el-menu-item>
                        <el-menu-item index="/feeAdmin">
                            <i class="el-icon-s-order"></i>
                            <span>物业收费管理</span>
                        </el-menu-item>
                        <el-menu-item index="/complaintAdmin">
                            <i class="el-icon-phone-outline"></i>
                            <span>投诉管理</span>
                        </el-menu-item>
                        <el-menu-item index="/repairAdmin">
                            <i class="el-icon-s-cooperation"></i>
                            <span>报修管理</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>更多业务管理</span>
                        </template>
                        <el-menu-item index="/buildingAdmin">
                            <i class="el-icon-office-building"></i>
                            <span>楼盘信息管理</span>
                        </el-menu-item>

                        <el-menu-item index="/parkingAdmin">
                            <i class="el-icon-stopwatch"></i>
                            <span>车位管理</span>
                        </el-menu-item>
                        <el-menu-item index="/userInfo">
                            <i class="el-icon-s-custom"></i>
                            <span>用户信息管理</span>
                        </el-menu-item>
                    </el-submenu>
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
    components: { router },
    data() {
        return {
            
        }
    },
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push("/login");
        }
    }
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