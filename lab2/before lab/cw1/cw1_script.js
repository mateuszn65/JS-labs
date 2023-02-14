window.prompt("Tekst1","Tekst2");

function wypisz(){
    let text_field = document.forms[0].elements['pole_tekstowe'].value
    let number_field = document.forms[0].elements['pole_liczbowe'].value
    window.alert(text_field + "\n" + number_field)
    console.log("type of text field: " + typeof(text_field))
    console.log("type of number field: " + typeof(number_field))
}