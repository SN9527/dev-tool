<template>
    <div>
        <el-dropdown trigger="click" placement="bottom-start" @command="handleCommand">
            <div id="dropdown"></div>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item 
                    :key="item.value" 
                    :command="item.value" 
                    :icon="item.icon" v-for="item in list">
                    {{item.label}}
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>  
        <div id="dropdownBody"></div>
    </div>
</template>

<script>
export default {
    name: "RightMenu",
    props: {
        list: {}
    },
    data() {
        return {
        }
    },
    methods: {
        show: function() {
            console.log("show:")
            
            document.getElementById("dropdownBody").click()

            setTimeout(() => {                
                document.getElementById("dropdown").click()
            }, 10)
        }, 
        handleCommand: function(command) {
            console.log("handleCommand:" , command) 

            this.$emit("click" , command)           
        },             
    },
}   
</script>