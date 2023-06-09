<template>
    <div class="nodeContainer" :class="nodeClass" :id="'elliptical_' + id" :style="{'z-index': zIndex}">        
        <div class="elliptical" :style="nodeStyleGet" @click="endPointClick">
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
    name: "Elliptical",
    props: {
        nodeClass: {type: String , default: ""}, 
        zIndex: {type: [String, Number] , default: "-9"},   
        id: {type: [String, Number] , default: "0"},   
        label: {type: String , default: "elliptical"}, 
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
                type: "elliptical",
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
            let len     = Math.sqrt(2)

            this.posDist.top        = `top:-4px;right:${width - 4}px;`
            this.posDist.right      = `top:${height - 4}px;right:-4px;`
            this.posDist.left       = `top:${height - 4}px;left:-4px;`
            this.posDist.bottom     = `bottom:-4px;left:${width - 4}px;`
            this.posDist.topEnd     = `top:${len}px;left:${len}px;`
            this.posDist.rightEnd   = `top:${len}px;right:${len}px;`
            this.posDist.bottomEnd  = `bottom:${len}px;right:${len}px;`
            this.posDist.leftEnd    = `bottom:${len}px;left:${len}px;`            


            this.posDist.leftId     = `elliptical${this.id}_left`
            this.posDist.rightId    = `elliptical${this.id}_right`
            this.posDist.topId      = `elliptical${this.id}_top`
            this.posDist.bottomId   = `elliptical${this.id}_bottom`  
            this.posDist.leftEndId  = `elliptical${this.id}_leftEnd`
            this.posDist.rightEndId = `elliptical${this.id}_rightEnd`
            this.posDist.topEndId   = `elliptical${this.id}_topEnd`
            this.posDist.bottomEndId= `elliptical${this.id}_bottomEnd`            
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

.elliptical{            
    border-radius: 50%;            
    border: 2px solid #333;
}
.elliptical:hover {
    cursor: pointer;
    border: 2px solid #ffb802;
    color: #ffb802;
}
</style>
