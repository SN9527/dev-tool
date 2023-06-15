<template>
    <div v-title data-title="json编辑">
        <div style="display: flex;">
            <div style="width: 50%;">
                <codemirror
                    ref="codeLeft" 
                    v-model="codeLeft" 
                    :options="leftOptions"
                    @input="leftChange"
                />
            </div>
            
            <div>&emsp;</div>

            <div style="width: 50%;">
                <codemirror 
                    ref="codeRight" 
                    v-model="codeRight" 
                    :options="rightOptions"
                    @input="rightChange"
                />
            </div>            
        </div>
    </div>    
</template>

<script>
import { codemirror } from "vue-codemirror"
import "codemirror/lib/codemirror.css"

import "codemirror/mode/javascript/javascript.js"
import "codemirror/theme/ayu-mirage.css"    
import "codemirror/theme/3024-day.css"    

export default {
    name: "JsonEdit",
    components: {
        codemirror,
    },
    data() {
        return {
            codeLeft: "",
            codeRight: "",
            leftOptions: {
                line: true,
                theme: "3024-day", // 主题
                tabSize: 4, // 制表符的宽度
                indentUnit: 4, // 一个块应该缩进多少个空格
                firstLineNumber: 1, // 从哪个数字开始计算行数。默认值为 1。
                readOnly: false, // 只读
                autorefresh: true,
                smartIndent: true, // 上下文缩进
                lineNumbers: true, // 是否显示行号
                styleActiveLine: true, // 高亮选中行
                viewportMargin: Infinity, //处理高度自适应时搭配使用
                showCursorWhenSelecting: true, // 当选择处于活动状态时是否应绘制游标
                mode: "javascript",
            },
            rightOptions: {
                line: true,
                theme: "ayu-mirage", 
                tabSize: 4, 
                indentUnit: 4, 
                firstLineNumber: 1, 
                readOnly: false, 
                autorefresh: true,
                smartIndent: true, 
                lineNumbers: true, 
                styleActiveLine: true, 
                viewportMargin: Infinity, 
                showCursorWhenSelecting: true, 
                mode: "javascript",
            },            


            YAML: null,
            ignoreChange: "",
        };
    },
    mounted() {
        let that = this

        this.$nextTick().then(() => {
            that.codeHeight = parseFloat(document.documentElement.clientHeight) - 105

            that.$refs.codeLeft.codemirror.setSize("auto" , that.codeHeight)
            that.$refs.codeRight.codemirror.setSize("auto" , that.codeHeight)
        })           

        window.onresize = function () {
            that.codeHeight = parseFloat(document.documentElement.clientHeight) - 105
            console.log("onresize" , that.codeHeight)
            
            that.$refs.codeLeft.codemirror.setSize("auto" , that.codeHeight)
            that.$refs.codeRight.codemirror.setSize("auto" , that.codeHeight)
        }
    },
    methods: {
        leftChange: function(code) {
            if(this.ignoreChange == "left") {
                this.ignoreChange = ""
                return false
            }

            console.log("leftChange:" , code)

            try {
                this.codeRight = JSON.stringify(JSON.parse(code) , null , 4) || ""
                this.ignoreChange = "right"
            }
            catch(err) {
                console.log("err:" , err)
            }
        },
        rightChange: function(code) {
            if(this.ignoreChange == "right") {
                this.ignoreChange = ""
                return false
            }

            console.log("rightChange:" , code)

            try {
                this.codeLeft = JSON.stringify(JSON.parse(code))
                this.ignoreChange = "left"
            }
            catch(err) {
                console.log("err:" , err)
            }            
        },        
    }
}
</script>

<style scoped>
.CodeMirror {
    height: calc(100vh - 90px) !important;
}    
</style>
