const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {} //objeto

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    //si hay elementos en el carrito al actualizar que no se eliminen
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito')) 
        pintarCarrito()
    }
})
cards.addEventListener('click', e => { //detectar un elemento
    addCarrito(e)
})
items.addEventListener('click', e => {
    btnAccion(e) //aumentar o disminuir
})


const fetchData = async () => {
    try {
            const res = await fetch('api.json')
            const data = await res.json()
            // console .log(data)
            pintarCards(data)
    } catch (error) {
            console.log(error)
    }
}

const pintarCards = data => {
    // console.log(data)
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone) 
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    // console.log(e.target)
    // console.log(e.target.classList.contains('btn-dark'))
    if(e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement) //lleva todo el div de la tarjeta al objeto carrito
    }
    e.stopPropagation() //detener cualquier otro evento
}

const setCarrito = objeto => {
    // console.log(objeto)
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad +1 //cada vez que se presione el mismo elemento se aumente sin repetir
    }
    carrito[producto.id] = {...producto} //... adquiriendo la info y haciendo una copia de producto
    pintarCarrito()
}

const pintarCarrito = () => {
    // console.log(carrito)
    items.innerHTML = '' //vaciar los items
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title //all cuando queremos acceder al primero [0] o [1]
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone  = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()
    
    localStorage.setItem('carrito' , JSON.stringify(carrito)) //al actualizar la pag se guardará lo que esté en el carrito
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0) {  //cuando el carrito está vacío
        footer.innerHTML = ` 
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad ,0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio}) => acc + cantidad*precio,0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const btnAccion = e => {
    // console.log(e.target) // e captura la info target elemento que recibe del elemento
    //accion de aumentar
    if(e.target.classList.contains('btn-info')) {
        (carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')) {
        (carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}


