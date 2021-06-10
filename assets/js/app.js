(() => {
    //declaración de variables
    const d = document, w = window
    $btnModal = d.getElementById("btnModal"),
        $spanClose = d.getElementsByClassName("spanClose")[0],
        $spanCloseCart = d.getElementsByClassName("spanCloseCart")[0],
        $modal = d.getElementById("modal"),
        $modalCart = d.getElementById("modal-cart"),
        $btnModalShoppingCart = d.getElementById("btnShoppingCart"),
        $table = d.querySelector(".crud-table"),
        $form = d.querySelector(".crud-form"),
        $cartContent = d.getElementById("cartContent"),
        $title = d.querySelector(".crud-title"),
        $crudTitleCart = d.querySelector(".crud-title-cart"),
        $template = d.getElementById("crud-template").content,
        $fragment = d.createDocumentFragment(), //creación de fragmento
        $precioTotal = d.getElementById("total"),
        xhr = new XMLHttpRequest(); //variable que haga instancia de objeto xhtmlttprequest

    //método ajax
    const ajax = (options) => {
        let { url, method, success, error, data } = options //destructuracion de objetos
        const xhr = new XMLHttpRequest(); //instancia del objeto

        //programacion
        xhr.addEventListener("readystatechange", e => { //cuando detecte un cambio
            if (xhr.readyState !== 4) return;

            if (xhr.status >= 200 && xhr.status < 300) {
                let json = JSON.parse(xhr.responseText); //convertir en objeto javascript la respuesta en JSON
                success(json)
            } else {
                let message = xhr.statusText || "Ocurrió un error"
                error(`Error ${xhr.status}: ${message}`)
            }
        })

        //apertura
        xhr.open(method || "GET", url) //si el parámetro method viene vacio el usuario va a acceder a metodo get y vamos a abrir la variable URL
        //cabecera
        xhr.setRequestHeader("Content-type", "application/json;charset=utf-8")
        //envio petición
        xhr.send(JSON.stringify(data)) //data es  un código en formato JSON
    }
    //función para obtener los productos
    const getAllProducts = () => {
        ajax({
            //method: "GET",
            url: "http://localhost:5555/productos",
            success: (res) => {

                res.forEach(el => {
                    $template.querySelector(".name").textContent = el.nombre
                    $template.querySelector(".description").textContent = el.descripcion
                    $template.querySelector(".price").textContent = el.precio
                    $template.querySelector(".mark").textContent = el.marca
                    //estableciendo data atributes en el botón editar
                    $template.querySelector(".edit").dataset.id = el.id//el data atribute va a seleccionar el id  y se va a guardar en el botón
                    $template.querySelector(".edit").dataset.name = el.nombre
                    $template.querySelector(".edit").dataset.description = el.descripcion
                    $template.querySelector(".edit").dataset.price = el.precio
                    $template.querySelector(".edit").dataset.mark = el.marca
                    //estableciendo data atributes en el botón editar
                    $template.querySelector(".delete").dataset.id = el.id
                    $template.querySelector(".delete").dataset.name = el.nombre
                    $template.querySelector(".delete").dataset.description = el.descripcion
                    $template.querySelector(".delete").dataset.price = el.precio
                    $template.querySelector(".delete").dataset.mark = el.marca

                    //estableciendo data atributes en el botón editar
                    $template.querySelector(".addCart").dataset.id = el.id
                    $template.querySelector(".addCart").dataset.name = el.nombre
                    $template.querySelector(".addCart").dataset.description = el.descripcion
                    $template.querySelector(".addCart").dataset.price = el.precio
                    $template.querySelector(".addCart").dataset.mark = el.marca

                    let $clone = d.importNode($template, true) //clonamos la plantilla para que se guarde en memoria
                    $fragment.appendChild($clone)

                });

                $table.querySelector("tbody").appendChild($fragment) //agrega el fragmento de nodos clonados
            },
            error: (err) => {
                console.error(err)
                $table.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`)
            }
        })
    }

    //delegación de evento que va a cargar todo el contenido de los productos en la interfaz principal
    d.addEventListener("DOMContentLoaded", getAllProducts) //función que va a insertar en la tabla para que aparezcan en la nueva tabla creamos funcion y mandamos llamar

    d.addEventListener("submit", e => {
        if (e.target === $form) {
            e.preventDefault()

            if (!e.target.id.value) {
                //create post
                ajax({
                    url: "http://localhost:5555/productos",
                    method: "POST",
                    success: (res) => location.reload(), //en caso de ser exitosa la peticion
                    error: () => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                    data: {
                        nombre: e.target.producto.value,
                        descripcion: e.target.descripcion.value,
                        precio: e.target.precio.value,
                        marca: e.target.marca.value
                    }
                })
            } else {
                //update put
                ajax({
                    url: `http://localhost:5555/productos/${e.target.id.value}`,
                    method: "PUT",
                    success: (res) => location.reload(), //en caso de ser exitosa la peticion
                    error: () => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                    data: {
                        nombre: e.target.producto.value,
                        descripcion: e.target.descripcion.value,
                        precio: e.target.precio.value,
                        marca: e.target.marca.value
                    }
                })
            }
        }
    })

    //delegación de eventos para el evento on click
    d.addEventListener("click", e => {
        if (e.target.matches(".edit")) { /*Eventos del botón editar*/
            $title.textContent = "Editar Producto",
                $form.producto.value = e.target.dataset.name //acceder a input nombre y en el valor escribir lo que venga en data attribute
            $form.descripcion.value = e.target.dataset.description
            $form.precio.value = e.target.dataset.price
            $form.marca.value = e.target.dataset.mark
            $form.id.value = e.target.dataset.id
        }

        if (e.target.matches(".delete")) { /*eventos del botón eliminar */
            let isDelete = confirm(`¿Deseas eliminar el registro ${e.target.dataset.id} del producto: ${e.target.dataset.name}?`)
            if (isDelete) {
                $title.textContent = "Eliminar usuario"
                //delete
                ajax({
                    url: `http://localhost:5555/productos/${e.target.dataset.id}`,
                    method: "DELETE",
                    success: (res) => location.reload(), //en caso de ser exitosa la peticion va a recargarse
                    //error: () => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                    error: () => alert(err)
                })
            }
        }

        /*eventos del botón agregar al carrito de compra */
        if (e.target.matches(".addCart")) {
            let addCart = confirm(`¿Deseas agregar el producto  ${e.target.dataset.id}:  ${e.target.dataset.name} al carrito de compra?`),
                $contador = $cartContent.querySelectorAll("li").length + 1;

            $btnModalShoppingCart.innerHTML = `<i class="fas fa-shopping-cart"></i> ${$contador}`
            if (addCart) { /*añadiendo productos al carrito de compra */
                const $li = d.createElement("li"),
                    $ulPrecio = d.createElement("ul");


                $li.classList.add("li")
                $li.innerHTML = `Nombre del producto: ${e.target.dataset.name}`
                $ulPrecio.innerHTML = `${parseFloat(e.target.dataset.price)}`

                $cartContent.appendChild($li)
                $cartContent.appendChild($ulPrecio)

            }

            let precios = $cartContent.querySelectorAll("ul"),
                total = 0;

            for (let i = 0; i < precios.length; i++) {
                total = total + parseFloat(precios[i].textContent)
            }

            $precioTotal.innerHTML = ` Total a pagar: $${total}`


        }

        //delegación de eventos de la ventana modal
        if (e.target === $btnModal) {
            $modal.style.display = "block";
            $modal.parentElement.style.position = "static";
            $modal.parentElement.style.height = "100%";
            $modal.parentElement.style.overflow = "hidden";
        }

        if (e.target === $spanClose) {
            $modal.style.display = "none";
        }

        if (e.target === $spanCloseCart) {
            $modalCart.style.display = "none";
        }

        //delegación de eventos de la ventana modal que contiene el carrito de compras
        if (e.target === $btnModalShoppingCart) {
            $modalCart.style.display = "block";
            $modalCart.parentElement.style.position = "static";
            $modalCart.parentElement.style.height = "100%";
            $modalCart.parentElement.style.overflow = "hidden";
        }
    })

    //delegación de eventos de la ventana usando el evento click
    w.addEventListener("click", e => {
        if (e.target === $modal) {
            $modal.style.display = "none"
            $modal.parentElement.style.position = "inherit"
            $modal.parentElement.style.height = "auto"
            $modal.parentElement.style.position = "overflow"
        }
    })


})() //función anónima autoejecutable