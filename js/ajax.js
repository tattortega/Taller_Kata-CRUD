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

//Funcion para crear el objeto XMLHttpRequest y configurarlo
const ajax = (options) => {
    let { url, method, success, error, data } = options;
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", e => {
        if (xhr.readyState !== 4) return;
        if (xhr.status >= 200 && xhr.status < 300) {
            let json = JSON.parse(xhr.responseText);
            success(json);
        } else {
            let message = xhr.statusText || "Ocurrio un error";
            error(`Error ${xhr.status}: ${message}`);
        }
    });
    xhr.open(method || "GET", url);
    xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
    xhr.send(JSON.stringify(data));
}

// Funcion para obtener los datos del API
function getData(opcion) {
    if (opcion === "santos") {
        $tittle.textContent = "Agregar Santo";
        $search.textContent = "Buscar Santo";
        $list.textContent = "Lista de Santos";
        $column2.textContent = "Constelacion";
        $input2.placeholder = "Constelacion"
        $article.id = "santos"

    } else {
        $tittle.textContent = "Agregar Dios";
        $search.textContent = "Buscar Dios";
        $list.textContent = "Lista de Dioses";
        $column2.textContent = "Origen";
        $input2.placeholder = "Origen"
        $article.id = "dioses";
    }
    remove()
    ajax({
        method: "GET",
        url: `${url}${$article.id}`,
        success: (res) => {
            res.forEach(element => {
                $template.querySelector("#name").textContent = element.nombre;
                $template.querySelector("#row2").textContent = element.origen || element.constelacion;
                $template.querySelector("#edit").dataset.id = element.id;
                $template.querySelector("#edit").dataset.name = element.nombre;
                $template.querySelector("#edit").dataset.row2 = element.origen || element.constelacion;
                $template.querySelector("#delete").dataset.id = element.id;

                let $clone = document.importNode($template, true);
                $fragment.appendChild($clone);
            });
            $table.querySelector("tbody").appendChild($fragment);
        },
        error: (err) => {
            console.error(err);
            $table.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`)
        },
        data: null
    })
}
document.addEventListener("load", getData(localStorage.getItem("opcion")));

//Funcion para buscar un dato
function search() {
    try {
        const search = document.getElementById("inputSearch").value;
        let urlDiosesSearch;
        let urlSantosSearch;
        if ($article.id == "dioses") {
            urlDiosesSearch = `${url}dioses?nombre=${search}`;
        } else {
            urlSantosSearch = `${url}santos?nombre=${search}`;
        }

        ajax({
            method: "GET",
            url: urlDiosesSearch || urlSantosSearch,
            success: (res) => {
                res.forEach(element => {
                    $template.querySelector("#name").textContent = element.nombre;
                    $template.querySelector("#row2").textContent = element.origen || element.constelacion;
                    $template.querySelector("#edit").dataset.id = element.id;
                    $template.querySelector("#edit").dataset.name = element.nombre;
                    $template.querySelector("#edit").dataset.row2 = element.origen || element.constelacion;
                    $template.querySelector("#delete").dataset.id = element.id;

                    let $clone = document.importNode($template, true);
                    $fragment.appendChild($clone);
                });
                remove()
                $table.querySelector("tbody").appendChild($fragment);
            },
            error: (err) => {
                console.error(err);
                $table.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`)
            },
            data: null
        })
    } catch (err) {
        let message = err.statusText || "Ocurrio un error";
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
}

