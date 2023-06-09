<template>
    <div class="nodeContainer" :class="nodeClass" :id="'lozenge_' + id" :style="{'z-index': zIndex}">        
        <div class="lozenge" :style="nodeStyleGet" @click="endPointClick">
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
    name: "Lozenge",
    props: {
        nodeClass: {type: String , default: ""}, 
        zIndex: {type: [String, Number] , default: "-9"},   
        id: {type: [String, Number] , default: "0"},   
        label: {type: String , default: "lozenge"},  
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
                type: "lozenge",
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
            let high    = (Math.sqrt(2) * Number(this.size) - Number(this.size)) / 2 + 4     
            let width   = Number(this.size) / 2
            let len     = Math.sqrt(2)

            this.posDist.top        = `top:${len}px;left:${len}px;`
            this.posDist.right      = `top:${len}px;right:${len}px;`
            this.posDist.bottom     = `bottom:${len}px;right:${len}px;`
            this.posDist.left       = `bottom:${len}px;left:${len}px;`            
            this.posDist.topEnd     = `top:-${high}px;right:${width - 4}px;`
            this.posDist.rightEnd   = `top:${width - 4}px;right:-${high}px;`
            this.posDist.bottomEnd  = `bottom:-${high}px;left:${width - 4}px;`
            this.posDist.leftEnd    = `top:${width - 4}px;left:-${high}px;`



            this.posDist.leftId     = `lozenge${this.id}_left`
            this.posDist.rightId    = `lozenge${this.id}_right`
            this.posDist.topId      = `lozenge${this.id}_top`
            this.posDist.bottomId   = `lozenge${this.id}_bottom`  
            this.posDist.leftEndId  = `lozenge${this.id}_leftEnd`
            this.posDist.rightEndId = `lozenge${this.id}_rightEnd`
            this.posDist.topEndId   = `lozenge${this.id}_topEnd`
            this.posDist.bottomEndId= `lozenge${this.id}_bottomEnd` 
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
            let style = `transform: rotate(-45deg);display: inline-block;height:fit-content;line-height:${this.size}px;`

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

.lozenge{
    transform: rotate(45deg);
    -ms-transform: rotate(45deg); 
    -moz-transform: rotate(45deg); 
    -webkit-transform: rotate(45deg);
    -o-transform: rotate(45deg); 
    border: 2px solid #333;
}
.lozenge:hover {
    cursor: pointer;
    border: 2px solid #ffb802;
    color: #ffb802;
}
</style>