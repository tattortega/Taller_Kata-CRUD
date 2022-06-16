const url = "http://localhost:5555/";
const $table = document.querySelector("#crud-table");
const $form = document.querySelector("#crud-form");
const $tittle = document.querySelector("#crud-tittle");
const $column2 = document.querySelector("#column2");
const $column1 = document.querySelector("#column1");
const $input2 = document.querySelector("#input2");
const $search = document.querySelector("#crud-search");
const $list = document.querySelector("#crud-list");
const $article = document.getElementById("article");
const $template = document.getElementById("crud-template").content;
const $fragment = document.createDocumentFragment();
let sort = "asc";
let res;
let json;

//Funcion para asincrona para traer datos del API con axios y mostrarlos en pantalla
async function getData(opcion) {
    try {
        if (opcion === "santos") {
            res = await axios.get(`${url}santos`);
            $tittle.textContent = "Agregar Santo";
            $search.textContent = "Buscar Santo";
            $list.textContent = "Lista de Santos";
            $column2.textContent = "Constelacion";
            $input2.placeholder = "Constelacion"
            $article.id = "santos"
        } else {
            res = await axios.get(`${url}dioses`);
            $tittle.textContent = "Agregar Dios";
            $search.textContent = "Buscar Dios";
            $list.textContent = "Lista de Dioses";
            $column2.textContent = "Origen";
            $input2.placeholder = "Origen"
            $article.id = "dioses"
        }
        json = await res.data;
        remove()
        json.forEach(element => {
            $template.querySelector("#name").textContent = element.nombre;
            $template.querySelector("#row2").textContent = element.constelacion || element.origen;
            $template.querySelector("#edit").dataset.id = element.id;
            $template.querySelector("#edit").dataset.name = element.nombre;
            $template.querySelector("#edit").dataset.row2 = element.constelacion || element.origen;
            $template.querySelector("#delete").dataset.id = element.id;

            let $clone = document.importNode($template, true);
            $fragment.appendChild($clone);
        });
        $table.querySelector("tbody").appendChild($fragment);

    } catch (err) {
        let message = err.statusText || "Ocurrio un error";
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
}
document.addEventListener("load", getData(localStorage.getItem("opcion")));

//Funcion para buscar un dato
async function search() {
    try {
        const search = document.getElementById("inputSearch").value;
        if ($article.id == "dioses") {
            res = await axios(`${url}dioses?nombre=${search}`);
        } else {
            res = await axios(`${url}santos?nombre=${search}`);
        }
        json = await res.data;
        json.forEach(element => {
            $template.querySelector("#name").textContent = element.nombre;
            $template.querySelector("#row2").textContent = element.constelacion || element.origen;
            $template.querySelector("#edit").dataset.id = element.id;
            $template.querySelector("#edit").dataset.name = element.nombre;
            $template.querySelector("#edit").dataset.row2 = element.constelacion || element.origen;
            $template.querySelector("#delete").dataset.id = element.id;

            let $clone = document.importNode($template, true);
            $fragment.appendChild($clone);
        });
        remove();
        $table.querySelector("tbody").appendChild($fragment);
    } catch (err) {
        let message = err.statusText || "Ocurrio un error";
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
}

//Funcion para ordenar las columnas alfabeticamente
async function sortTable(column) {
    try {
        if ($article.id == "dioses") {
            if (column === "column1") {
                if (sort === "asc") {
                    res = await axios(`${url}dioses?_sort=nombre&_order=${sort}`);
                    sort = "desc";
                } else {
                    res = await axios(`${url}dioses?_sort=nombre&_order=${sort}`);
                    sort = "asc"
                }
            } else {
                if (sort === "asc") {
                    res = await axios(`${url}dioses?_sort=origen&_order=${sort}`);
                    sort = "desc";
                } else {
                    res = await axios(`${url}dioses?_sort=origen&_order=${sort}`);
                    sort = "asc"
                }
            }
        } else {
            if (column === "column1") {
                if (sort === "asc") {
                    res = await axios(`${url}santos?_sort=nombre&_order=${sort}`);
                    sort = "desc";
                } else {
                    res = await axios(`${url}santos?_sort=nombre&_order=${sort}`);
                    sort = "asc"
                }
            } else {
                if (sort === "asc") {
                    res = await axios(`${url}santos?_sort=constelacion&_order=${sort}`);
                    sort = "desc";
                } else {
                    res = await axios(`${url}santos?_sort=constelacion&_order=${sort}`);
                    sort = "asc"
                }
            }
        }
        json = res.data;
        json.forEach(element => {
            $template.querySelector("#name").textContent = element.nombre;
            $template.querySelector("#row2").textContent = element.constelacion || element.origen;
            $template.querySelector("#edit").dataset.id = element.id;
            $template.querySelector("#edit").dataset.name = element.nombre;
            $template.querySelector("#edit").dataset.row2 = element.constelacion || element.origen;
            $template.querySelector("#delete").dataset.id = element.id;

            let $clone = document.importNode($template, true);
            $fragment.appendChild($clone);
        });
        remove();
        $table.querySelector("tbody").appendChild($fragment);
    } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
}


//Evento que escucha el boton enviar del formulario e invoca el metodo POST o PUT mediante axios
document.addEventListener("submit", async e => {
    if (e.target == $form) {
        e.preventDefault();
    }
    let options = {
        method: "",
        headers: {
            "Content-type": "application/json;charset=utf-8"
        },
        data: JSON.stringify({
        })
    }
    if (!e.target.id.value) {
        try {
            if ($article.id == "dioses") {
                options.method = "POST"
                options.data = JSON.stringify({
                    nombre: e.target.nombre.value,
                    origen: e.target.input2.value
                })
                res = await axios(`${url}dioses`, options)
                json = await res.data;
                location.reload();
                localStorage.setItem("opcion", "dioses")
            } else {
                options.method = "POST"
                options.data = JSON.stringify({
                    nombre: e.target.nombre.value,
                    constelacion: e.target.input2.value
                })
                res = await axios(`${url}santos`, options)
                localStorage.setItem("opcion", "santos")
            }
        } catch (error) {
            let message = err.statusText || "Ocurrio un error";
            $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
        }
    } else {
        try {
            if ($article.id == "dioses") {
                options.method = "PUT"
                options.data = JSON.stringify({
                    nombre: e.target.nombre.value,
                    origen: e.target.input2.value
                })
                res = await axios(`${url}dioses/${e.target.id.value}`, options);
            } else {
                options.method = "PUT"
                options.data = JSON.stringify({
                    nombre: e.target.nombre.value,
                    constelacion: e.target.input2.value
                })
                res = await axios(`${url}santos/${e.target.id.value}`, options)
            }
        } catch (error) {
            let message = err.statusText || "Ocurrio un error";
            $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
        }
    }
});

//Escucha el evento click para editar o eliminar un campo
document.addEventListener("click", async e => {
    if (e.target.matches("#edit")) {
        if ($article.id == "dioses") {
            $tittle.textContent = "Editar Dios";
        } else {
            $tittle.textContent = "Editar Santo";
        }
        $article.focus();
        $article.scrollIntoView();
        $form.nombre.value = e.target.dataset.name;
        $form.input2.value = e.target.dataset.row2;
        $form.id.value = e.target.dataset.id;
    }
    if (e.target.matches("#delete")) {
        alertify.confirm("¿Estas seguro de eliminar?",
            async function () {
                try {
                    let options = {
                        method: "DELETE",
                        headers: {
                            "Content-type": "application/json;charset=utf-8"
                        }
                    }
                    if ($article.id == "dioses") {
                        res = await axios(`${url}dioses/${e.target.dataset.id}`, options)
                    } else {
                        res = await axios(`${url}santos/${e.target.dataset.id}`, options)
                    }
                    alertify.success("Ok")
                } catch (err) {
                    let message = err.statusText || "Ocurrio un error";
                    alert(`Error ${err.satus}:${message}`)
                }
            }, function () {
                alertify.error("Cancelado")
            }
        )
    }
})

//Funcion para remover elementos del DOM
function remove() {
    const children = document.querySelectorAll('#tbody > *');
    for (let c of children) {
        c.remove();
    }
}