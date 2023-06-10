<template>
    <div id="app">
        <Layout />  
    </div>
</template>

<script>
export default {
    name: "App",
    components: {
        Layout :()=> import("./components/Layout"), 
    },
    data() {
        return {

        }
    }
}
</script>

<style>
body {
    position: relative;z-index: -14;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #333;
    position: relative;z-index: -13;
}
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar:horizontal {
  height: 0.4em;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: white;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: #ddd;
}
p {
    margin: 0;
    padding: 0;
}
.flex , .lr{
    align-items: center;
    display: flex;
}
.lr {
    justify-content: space-between;    
}
.CodeMirror {
    font-family: Consolas, "Courier New", monospace;
    font-weight: blod;
    font-size: 22px;
    text-align: left;
}
.katex-html {
    display: none;
}
</style>
