<template>
    <div class="nodeContainer" :class="nodeClass" :id="'rectangle_' + id" :style="{'z-index': zIndex}">        
    	<div class="rectangle" :style="nodeStyleGet" @click="endPointClick">
            <p class="ellipsis" :style="labelStyleGet">{{label}}</p>              
        </div>
        <div class="node" :style="posDist.top"      :id="posDist.topId"></div>
        <div class="node" :style="posDist.right"    :id="posDist.rightId"></div>
        <div class="node" :style="posDist.bottom"   :id="posDist.bottomId"></div>
        <div class="node" :style="posDist.left"     :id="posDist.leftId"></div>  
        <div class="node" :style="posDist.topEnd"   :id="posDist.topEndId"></div>
        <div class="node" :style="posDist.rightEnd" :id="posDist.rightEndId"></div>
        <div class="node" :style="posDist.bottomEnd":id="posDist.bottomEndId"></div>
        <div class="node" :style="posDist.leftEnd"  :id="posDist.leftEndId"></div>               
    </div>
</template>

<script>
export default {
    name: "Rectangle",
    props: {
        nodeClass: {type: String , default: ""}, 
        zIndex: {type: [String, Number] , default: "-10"},   
        id: {type: [String, Number] , default: "0"},   
        label: {type: String , default: "rectangle"},  
        width: {type: [String, Number] , default: 80},  
        height: {type: [String, Number] , default: 80},  
        styleList: {},  
    }, 
    data() {
        return {
            posDist: {
                top: "",topId: "",
                right: "",rightId: "",
                bottom: "",bottomId: "",
                left: "",leftId: "",    
                
                topEnd: "",topEndId: "",
                rightEnd: "",rightEndId: "",
                bottomEnd: "",bottomEndId: "",
                leftEnd: "",leftEndId: "",              
            },

            endPoint: {
                type: "rectangle",
                width: this.width,
                height: this.height,
                label: this.label,
            }            
        }
    },
    mounted() {
        this.posCreate()
    },    
    methods: {
        posCreate: function() {
            let width   = Number(this.width) / 2
            let height  = Number(this.height) / 2

            this.posDist.top        = `top:-4px;right:${width - 4}px;`
            this.posDist.right      = `top:${height - 4}px;right:-4px;`
            this.posDist.bottom     = `bottom:-4px;left:${width - 4}px;`
            this.posDist.left       = `top:${height - 4}px;left:-4px;`
            this.posDist.topEnd     = `top:-4px;left:-4px;`
            this.posDist.rightEnd   = `top:-4px;right:-4px;`
            this.posDist.bottomEnd  = `bottom:-4px;right:-4px;`
            this.posDist.leftEnd    = `bottom:-4px;left:-4px;`            

            this.posDist.leftId     = `rectangle${this.id}_left`
            this.posDist.rightId    = `rectangle${this.id}_right`
            this.posDist.topId      = `rectangle${this.id}_top`
            this.posDist.bottomId   = `rectangle${this.id}_bottom`  
            this.posDist.leftEndId  = `rectangle${this.id}_leftEnd`
            this.posDist.rightEndId = `rectangle${this.id}_rightEnd`
            this.posDist.topEndId   = `rectangle${this.id}_topEnd`
            this.posDist.bottomEndId= `rectangle${this.id}_bottomEnd`                        
        },  
        endPointClick: function() {
            this.$emit("endPointClick" , this.endPoint)
        },      
    },
    computed: {  
        nodeStyleGet: function() {
            let style = `width:${this.width}px;height:${this.height}px;line-height:${this.height}px;`;

            if(this.styleList) {
                this.styleList.map(styleItem => {
                    style += `${styleItem.key}: ${styleItem.value};`
                })
            }

            return style
        },
        labelStyleGet: function() {
            let style = `height:fit-content;line-height:${this.height}px;`

            return style
        }, 
    }
}   
</script>
<style scoped>
.nodeContainer {
    position: relative;
}
.node {
    position: absolute;
    width: 8px;
    height: 8px;
}

.rectangle{
    border: 2px solid #333;
    position: relative;
}
.rectangle:hover {
	cursor: pointer;
	border: 2px solid #ffb802;
    color: #ffb802;
}
</style>