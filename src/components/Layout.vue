<template>
    <div id="layoutContainer">  
        <div class="menu">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-submenu :key="item.label" :index="item.label" v-for="item in menuList">
                    <template slot="title">{{item.label}}</template>

                    <el-menu-item :key="child.value" :index="child.value" v-for="child in item.child">{{child.label}}</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>

        <JsMind v-if="activeIndex == 'JsMind'" />
        <YamlJson v-else-if="activeIndex == 'YamlJson'" />
        <Jsplumb v-else-if="activeIndex == 'Jsplumb'" />
        <JsonEdit v-else-if="activeIndex == 'JsonEdit'" />
    </div>
</template>

<script>
export default {
    name: "Layout",
    components: {
        List             :()=> import("./List"),         
        YamlJson         :()=> import("./Tools/YamlJson"),         
        JsMind           :()=> import("./Tools/JsMind"),         
        Jsplumb          :()=> import("./Tools/Jsplumb"),         
        JsonEdit         :()=> import("./Tools/JsonEdit"),         
    },
    data() {
        return {
            menuList: [
                {"label": "常用工具" , child: [
                    {label: "思维导图" , value: "JsMind"},
                    {label: "流程图" , value: "Jsplumb"},
                ]},                
                {"label": "转换工具" , child: [
                    {label: "YamlJson" , value: "YamlJson"},
                    {label: "Json编辑" , value: "JsonEdit"},
                ]},
            ],
            activeIndex: "",
            api: "",
        }
    },
    mounted() {
        this.activeIndex    = this.paramGet("tool") || "JsMind"
        this.api            = this.paramGet("api") || ""
    },
    methods: {
        paramGet: function(name) {
        　　 var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        　　 var r = window.location.search.substr(1).match(reg);
        　　 if(r != null) return unescape(r[2]);
        　　 return null;
        },        
        handleSelect: function(index) {
            console.log("handleSelect:" , index)

            this.activeIndex = index
        },        
    }      
}       
</script>

<style scoped>
#layoutContainer {
    position: relative;z-index: -12;    
}    
.menu {
    text-align: left;
    margin-bottom: 20px;
}
.el-menu-item.is-active {
    color: #409EFF !important;
}
</style>
