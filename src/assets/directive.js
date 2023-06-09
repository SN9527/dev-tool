import Vue from "vue"

const title = Vue.directive("title" , {
    inserted: function(el, binding) {
        document.title = el.dataset.title
    }
})


const select = Vue.directive("select", {
    inserted: function (el, binding) {
        el.addEventListener("click", (event) => {
            event.target ? event.target.select() : el.select()
        })
    }
});

export { 
    title,
    select
}