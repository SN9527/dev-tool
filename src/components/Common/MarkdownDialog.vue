<template>
    <el-dialog 
        title="markdown 预览"
        :visible.sync="showDialog"
        :modal="false"
        width="80%"
        >
        <v-md-editor 
            v-model="fileContent" 
            left-toolbar=""
            right-toolbar="preview toc sync-scroll save"
            :default-show-toc="true"
            :toc-nav-position-right="true"
            mode="editable"
            height="700px"
            @save="save"
        />
    </el-dialog>   	
</template>

<script>
export default {
    name: "MarkdownDialog",
    data() {
        return {
        	showDialog: false,
        	fileContent: "",
        }
    },
    methods: {
    	show: function(content) {
    		console.log("show:" , content)

    		this.fileContent = content || ""
    		this.showDialog = true
    	},
        save: function() {
    		console.log("save:")
    
            this.showDialog = false
        	this.$emit("save" , this.fileContent)
        },      
    },
}   
</script>

<style scoped>
/deep/ .el-dialog__body {
    padding: 20px 20px 10px;
    text-align: left;
}    
/deep/ .el-dialog__headerbtn {
    font-size: 26px;
}
/deep/ .el-dialog__header {
    text-align: left;
}
</style>