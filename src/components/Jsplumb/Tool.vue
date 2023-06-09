<template>
	<div id="toolContainer">
		<div class="endPointRow">	
            <Rectangle  label="" zIndex="1" :styleList="form.type == 'rectangle' ? selectStyleList : []" :width="endPointSize" :height="endPointSize" @endPointClick="endPointClick($event)"/>	
            <div>&emsp;</div>	
            <Elliptical label="" zIndex="1" :styleList="form.type == 'elliptical' ? selectStyleList : []" :width="endPointSize" :height="endPointSize" @endPointClick="endPointClick($event)"/>        
            <div>&emsp;</div>   
            <Lozenge    label="" zIndex="1" :styleList="form.type == 'lozenge' ? selectStyleList : []" :size="endPointSize" @endPointClick="endPointClick($event)"/>        
            <div>&emsp;</div>   
            <Rhomboid   label="" zIndex="1" :styleList="form.type == 'rhomboid' ? selectStyleList : []" :size="endPointSize" @endPointClick="endPointClick($event)"/>        
            <div>&emsp;</div>   
            <Connect :selected="form.type == 'connect' ? true : false" @endPointClick="endPointClick($event)"/>        
		</div>


        <div class="form" v-if="form.type">            
            <el-divider>表单信息</el-divider>

            <div class="flex" v-if="form.type != 'connect'">
                <div class="label">类型</div>
                <div>&emsp;</div>
                <el-select filterable size="small" class="w100" v-model="form.type" placeholder="请选择">
                    <el-option v-for="(item , index) in typeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>                
            </div> 

            <div class="lr">
                <div class="label">标签</div>
                <div>&emsp;</div>
                <el-input size="small" v-model="form.label" placeholder="标签" />           
            </div>

            <template v-if="form.type == 'connect'">
                <div class="flex">
                    <div class="label">起点</div>
                    <div>&emsp;</div>
                    <el-select filterable size="small" class="w100" v-model="form.sourceId" placeholder="请选择">
                        <el-option v-for="(item , index) in connectOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>                     
                    <div>&emsp;</div>
                    <el-select filterable size="small" class="w100" v-model="form.sourcePos" placeholder="请选择">
                        <el-option v-for="item in posOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>                    
                </div> 
                <div class="flex">
                    <div class="label">终点</div>
                    <div>&emsp;</div>
                    <el-select filterable size="small" class="w100" v-model="form.targetId" placeholder="请选择">
                        <el-option v-for="(item , index) in connectOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>                    
                    <div>&emsp;</div>
                    <el-select filterable size="small" class="w100" v-model="form.targetPos" placeholder="请选择">
                        <el-option v-for="(item , index) in posOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>                      
                </div>                                                  
                <div class="flex">
                    <div class="label">箭头</div>
                    <div>&emsp;</div>
                    <el-select filterable size="small" class="w100" v-model="form.arrow" placeholder="请选择">
                        <el-option v-for="(item , index) in allowOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>                      
                </div> 
                <div class="lr">
                    <div class="label">虚线</div>
                    <div>&emsp;</div>
                    <el-input size="small" v-model="form.dash" placeholder="5,5" />           
                </div>  
                <div class="lr">
                    <div class="label">颜色</div>
                    <div>&emsp;</div>
                    <el-input size="small" v-model="form.labelColor" placeholder="#333" />           
                </div>                                                 
                <div class="lr">
                    <div class="label">填充</div>
                    <div>&emsp;</div>
                    <el-input size="small" v-model="form.labelFill" placeholder="#fff" />           
                </div>  
                <div class="flex">
                    <div class="label">线型</div>
                    <div>&emsp;</div>
                    <el-select filterable size="small" class="w100" v-model="form.connector" placeholder="请选择">
                        <el-option v-for="(item , index) in lineOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>                     
                </div>                                 
            </template>
            <template v-else>  
                <div class="lr">
                    <div class="label">zIndex</div>
                    <div>&emsp;</div>
                    <el-input size="small" v-model="form.zIndex" placeholder="1" />           
                </div>                                      
                <div class="lr">
                    <div class="label">坐标</div>
                    <div>&emsp;</div>
                    <el-input size="small" v-model="form.x" placeholder="x坐标" />           
                    <div>&emsp;</div>
                    <el-input size="small" v-model="form.y" placeholder="y坐标" />           
                </div>            
                <div class="flex">
                    <div class="label">父级</div>
                    <div>&emsp;</div>
                    <el-select filterable size="small" class="w100" v-model="form.parentId" placeholder="请选择">
                        <el-option v-for="(item , index) in endPointOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>                    
                </div>            
                <div class="lr" v-if="form.type == 'rectangle' || form.type == 'elliptical'">
                    <div class="label">宽高</div>
                    <div>&emsp;</div>
                    <el-input size="small" v-model="form.width" placeholder="宽度" />           
                    <div>&emsp;</div>
                    <el-input size="small" v-model="form.height" placeholder="高度" />           
                </div>
                <div class="lr" v-else>
                    <div class="label">大小</div>
                    <div>&emsp;</div>
                    <el-input size="small" v-model="form.size" placeholder="大小" />           
                </div> 
    
                <div class="flex">
                    <div class="label">样式</div>
                    <div>&emsp;</div>
                    <el-button icon="el-icon-plus" @click="stylePush" size="small" type="primary"></el-button>
                </div>
                <template v-if="form.styleList">
                    <div class="flex" v-for="(styleItem , styleIndex) in form.styleList">
                        <el-input size="small" v-model="styleItem.key" placeholder="key"/>  
                        <div>&nbsp;</div>         
                        <el-input size="small" v-model="styleItem.value" placeholder="value"/>           
                        <div>&nbsp;</div>    
                        <el-button icon="el-icon-delete" type="danger" @click="stylePop(styleIndex)" size="small"></el-button>
                    </div>              
                </template>
            </template>

            <div class="flex" v-if="form.id || form.index">
                <el-button plain size="small" @click="formCopy" type="primary">复制</el-button>           
                <el-button plain size="small" @click="formUpgrade" type="warning">修改</el-button>           
                <el-button plain size="small" @click="formDelete" type="danger">删除</el-button>           
                <el-button size="small" @click="markdownPreview">说明</el-button>                                                  
            </div>
            <div class="flex" v-else>
                <el-button plain size="small" @click="formInsert" type="success">新增</el-button>           
            </div>
            
            <template v-if="endPointList && endPointList.length > 0">
                <el-divider>数据导出</el-divider>
                <div class="flex">
                    <el-button plain size="small" @click="jsplumbExport" type="primary">导出</el-button>           
                </div>
            </template>
        </div>


        <MarkdownDialog ref="markdownDialog" @save="markdownSave"/>
    </div>
