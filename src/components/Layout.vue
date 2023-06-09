<template>
    <div id="layoutContainer">  
        <div class="menu">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-submenu :index="item.label" v-for="item in menuList">
                    <template slot="title">{{item.label}}</template>

                    <el-menu-item :index="child.value" v-for="child in item.child">{{child.label}}</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>

        <JsMind v-if="activeIndex == 'jsMind'" />
        <YamlJson v-else-if="activeIndex == 'YamlJson'" />
    </div>
</template>

<script>
export default {
    name: "Layout",
    components: {
        List             :()=> import("./List"),         
        YamlJson         :()=> import("./Tools/YamlJson"),         
        JsMind           :()=> import("./Tools/JsMind"),         
    },
    data() {
        return {
            menuList: [
                {"label": "常用工具" , child: [
                    {label: "思维导图" , value: "jsMind"}
                ]},                
                {"label": "转换工具" , child: [
                    {label: "YamlJson" , value: "YamlJson"}
                ]},
            ],
            activeIndex: "jsMind",
        }
    },
    methods: {
        handleSelect: function(index) {
            console.log("handleSelect:" , index)

            this.activeIndex = index
        },        
    }      
}       
</script>

<style scoped>
.menu {
    text-align: left;
    margin-bottom: 20px;
}
.el-menu-item.is-active {
    color: #409EFF !important;
}
</style>