//Funcion para ordenar las columnas alfabeticamente
function sortTable(column) {
    try {
        let urlSort;
        if ($article.id == "dioses") {
            if (column === "column1") {
                if (sort === "asc") {
                    urlSort = `${url}dioses?_sort=nombre&_order=${sort}`;
                    sort = "desc";
                } else {
                    urlSort = `${url}dioses?_sort=nombre&_order=${sort}`;
                    sort = "asc"
                }
            } else {
                if (sort === "asc") {
                    urlSort = `${url}dioses?_sort=origen&_order=${sort}`;
                    sort = "desc";
                } else {
                    urlSort = `${url}dioses?_sort=origen&_order=${sort}`;
                    sort = "asc"
                }
            }
        } else {
            if (column === "column1") {
                if (sort === "asc") {
                    urlSort = `${url}santos?_sort=nombre&_order=${sort}`;
                    sort = "desc";
                } else {
                    urlSort = `${url}santos?_sort=nombre&_order=${sort}`;
                    sort = "asc"
                }
            } else {
                if (sort === "asc") {
                    urlSort = `${url}santos?_sort=constelacion&_order=${sort}`;
                    sort = "desc";
                } else {
                    urlSort = `${url}santos?_sort=constelacion&_order=${sort}`;
                    sort = "asc"
                }
            }
        }
        ajax({
            method: "GET",
            url: urlSort,
            success: (res) => {
                res.forEach(element => {
                    $template.querySelector("#name").textContent = element.nombre;
                    $template.querySelector("#row2").textContent = element.origen || element.constelacion;
                    $template.querySelector("#edit").dataset.id = element.id;
                    $template.querySelector("#edit").dataset.name = element.nombre;
                    $template.querySelector("#edit").dataset.row2 = element.origen || element.constelacion;
                    $template.querySelector("#delete").dataset.id = element.id;

                    let $clone = document.importNode($template, true);
                    $fragment.appendChild($clone);
                });
                remove()
                $table.querySelector("tbody").appendChild($fragment);
            },
            error: (err) => {
                console.error(err);
                $table.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`)
            },
            data: null
        })
    } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $fetch.innerHTML = `Error ${err.status}: ${message}`;
    }
}

//Evento que escucha el boton enviar del formulario e invoca el metodo POST o PUT 
document.addEventListener("submit", e => {
    if (e.target === $form) {
        e.preventDefault();
        if (!e.target.id.value) {
            if ($article.id == "dioses") {
                ajax({
                    url: `${url}dioses`,
                    method: "POST",
                    success: (res) => location.reload(),
                    error: () => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                    data: {
                        nombre: e.target.nombre.value,
                        origen: e.target.input2.value
                    }
                })
                localStorage.setItem("opcion", "dioses")
            } else {
                ajax({
                    url: `${url}santos`,
                    method: "POST",
                    success: (res) => location.reload(),
                    error: () => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                    data: {
                        nombre: e.target.nombre.value,
                        constelacion: e.target.input2.value
                    }
                })
                localStorage.setItem("opcion", "santos")
            }
        } else {
            if ($article.id == "dioses") {
                ajax({
                    url: `${url}dioses/${e.target.id.value}`,
                    method: "PUT",
                    success: (res) => location.reload(),
                    error: () => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                    data: {
                        nombre: e.target.nombre.value,
                        origen: e.target.input2.value
                    }
                })
                localStorage.setItem("opcion", "dioses")
            } else {
                console.log("first")
                ajax({
                    url: `${url}santos/${e.target.id.value}`,
                    method: "PUT",
                    success: (res) => location.reload(),
                    error: () => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                    data: {
                        nombre: e.target.nombre.value,
                        constelacion: e.target.input2.value
                    }
                })
                localStorage.setItem("opcion", "santos")
            }
        }
    }
});

//Evento que escucha el evento click para editar o eliminar un campo
document.addEventListener("click", e => {
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
                    ajax({
                        url: `${url}${$article.id}/${e.target.dataset.id}`,
                        method: "DELETE",
                        success: (res) => location.reload(),
                        error: () => alert(err)
                    })
                    alertify.success("Ok")
                } catch (err) {
                    let message = err.statusText || "Ocurrio un error";
                    alert(`Error ${err.satus}:${message}`)
                }
            }, function () {
                alertify.error("Cancelado")
            })

    }
})

//Funcion para remover elementos del DOM
function remove() {
    const children = document.querySelectorAll('#tbody > *');
    for (let c of children) {
        c.remove();
    }
}