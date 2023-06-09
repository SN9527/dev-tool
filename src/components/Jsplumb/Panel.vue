<template>
    <div id="panelContainer">
        <template v-if="initFinish">
            <template v-for="endPoint in umlDist.endPoint">
                <Lozenge v-if="endPoint.type == 'lozenge'" 
                    :title="endPoint.x + ' , ' + endPoint.y"
                    nodeClass="jspNode" 
                    :zIndex="endPoint.zIndex" 
                    :id="endPoint.id" 
                    :label="endPoint.label" 
                    :size="endPoint.size" 
                    :styleList="endPoint.styleList" 
                    :style="endPointPos(endPoint.x , endPoint.y)"
                    @endPointClick="endPointClick(endPoint)"
                />

                <Rectangle v-else-if="endPoint.type == 'rectangle'" 
                    :title="endPoint.x + ' , ' + endPoint.y"
                    nodeClass="jspNode" 
                    :zIndex="endPoint.zIndex" 
                    :id="endPoint.id" 
                    :label="endPoint.label" 
                    :width="endPoint.width" 
                    :height="endPoint.height" 
                    :styleList="endPoint.styleList" 
                    :style="endPointPos(endPoint.x , endPoint.y)"
                    @endPointClick="endPointClick(endPoint)"
                /> 

                <Rhomboid v-else-if="endPoint.type == 'rhomboid'" 
                    :title="endPoint.x + ' , ' + endPoint.y"
                    nodeClass="jspNode" 
                    :zIndex="endPoint.zIndex" 
                    :id="endPoint.id" 
                    :label="endPoint.label" 
                    :size="endPoint.size" 
                    :styleList="endPoint.styleList" 
                    :style="endPointPos(endPoint.x , endPoint.y)"
                    @endPointClick="endPointClick(endPoint)"
                />   

                <Elliptical v-else-if="endPoint.type == 'elliptical'" 
                    :title="endPoint.x + ' , ' + endPoint.y"
                    nodeClass="jspNode" 
                    :zIndex="endPoint.zIndex" 
                    :id="endPoint.id" 
                    :label="endPoint.label" 
                    :width="endPoint.width" 
                    :height="endPoint.height" 
                    :styleList="endPoint.styleList" 
                    :style="endPointPos(endPoint.x , endPoint.y)"
                    @endPointClick="endPointClick(endPoint)"
                />                                    
            </template>
        </template>
    </div>
</template>

