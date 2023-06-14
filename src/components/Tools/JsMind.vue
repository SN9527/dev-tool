<template>
    <div v-title data-title="思维导图">
        <div class="flex" style="border-bottom: 1px solid #ddd;padding: 0 0 20px;">
            <div style="width: 200px;margin-right: 10px;">
                <el-input type="text" size="mini" v-model="sourceFile"/>
            </div>
            <el-button icon="el-icon-download" size="mini" @click="jsMindImport">导入</el-button>
            <el-button icon="el-icon-upload2" size="mini" @click="jsMindExport">导出</el-button>

            <el-button icon="el-icon-zoom-in" size="mini" @click="jsMindZoomIn">放大</el-button>
            <el-button icon="el-icon-zoom-out" size="mini" @click="jsMindZoomOut">缩小</el-button>
        </div>

        <div id="jsmindContainer"></div>

        <MarkdownDialog ref="markdownDialog" @save="markdownSave"/>        
        <RightMenu 
            ref="rightMenu" 
            id="rightMenu" 
            :list="rightMenuList" 
            @click="rightMenuClick"
        />        
    </div>
</template>

<script>
import "jsmind/style/jsmind.css"
import jsMind from "jsmind/js/jsmind.js"
window.jsMind = jsMind
require("jsmind/js/jsmind.draggable-node.js")

import { saveAs } from "file-saver";    
export default {
    name: "JsMind",
    components: {
        MarkdownDialog  :()=> import("../Common/MarkdownDialog"), 
        RightMenu  :()=> import("../Common/RightMenu"), 
    },
    data() {
        return {
            sourceFile: "jsmind.json",

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


            rightMenuList: [
                {label: "添加子节点" , value: "add" , icon: "el-icon-circle-plus"},
                {label: "删除节点" , value: "delete" , icon: "el-icon-delete"},
                {label: "Markdown" , value: "markdown" , icon: "el-icon-s-order"},
            ],
        };
    },
    mounted() {
        document.oncontextmenu = function() {return false}
        this.jsMind = new jsMind(this.options)        
        this.jsMindImport(false)
    },
    methods: {
        rightMenuEventListen: function() {
            setTimeout(() => {
                var jmnodes = document.getElementsByTagName("jmnode")
                for (var i = jmnodes.length - 1; i >= 0; i--) {
                    jmnodes[i].addEventListener("contextmenu" , event => {
                        event.preventDefault()
                        document.getElementById("rightMenu").style.left = event.x + 5 + "px"
                        document.getElementById("rightMenu").style.top = event.y - 5 + "px" 

                        this.$refs.rightMenu.show()            
                    })
                }
            }, 1000);
        },





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
            if(this.$parent.api) {
                let param = {
                    sence: "jsMind",
                    json: JSON.stringify(mindData , null , 4),
                    sourceFile: this.sourceFile,
                    mdDist: this.mind.mdDist,
                }
                this.$axios.post(this.$parent.api , param).then(res => {
                    this.$message.success("导出成功")
                })
                .catch(err => {
                    this.$message.error("API请求失败")                    
                })
            }
            else {
                mindData.mdDist = this.mind.mdDist

                let blob = new Blob([JSON.stringify(mindData , null , 4)], {type: "text/plain;charset=utf-8"})            
                saveAs(blob, this.sourceFile)
            }
        },  
        jsMindImport: function(fileMust = true) {
            console.log("jsMindImport:")

            let url = this.$parent.api ? this.$parent.api + "?sence=jsMind&sourceFile=" + this.sourceFile : this.sourceFile
            this.$axios.get(url).then(res => {
                if(fileMust && !res.data) return this.$message.error("加载文件失败")

                if(res.data) this.mind = res.data

                this.jsMind.show(this.mind)                    
                this.rightMenuEventListen()                                 
            })
            .catch(err => {
                console.log("err:", err)

                if(fileMust) return this.$message.error("加载文件失败")

                this.jsMind.show(this.mind)   
                this.rightMenuEventListen()                                 
            })            

        }, 


        markdownSave: function(content) {
            console.log("markdownSave:" , content)

            if(!this.mind.mdDist) this.mind.mdDist = {}

            let node = this.jsMind.get_selected_node()
            this.mind.mdDist[node.id] = content
            this.$forceUpdate()

            this.$message.success("保存成功")           
        }, 

        rightMenuClick: function(command) {
            console.log("rightMenuClick:" , command)

            let node = this.jsMind.get_selected_node()
            console.log("node:" , node)
            switch(command) {
                case "add":
                    var nodeid = jsMind.util.uuid.newid();
                    this.jsMind.add_node(node, nodeid, "空白")
                    this.jsMind.select_node(nodeid)
                    this.jsMind.begin_edit(nodeid)
                    this.rightMenuEventListen()
                    break;

                case "delete":
                    this.jsMind.remove_node(node)
                    break;                    

                case "markdown":
                    if(this.mind.mdDist && this.mind.mdDist[node.id]) return this.$refs.markdownDialog.show(this.mind.mdDist)        

                    if(this.$parent.api) {
                        let sourceFileArr = this.sourceFile.split("/")
                        sourceFileArr[sourceFileArr.length - 1] = `md/${node.id}.md`
                        this.$axios.get(this.$parent.api + "?sence=jsMind&sourceFile=" + sourceFileArr.join("/")).then(res => {
                            this.mind.mdDist[node.id] = res.data
                            this.$refs.markdownDialog.show(res.data)                                
                        })
                        .catch(err => {
                            this.$refs.markdownDialog.show("")
                        })
                    }
                    else {
                        this.$refs.markdownDialog.show("")
                    }
                    break;                    
            }
        },
    }
}
</script>

<style scoped>
#jsmindContainer {
    width: 100%;
    height: calc(100vh - 146px);
}    
#rightMenu {
    position: absolute;
}
</style>
