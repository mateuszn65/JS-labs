const header = document.getElementsByTagName('header')[0]
const nav = document.getElementsByTagName('nav')[0]
const aside = document.getElementsByTagName('aside')[0]
const main = document.getElementsByTagName('main')[0]
const footer = document.getElementsByTagName('footer')[0]
const blockquote = document.getElementsByTagName('blockquote')[0]
const anim = document.getElementById('animation')
function ustaw(){
    header.classList.add("azure", "header")
    nav.classList.add("azure", "nav")
    aside.classList.add("azure", "aside")
    main.classList.add("azure", "main")
    footer.classList.add("azure", "footer")
    anim.classList.add("animation")
    blockquote.classList.add("blockquote")
}

function skasuj(){
    header.classList.remove("azure", "header")
    nav.classList.remove("azure", "nav")
    aside.classList.remove("azure", "aside")
    main.classList.remove("azure", "main")
    footer.classList.remove("azure", "footer")
    anim.classList.remove("animation")
    blockquote.classList.remove("blockquote")
}