<script>
import { jsPlumb } from "jsplumb"
export default {
    name: "Panel",
    components: {
        Rectangle       :()=> import("./Rectangle"), 
        Lozenge         :()=> import("./Lozenge"), 
        Rhomboid        :()=> import("./Rhomboid"), 
        Elliptical      :()=> import("./Elliptical"), 
    },
    props: {
        umlDist: {},
    },
    data() {
        return {
            initFinish: false,
            instance: null,
            jsPlumbConfig: {
                Endpoints: [ 
                    ["Blank", {}], 
                    ["Blank", {}] 
                ]
            },
        }
    },  
    mounted() {
        this.$nextTick().then(() => {
            this.init()
        })    
    },   
    methods: {
        endPointPos: function(left , top) {
            return `position:absolute;top:${top}px;left:${left}px;`
        }, 
        init: function() {
            console.log("init:")

            this.initFinish = false
            this.instance = jsPlumb.getInstance()
            this.initConfig()  
            this.initFinish = true

            this.drawing()
        },
        refresh: function() {
            console.log("refresh:")            
            this.instance.deleteEveryEndpoint()
            this.instance.deleteEveryConnection()
            this.drawing()
        },
        drawing: function() {
            console.log("drawing:")            

            let that = this   
            this.instance.ready(function() {         
                setTimeout(() => {
                    that.initConnect()  
                    that.initEvent()  
                    that.initEndPoint()  
                }, 500);
            })             
        },        
              
        initConfig: function() {
            console.log("initConfig:")
            
            this.instance.importDefaults(this.jsPlumbConfig)
            this.instance.setContainer("panelContainer")  
        },
        initEvent: function() {
            console.log("initEvent:")
            let that = this

            this.instance.draggable(document.getElementsByClassName("jspNode"), {
                containment: "panelContainer" , grid: [10, 10], stop:function(event) {
                let idArr = event.el.id.split("_")
                let endPoint = that.umlDist.endPoint[Number(idArr[1]) - 1]

                if(endPoint.x != event.pos[0] || endPoint.y != event.pos[1]) {
                    console.log("drag endPoint:" , endPoint)

                    endPoint.x = event.pos[0]
                    endPoint.y = event.pos[1]

                    that.$emit("endPointDrag" , endPoint)
                }
            }})

            this.instance.bind("click" , (connect , event) => {
                console.log("connect click:")
                console.log("connect:" , connect)
                console.log("event:" , event)

                that.umlDist.connect.map(connectItem => {
                    if(connectItem.source == connect.sourceId && connectItem.target == connect.targetId) {                        
                        this.$emit("endPointClick" , connectItem)
                    }
                })
            })
        }, 
        
        initEndPoint: function() {
            console.log("initEndPoint:")

            if(this.umlDist.endPoint) {
                this.umlDist.endPoint.map(endPoint => {
                    if(endPoint.id) {
                        endPoint.index = `${endPoint.type}_${endPoint.id}`
                        
                        if(!endPoint.zIndex) {                            
                            endPoint.zIndex = Number(endPoint.parentId) > 0 ? this.umlDist.endPoint[Number(endPoint.parentId) - 1].zIndex + 1 : -9
                        }

                        this.endPointAdd(endPoint)
                    }
                })
            }
        },
        initConnect: function() {
            console.log("initConnect:")

            if(this.umlDist.connect) {
                this.umlDist.connect.map(connect => {
                    connect.source = `${connect.sourceId}_${connect.sourcePos}`  
                    connect.target = `${connect.targetId}_${connect.targetPos}`  
                    connect.index = `${connect.source}_${connect.target}`  

                    this.connectAdd(connect)
                })
            }
        },

        endPointClick: function(endPoint) {
            console.log("endPointClick:" , endPoint)

            this.$emit("endPointClick" , endPoint)
        },
        endPointAdd: function(endPoint) {
            console.log("endPointAdd:" , endPoint)

            if(Number(endPoint.parentId) > 0) {
                endPoint.group = `${this.umlDist.endPoint[Number(endPoint.parentId) - 1].type}_${endPoint.parentId}`
            }

            this.instance.addToPosse(endPoint.index , endPoint.group || endPoint.index)
        },        
        connectAdd: function(connect) {
            console.log("connect:" , connect)

            var overlays = [ 
                ["Label" , {label: connect.label , cssClass: connect.index , labelStyle: {color: connect.labelColor || "#333",fill: connect.labelFill || ""} }] 
            ]

            if(connect.arrow == "left") {
                overlays.push(["Arrow", { width: 12, length: 12, location: 0 , foldback: 0.1 ,  direction: -1}])
            }
            else if(connect.arrow == "right") {
                overlays.push(["Arrow", { width: 12, length: 12, location: 1 , foldback: 0.1 ,  direction: 1}])                
            }
            else if(connect.arrow == "both") {
                overlays.push(["Arrow", { width: 12, length: 12, location: 0 , foldback: 0.1 ,  direction: -1}])
                overlays.push(["Arrow", { width: 12, length: 12, location: 1 , foldback: 0.1 ,  direction: 1}])
            }

            try {
                // this.instance.addEndpoint(connect.source, {anchor: "Center"} , { fill: "", endpoint: "Dot",paintStyle: { strokeWidth: 0.5}})
                // this.instance.addEndpoint(connect.target, {anchor: "Center"} , { fill: "", endpoint: "Dot",paintStyle: { strokeWidth: 0.5}})

                this.instance.connect({
                    source: connect.source,
                    target: connect.target,
                    anchor: ["Center", "Center"], //锚点位置
                    connector: [connect.connector || "Straight"], //Bezier Flowchart StateMachine Straight
                    overlays: overlays, 
                    paintStyle: { stroke: connect.labelColor || "#333", strokeWidth: 2},
                    hoverPaintStyle : { stroke: "#ffb802", strokeWidth: 2},
                    cssClass : "connectLine",
                })


                if(connect.dash) {
                    setTimeout(() => {
                        let path = document.getElementsByClassName(connect.index)[0].previousElementSibling.firstChild 
                        path.setAttribute("stroke-dasharray" , connect.dash)
                    }, 100)                                                  
                }
            } catch(err) {
                console.log("err:" , err)
            }
        },                       
    }
}
</script>

<style scoped>
#panelContainer {
    height: calc(100vh - 100px);
    overflow-y: auto;    
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;     
    color: #333;
    font-size: 12px;  
    background-image: linear-gradient(90deg,#f0f0f0 10%,rgba(0, 0, 0, 0) 10%),linear-gradient(#f0f0f0 10%, rgba(0, 0, 0, 0) 10%);
    background-size: 10px 10px;  
    position: relative;
    z-index: -10;     
}
</style>