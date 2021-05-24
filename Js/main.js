const altura = document.body.scrollHeight = window.innerHeight; /* se va acceder al tamaño completo de la pag y le vamos a restar el tamaño desde la barra de direccione a abajo de la ventana*/
const fondo = document.getElementById('fondo'); /*Vamos a obtener el fondo del id en el html */

window.onscroll = () => { /* para que muestre cuando scrolee  */
    const anchoFondo = (window.pageYOffset / altura) * 700;
    fondo.style.width = anchoFondo + '%';  /* calcular un porcentaje que va dependiendo conforme vamos bajando en la pag */
}