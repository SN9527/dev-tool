<template>
    <div v-title data-title="思维导图">
        <div class="flex" style="border-bottom: 1px solid #ddd;padding: 0 0 20px;">
            <div style="width: 200px;margin-right: 10px;"><el-input type="text" size="mini" placeholder="json文件" v-model="mindFile"/></div>
            <el-button icon="el-icon-download" size="mini" @click="jsMindImport">导入</el-button>
            <el-button icon="el-icon-upload2" size="mini" @click="jsMindExport">导出</el-button>

            <el-button icon="el-icon-zoom-in" size="mini" @click="jsMindZoomIn">放大</el-button>
            <el-button icon="el-icon-zoom-out" size="mini" @click="jsMindZoomOut">缩小</el-button>
        </div>

        <div id="jsmindContainer"></div>

        <MarkdownDialog ref="markdownDialog" @save="markdownSave"/>        
    </div>
</template>

<script>
import "jsmind/style/jsmind.css"
import jsMind from "jsmind/js/jsmind.js"
window.jsMind = jsMind

require("@/assets/jsmind.menu.js")

import { saveAs } from "file-saver";    
export default {
    name: "JsMind",
    components: {
        MarkdownDialog  :()=> import("../Common/MarkdownDialog"), 
    },
    data() {
        return {
            mindFile: "jsmind.json",

            mind: {
                meta: {
                    name: "jsMind",
                    version: "0.1"
                },
                format: "node_tree",
                data: {
                    id: "root",
                    topic: "jsMind",
                    children: []
                },
                mdDist: {},
            },
            options: {
                container: "jsmindContainer",
                editable: true, 
                theme: "primary", 
                support_html : true,
                mode : "full",
                menuOpts: {
                    showMenu: true,
                    injectionList: [
                        {target:"edit",text: "编辑节点",callback: function (node) {console.log(node)}},
                        {target:"addChild",text: "添加子节点",callback: function (node) {console.log(node)}},
                        {target:"addBrother",text: "添加兄弟节点",callback: function (node) {console.log(node)}},
                        {target:"delete",text: "删除节点",callback: function (node) {console.log(node)}},
                        {target:"screenshot",text: "Markdown",callback: this.markdownPreview},
                    ],                
                },                
                view: {
                    engine: "canvas", 
                    hmargin: 100, 
                    vmargin: 50, 
                    line_width: 2, 
                    line_color: "#ddd",
                    draggable: true 
                },
                layout: {
                    hspace: 100, 
                    vspace: 20, 
                    pspace: 10 
                },
                shortcut: {
                    enable: false 
                }
            },
            jsMind: null,           
        };
    },
    mounted() {
        document.oncontextmenu = function() {return false}
        this.jsMind = new jsMind(this.options)        
        this.jsMindImport(false)
    },
    methods: {
        jsMindZoomIn: function() {
            console.log("jsMindZoomIn:")
            this.jsMind.view.zoomIn()
        },
        jsMindZoomOut: function() {
            console.log("jsMindZoomOut:")
            this.jsMind.view.zoomOut()
        },   
        jsMindExport: function() {
            console.log("jsMindExport:")

            let mindData = this.jsMind.get_data()
            mindData.mdDist = this.mind.mdDist

            let blob = new Blob([JSON.stringify(mindData , null , 4)], {type: "text/plain;charset=utf-8"})            
            saveAs(blob, this.mindFile)
        },  
        jsMindImport: function(fileMust = true) {
            console.log("jsMindImport:")

            this.$axios.get(this.mindFile).then(res => {
                console.log("res:", res)

                if(fileMust && !res.data) return this.$message.error("加载文件失败")

                if(res.data) this.mind = res.data

                this.jsMind.show(this.mind)                    
            })
            .catch(err => {
                console.log("err:", err)

                if(fileMust) return this.$message.error("加载文件失败")

                this.jsMind.show(this.mind)                    
            })            

        }, 

        markdownPreview: function(node) {
            if(node) {
                console.log("markdownPreview:" , node)

                if(!this.mind.mdDist) this.mind.mdDist = {}

                this.nodeId = node.id

                this.$refs.markdownDialog.show(this.mind.mdDist[this.nodeId])
            }
        },
        markdownSave: function(content) {
            console.log("markdownSave:" , content)

            this.mind.mdDist[this.nodeId] = content
            this.$forceUpdate()

            this.$message.success("保存成功")           
        },                                
    }
}
</script>

<style scoped>
#jsmindContainer {
    width: 100%;
    height: calc(100vh - 146px);
}    
</style>
