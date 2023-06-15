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
            connectDash: [],


            clickInfo: {
                type: "",
                id: "",                
            }
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

            var connectLines = document.getElementsByClassName("connectLine")
            for (var i = connectLines.length - 1; i >= 0; i--) {
                connectLines[i].addEventListener("mouseenter" , event => {
                    event.preventDefault()
                    let childs = event.target.children
                    for (var i = 0; i < childs.length; i++) { 
                        !childs[i].getAttribute("data-stroke") && childs[i].setAttribute("data-stroke" , childs[i].getAttribute("stroke"))
                        childs[i].setAttribute("stroke" , "#ffb802")
                    }                    
                })
                connectLines[i].addEventListener("mouseout" , event => {
                    event.preventDefault()

                    console.log("mouseout" , event.target)
                    if(event.target.getAttribute("data-select") != 1) {
                        let svgElement = event.target.farthestViewportElement
                        let childs = svgElement.children
                        for (var i = 0; i < childs.length; i++) {                    
                            childs[i].setAttribute("stroke" , childs[i].getAttribute("data-stroke"))
                        }                    
                    }
                })                
                connectLines[i].addEventListener("click" , event => {
                    event.preventDefault()
                    console.log("click" , event)
                    event.target.farthestViewportElement.getAttribute("class").split(" ").map(item => {
                        if(item.indexOf("_") != -1) {
                            that.umlDist.connect.map(connectItem => {
                                if(connectItem.index == item) {                        
                                    that.endPointClick(connectItem)                        
                                }
                            })                            
                        }
                    })
                })
            }            
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
                this.connectDash = []
                this.umlDist.connect.map(connect => {
                    connect.source = `${connect.sourceId}_${connect.sourcePos}`  
                    connect.target = `${connect.targetId}_${connect.targetPos}`  
                    connect.index = `${connect.source}_${connect.target}`  

                    this.connectAdd(connect)
                })

                this.connectDash.length > 0 && this.connectDashExec()
            }
        },

        endPointClick: function(endPoint) {
            console.log("endPointClick:" , endPoint)

            if(endPoint.id || endPoint.index) this.selectedExec(endPoint)

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
                overlays.push(["Arrow", { width: 10, length: 10, location: 0 , foldback: 0.1 ,  direction: -1}])
            }
            else if(connect.arrow == "right") {
                overlays.push(["Arrow", { width: 10, length: 10, location: 1 , foldback: 0.1 ,  direction: 1}])                
            }
            else if(connect.arrow == "both") {
                overlays.push(["Arrow", { width: 10, length: 10, location: 0 , foldback: 0.1 ,  direction: -1}])
                overlays.push(["Arrow", { width: 10, length: 10, location: 1 , foldback: 0.1 ,  direction: 1}])
            }

            try {
                this.instance.connect({
                    source: connect.source,
                    target: connect.target,
                    anchor: ["Center", "Center"], //锚点位置
                    connector: [connect.connector || "Straight"], //Bezier Flowchart StateMachine Straight
                    overlays: overlays, 
                    paintStyle: { stroke: connect.labelColor || "#333", strokeWidth: 2},
                    cssClass : `connectLine ${connect.index}`,
                })


                if(connect.dash) {
                    this.connectDash.push({
                        class: connect.index,
                        dash: connect.dash
                    })                                                 
                }
            } catch(err) {
                console.log("err:" , err)
            }
        },  

        connectDashExec: function() {
            console.log("connectDashExec:" , this.connectDash)

            setTimeout(() => {
                this.connectDash.map(item => {
                    let path = document.getElementsByClassName(item.class)[0].previousElementSibling.firstChild 
                    path.setAttribute("stroke-dasharray" , item.dash)
                })
            }, 500)             
        },


        selectedExec: function(endPoint) {
            console.log("selectedExec:" , endPoint) 

            if(this.clickInfo.type == "connect") {
                let childs = document.getElementsByClassName(this.clickInfo.id)[0].children

                for (var i = 0; i < childs.length; i++) {  
                    console.log("unselectedExec child" , childs[i])
                    if(childs[i].getAttribute("data-select") == 1) {
                        childs[i].setAttribute("stroke" , childs[i].getAttribute("data-stroke"))
                        childs[i].setAttribute("data-select" , "")
                    }                  
                }
            }
            else if(this.clickInfo.id) {
                let node = document.getElementById(this.clickInfo.id).firstChild
                node.setAttribute("class" , node.getAttribute("class").replace("endpointSelected" , ""))
            }            

            this.clickInfo.id = endPoint.index || `${endPoint.type}_${endPoint.id}`
            this.clickInfo.type = endPoint.type            

            if(this.clickInfo.type == "connect") {
                let childs = document.getElementsByClassName(this.clickInfo.id)[0].children

                for (var i = 0; i < childs.length; i++) {                    
                    console.log("selectedExec child" , childs[i])
                    !childs[i].getAttribute("data-stroke") && childs[i].setAttribute("data-stroke" , childs[i].getAttribute("stroke"))

                    childs[i].setAttribute("data-select" , 1)
                    childs[i].setAttribute("stroke" , "#ffb802")
                }
            }
            else if(this.clickInfo.id) {
                let node = document.getElementById(this.clickInfo.id).firstChild
                node.setAttribute("class" , node.getAttribute("class") + " endpointSelected")
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