</template>

<script>
export default {
    name: "Tool",
    components: {
        Rectangle       :()=> import("./Rectangle"), 
        Lozenge         :()=> import("./Lozenge"), 
        Rhomboid        :()=> import("./Rhomboid"), 
        Elliptical      :()=> import("./Elliptical"), 
        Connect         :()=> import("./Connect"), 
        MarkdownDialog  :()=> import("../Common/MarkdownDialog"), 
    },
    props: {
        endPointList: {},  
    },
    data() {
        return {
            endPointSize: 40,
            selectStyleList: [
                {key: "border-color" , value: "#ffb802"}
            ],

            type: "endPoint",
            form: {},


            typeOptions: [
                {label: "Rectangle" , value: "rectangle"},
                {label: "Lozenge" , value: "lozenge"},
                {label: "Rhomboid" , value: "rhomboid"},
                {label: "Elliptical" , value: "elliptical"},
            ],
            allowOptions: [
                {label: "无" , value: ""},
                {label: "左箭头" , value: "left"},
                {label: "右箭头" , value: "right"},
                {label: "双向箭头" , value: "both"},
            ],
            posOptions: [
                {label: "顶边" , value: "top"},
                {label: "顶角" , value: "topEnd"},
                {label: "右边" , value: "right"},
                {label: "右角" , value: "rightEnd"},
                {label: "底边" , value: "bottom"},
                {label: "底角" , value: "bottomEnd"},
                {label: "左边" , value: "left"},
                {label: "左角" , value: "leftEnd"},                
            ],
            lineOptions: [
                {label: "贝塞尔曲线" , value: "Bezier"},
                {label: "流程线" , value: "Flowchart"},
                {label: "状态机" , value: "StateMachine"},
                {label: "直线" , value: "Straight"},
            ],           
        }
    },
    methods: {
        formInsert: function() {
            console.log("formInsert:")

            this.form.type == "connect" ? this.connectInsert() : this.endPointInsert()
        },
        formCopy: function() {
            console.log("formCopy:")
            
            this.form.type == "connect" ? this.connectInsert() : this.endPointCopy()
        },
        formUpgrade: function() {
            console.log("formUpgrade:")

            this.form.type == "connect" ? this.connectUpgrade() : this.endPointUpgrade()
        },
        formDelete: function() {
            console.log("formDelete:")

            this.form.type == "connect" ? this.connectDelete() : this.endPointDelete()
        },



        endPointClick: function(endPoint) {
            console.log("endPointClick:" , endPoint)  

            if(!endPoint.styleList) endPoint.styleList = []

            this.form = JSON.parse(JSON.stringify(endPoint))
            
            this.$forceUpdate()
        },  
        endPointInsert: function() {
            console.log("endPointInsert:")

            this.$emit("endPointInsert" , JSON.parse(JSON.stringify(this.form)))
        },
        endPointCopy: function() {
            console.log("endPointCopy:")
            
            let newForm = JSON.parse(JSON.stringify(this.form))

            newForm.x = Number(newForm.x) + 10
            newForm.y = Number(newForm.y) + 10

            this.$emit("endPointInsert" , newForm)
        },
        endPointUpgrade: function() {
            console.log("endPointUpgrade:")

            this.$emit("endPointUpgrade" , this.form)
        },
        endPointDelete: function() {
            console.log("endPointDelete:")

            this.$emit("endPointDelete" , this.form)
        },


        connectInsert: function() {
            console.log("connectInsert:")

            this.form.source = `${this.form.sourceId}_${this.form.sourcePos}`
            this.form.target = `${this.form.targetId}_${this.form.targetPos}`
            this.form.index = `${this.form.siurce}_${this.form.target}`
            this.$emit("connectInsert" , JSON.parse(JSON.stringify(this.form)))
        },       
        connectUpgrade: function() {
            console.log("connectUpgrade:")

            this.$emit("connectUpgrade" , this.form)
        },
        connectDelete: function() {
            console.log("connectDelete:")

            this.$emit("connectDelete" , this.form)
        },


        stylePush: function() {
            console.log("stylePush:")

            if(!this.form.styleList) this.form.styleList = []

            this.form.styleList.push({
                key: "",
                value: "",
            })        
            this.$forceUpdate()
        },
        stylePop: function(index) {
            console.log("stylePop:" , index)
            
            this.form.styleList.splice(index , 1)
            this.$forceUpdate()
        },
        markdownPreview: function() {
            console.log("markdownPreview:")

            this.$refs.markdownDialog.show(this.form.md)
        },
        markdownSave: function(content) {
            console.log("markdownSave:" , content)

            this.form.md = content

            this.$emit("endPointDrag" , this.form) 
            this.$message.success("保存成功")           
        },        
        jsplumbExport: function() {
            console.log("jsplumbExport:")

            this.$emit("jsplumbExport")
        },        
    }, 
    computed: {
        endPointOptions: function() {
            let options = []     

            if(this.endPointList) {
                this.endPointList.map(item => {
                    if(item.id) {
                        options.push({
                            label: `${item.label || item.type} [${item.x} , ${item.y}]`,
                            value: item.id,
                        })
                    }
                })
            }

            return options
        },
        connectOptions: function() {
            let options = []     

            if(this.endPointList) {
                this.endPointList.map(item => {
                    options.push({
                        label: `${item.label || item.type} [${item.x} , ${item.y}]`,
                        value: `${item.type}${item.id}`,                    
                    })
                })
            }

            return options
        },                
    }   
}	
</script>
<style scoped>
#toolContainer {
    height: calc(100vh - 100px);    
}
.lr, .flex {
    line-height: 45px;
}
.endPointRow {
    display: flex;
    flex-flow: wrap;
    align-content: flex-start;    
    padding: 20px;
}
.form {
    padding: 15px;
}
.label {
    font-size: 12px;
    color: #303133;
    text-align: left;
    line-height: 26px;
    min-width: 26px;    
}
.w100 {
    width: 100%;
}    
</style>	