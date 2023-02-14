class MySpan extends HTMLElement{
    count
    IntervalId = 1000
    M = 1000
    constructor(){
        super()
        this.shadow = this.attachShadow({mode: "open"})
        this.count = this.getAttribute("count")
    }


    static get observedAttributes(){
        return ["count"]
    }
    attributeChangedCallback(prop, oldVal, newVal){
        if (prop == "count"){
            this.stop()
            this.count = newVal
            this.start()
        }
    }
    start() {
        this.render()
        this.IntervalId = window.setInterval(this.decrement.bind(this), this.M)
    }
    
    stop(){
        clearInterval(this.IntervalId)
    }

    decrement(){
        if (this.count > 0){
            if (this.count == 1){
                document.getElementById('counter').value = 0
            }
            this.count = this.count - 1
            this.render()
        }
        
    }
    connectedCallback(){
        this.render()
    }
    render(){
        this.shadow.innerHTML = `${this.count}`
    }
}
customElements.define("my-span", MySpan)