<template>
    <div id="layoutContainer" v-title data-title="流程图设计">
        <div id="toolContainer">
            <Tool ref="tool"
                :endPointList="dist.endPoint"
                @endPointInsert="endPointInsert"
                @endPointDelete="endPointDelete"
                @endPointUpgrade="endPointUpgrade"
                @connectInsert="connectInsert"
                @connectDelete="connectDelete"
                @connectUpgrade="connectUpgrade"                
                @endPointDrag="endPointDrag"
                @markdownPreview="markdownPreview"                
                @markdownSave="markdownSave"                
                @jsplumbExport="jsplumbExport"                
                @jsplumbImport="jsplumbImport"                
            />
        </div>
        <div id="panelContainer">
            <Panel ref="panel"
                :umlDist="dist"
                @endPointClick="endPointClick"
                @endPointDrag="endPointDrag"
                @endPointUpgrade="endPointUpgrade"
            />
        </div>  

        <MarkdownDialog ref="markdownDialog" @save="markdownSave"/>           
    </div>
</template>

<script>
import { saveAs } from "file-saver";    
export default {
    name: "Layout",
    components: {
        Tool        :()=> import("../Jsplumb/Tool"), 
        Panel       :()=> import("../Jsplumb/Panel"), 
        MarkdownDialog  :()=> import("../Common/MarkdownDialog"), 
    },
    data() {
        return {
            sourceFile: "jsplumb.json",

            dist: {
                endPointId: 1 , 
                endPoint: [] , 
                connect: [],
                mdDist: {},
            },            
        }
    },
    mounted() {
        this.$nextTick().then(() => {
            this.dataInit()
        })          
    },
    methods: {
        dataInit: function() {
            console.log("dataInit:")

            let url = this.$parent.api ? this.$parent.api + "?sence=jsplumb&sourceFile=" + this.sourceFile : this.sourceFile            
            this.$axios.get(url).then(res => {
                if(res.data) {
                    if(!res.data.mdDist) res.data.mdDist = {} 
                    this.dist = res.data
                }

                setTimeout(() => {
                    this.$refs.panel && this.$refs.panel.refresh()
                }, 50)                         
            })
            .catch(err => {
                console.log("err:", err)                 
            })
        },

        endPointClick: function(endPoint) {
            console.log("endPointClick:" , endPoint)

            delete endPoint.md

            this.$refs.tool && this.$refs.tool.endPointClick(endPoint) 
        },
        endPointInsert: function(item) {
            console.log("endPointInsert:" , item)

            let endPoint    = JSON.parse(JSON.stringify(item))
            let oldId       = Number(endPoint.id)

            endPoint.x          = endPoint.x || 60
            endPoint.y          = endPoint.y || 60
            endPoint.parentId   = endPoint.parentId || 0
            endPoint.id         = this.dist.endPointId

            this.dist.endPointId += 1
            this.dist.endPoint.push(endPoint)

            // child copy
            // connect copy
            if(oldId > 0 && Number(endPoint.parentId) == 0) {
                let endPointDist = {}
                endPointDist[endPoint.type + oldId] = endPoint.type + endPoint.id

                this.dist.endPoint.map(node => {
                    if(node.parentId == oldId) {
                        
                        let childPoint      = JSON.parse(JSON.stringify(node))
                        childPoint.x        = Number(childPoint.x) + 10
                        childPoint.y        = Number(childPoint.y) + 10                        
                        childPoint.parentId = endPoint.id
                        childPoint.id       = this.dist.endPointId

                        this.dist.endPointId += 1
                        endPointDist[node.type + node.id] = childPoint.type + childPoint.id
                        
                        this.dist.endPoint.push(childPoint)
                    }
                }) 


                let connectList = JSON.parse(JSON.stringify(this.dist.connect))
                connectList.map(connect => {
                    if(endPointDist[connect.sourceId] && endPointDist[connect.targetId]) {
                        let newConnect = JSON.parse(JSON.stringify(connect))

                        newConnect.sourceId = endPointDist[connect.sourceId]
                        newConnect.targetId = endPointDist[connect.targetId]

                        this.dist.connect.push(newConnect)
                    }
                })
            }

            this.$refs.panel.refresh()
            this.$message.success(oldId > 0 ? "复制成功" : "添加成功")
        },
        endPointUpgrade: function(endPoint) {
            console.log("endPointUpgrade:" , endPoint)

            delete endPoint.md

            this.endPointDrag(endPoint)

            this.$refs.panel.refresh()
            this.$message.success("修改成功")            
        },
        endPointDelete: function(endPoint) {
            console.log("endPointDelete:" , endPoint)

            this.dist.endPoint[Number(endPoint.id) - 1] = {}


            let connecDeleteDist = {}
            connecDeleteDist[endPoint.type + endPoint.id] = true
            if(Number(endPoint.parentId) == 0) {
                this.dist.endPoint.map((item , index) => {
                    if(item.parentId == endPoint.id) {
                        connecDeleteDist[item.type + item.id] = true

                        this.dist.endPoint[index] = {}
                    }
                })
            }

            for (var i = this.dist.connect.length - 1; i >= 0; i--) {
                if(connecDeleteDist[this.dist.connect[i].sourceId] || connecDeleteDist[this.dist.connect[i].targetId]) {
                    this.dist.connect.splice(i , 1)
                }
            }

            
            this.$forceUpdate()

            this.$refs.panel.$forceUpdate()
            this.$refs.panel.refresh()
            this.$message.success("删除成功")            
        }, 
        endPointDrag: function(endPoint) {
            console.log("endPointDrag:" , endPoint)

            delete endPoint.md            

            let index = Number(endPoint.id) - 1

            // 修改了父级 自己跟随父级变化
            if(endPoint.parentId != this.dist.endPoint[index].parentId) {
                this.dist.endPoint.map(childPoint => {
                    if(childPoint.parentId == endPoint.id) {
                        childPoint.parentId = endPoint.parentId
                    }
                })                
            }

            // 修改了图形 连接跟着变化
            if(endPoint.type != this.dist.endPoint[index].type) {
                let oldIndex = `${this.dist.endPoint[index].type}${endPoint.id}`
                let newIndex = `${endPoint.type}${endPoint.id}`

                this.dist.connect.map(connect => {
                    if(connect.sourceId == oldIndex) {
                        connect.sourceId = newIndex
                    }
                    else if(connect.targetId == oldIndex) {
                        connect.targetId = newIndex                    
                    }
                })
            }

            Object.keys(endPoint).map(field => {
                this.dist.endPoint[index][field] = endPoint[field]
            }) 
        }, 
        markdownPreview: function() {
            console.log("markdownPreview:")

            let nodeId = this.$refs.tool.form.id
            if(this.dist.mdDist[nodeId]) return this.$refs.markdownDialog.show(this.dist.mdDist[this.$refs.tool.form.id])

            if(this.$parent.api) {
                let sourceFileArr = this.sourceFile.split("/")
                sourceFileArr[sourceFileArr.length - 1] = `md/${nodeId}.md`
                this.$axios.get(this.$parent.api + "?sence=jsplumb&sourceFile=" + sourceFileArr.join("/")).then(res => {
                    this.dist.mdDist[nodeId] = res.data.toString()
                    this.$refs.markdownDialog.show(this.dist.mdDist[nodeId])                                
                })
                .catch(err => {
                    console.log("err:" , err)
                    this.$refs.markdownDialog.show("")
                })
            }  
            else {
                this.$refs.markdownDialog.show("")
            }          
        }, 
        markdownSave: function(content) {
            console.log("markdownSave:" , content)

            this.dist.mdDist[this.$refs.tool.form.id] = content
        }, 

        connectInsert: function(connect) {
            console.log("connectInsert:" , connect)

            let hasFlag = false
            this.dist.connect.map(item => {
                if(item.sourceId == connect.sourceId || item.sourceId == connect.targetId) {
                    if(item.targetId == connect.sourceId || item.targetId == connect.targetId) {
                        hasFlag = true
                    }
                }
            }) 

            if(hasFlag) return this.$message.error("连接线已存在")

            this.dist.connect.push(connect)

            this.$refs.panel.refresh()
            this.$message.success("操作成功")
        },
        connectUpgrade: function(connect) {
            console.log("connectUpgrade:" , connect)

            this.dist.connect.map((connectItem , index) => {
                if(connectItem.index == connect.index) {
                    this.dist.connect[index] = connect
                }
            })

            this.$refs.panel.refresh()
            this.$message.success("修改成功")            
        },
        connectDelete: function(connect) {
            console.log("connectDelete:" , connect)

            this.dist.connect.map((connectItem , index) => {
                if(connectItem.index == connect.index) {
                    this.dist.connect.splice(index , 1)
                }
            })

            this.$refs.panel.refresh()
            this.$message.success("删除成功")            
        }, 


        jsplumbExport: function() {
            console.log("jsplumbExport:")

            if(this.$parent.api) {

                let tempDist = JSON.parse(JSON.stringify(this.dist))
                delete tempDist.mdDist
                let param = {
                    sence: "jsplumb",
                    mdDist: this.dist.mdDist,
                    json: JSON.stringify(tempDist , null , 4),
                    sourceFile: this.sourceFile,
                }

                this.$axios.post(this.$parent.api , param).then(res => {
                    this.$message.success("导出成功")
                })
                .catch(err => {
                    this.$message.error("API请求失败")                    
                })
            }
            else {
                let blob = new Blob([JSON.stringify(this.dist , null , 4)], {type: "text/plain;charset=utf-8"})            
                saveAs(blob, this.sourceFile)
            } 
        },

        jsplumbImport: function(sourceFile) {
            console.log("jsplumbImport:" , sourceFile)

            this.sourceFile = sourceFile
            this.dataInit()
        }          
    }      
}       
</script>

<style scoped>
#layoutContainer {
    display: flex;
    border: 1px solid #ddd;
    position: relative;z-index: -12;    
    align-items: center;
}
.title {
    line-height: 34px;
    background: #3a8bd5;
    color: #fff;
    font-size: 14px;
    position: relative;
}
#toolContainer {
    width: 310px;
    height: calc(100vh - 100px);
    border-right: 1px solid #ddd;
}
#panelContainer {
    flex: 1;
    width: 100%;
    height: calc(100vh - 100px);
    overflow-x: hidden;
    overflow-y: auto;
    position: inherit;z-index: -11;
}
</style>
