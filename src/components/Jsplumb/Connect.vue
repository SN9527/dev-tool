<template>
    <div class="nodeContainer">        
    	<div class="connect" :class="{selected: selected}" @click="endPointClick">&emsp;</div>
    </div>
</template>

<script>
export default {
    name: "Connect",
    props: {
        selected: {type: Boolean , default: false}, 
    },     
    data() {
        return {
            endPoint: {
                type: "connect",
                label: this.label,
                arrow: "right",
                connector: "Straight",
            }            
        }
    },
    methods: {
        endPointClick: function() {
            this.$emit("endPointClick" , this.endPoint)
        },      
    },
}   
</script>
<style scoped>
.nodeContainer {
    position: relative;
    line-height: 80px;
    z-index: 1;
}
.connect {
    height: 20px;
    border-bottom: 2px solid #333;
    line-height: 40px;
    width: 30px;
}
.selected {
    border-color: #ffb802;    
}
.connect:hover {
    cursor: pointer;
    border-color: #ffb802;
}
</style>