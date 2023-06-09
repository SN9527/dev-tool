<template>
    <div class="nodeContainer" :class="nodeClass" :id="'rhomboid_' + id" :style="{'z-index': zIndex}">        
        <div class="rhomboid" :style="nodeStyleGet" @click="endPointClick">
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
    name: "Rhomboid",
    props: {
        nodeClass: {type: String , default: ""}, 
        zIndex: {type: [String, Number] , default: "-9"},   
        id: {type: [String, Number] , default: "0"},   
        label: {type: String , default: "rhomboid"},  
        size: {type: [String, Number] , default: 80},  
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
                type: "rhomboid",
                size: this.size,
                label: this.label,
            }              
        }
    },
    mounted() {
        this.posCreate()
    },    
    methods: {
        posCreate: function() {
            let width   = Number(this.size) / 2
            let high    = Number(this.size) / (2 * Math.sqrt(3))     
            let len     = width / Math.sqrt(3)

            this.posDist.top        = `top:-4px;right:${width - 4 - high}px;`
            this.posDist.right      = `top:${width - 4}px;right:-4px;`
            this.posDist.bottom     = `bottom:-4px;left:${width - 4 - high}px;`
            this.posDist.left       = `top:${width - 4}px;left:-4px;`
            this.posDist.topEnd     = `top:-4px;left:${len - 4}px;`
            this.posDist.rightEnd   = `top:-4px;right:-${len + 4}px;`
            this.posDist.bottomEnd  = `bottom:-4px;right:${len - 4}px;`
            this.posDist.leftEnd    = `bottom:-4px;left:-${len + 4}px;`            



            this.posDist.leftId     = `rhomboid${this.id}_left`
            this.posDist.rightId    = `rhomboid${this.id}_right`
            this.posDist.topId      = `rhomboid${this.id}_top`
            this.posDist.bottomId   = `rhomboid${this.id}_bottom`  
            this.posDist.leftEndId  = `rhomboid${this.id}_leftEnd`
            this.posDist.rightEndId = `rhomboid${this.id}_rightEnd`
            this.posDist.topEndId   = `rhomboid${this.id}_topEnd`
            this.posDist.bottomEndId= `rhomboid${this.id}_bottomEnd` 
        },  
        endPointClick: function() {
            this.$emit("endPointClick" , this.endPoint)
        },          
    },
    computed: {  
        nodeStyleGet: function() {
            let style = `width:${this.size}px;height:${this.size}px;line-height:${this.size}px;`;

            if(this.styleList) {
                this.styleList.map(styleItem => {
                    style += `${styleItem.key}: ${styleItem.value};`
                })
            }

            return style
        },
        labelStyleGet: function() {
            let style = `height:fit-content;line-height:${this.size}px;`

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

.rhomboid{
    transform: skewX(-30deg);
    border: 2px solid #333;
}
.rhomboid span{
    display: inline-block;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.rhomboid:hover {
    cursor: pointer;
    border: 2px solid #ffb802;
    color: #ffb802;
}
</style>
