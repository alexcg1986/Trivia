let spanScore = document.getElementById("score");
let cambiarJugador = document.getElementById("cambiarJugador");
let email = document.getElementById("email");
let password = document.getElementById("password");
let divDerechaPlay = document.getElementById("divDerechaPlay");
let divContenedorTarjeta = document.getElementById("divContenedorTarjeta");
let contenedorCategoria = document.getElementById("contenedorCategoria");
let botonNext = document.getElementById("next");
let boton1 = document.createElement("button");
let boton2 = document.createElement("button");
let boton3 = document.createElement("button");
let boton4 = document.createElement("button");
let submitJoin = document.getElementById("submitJoin");
let divJuego = document.getElementById("mostrarJuego");
let divJoin = document.getElementById("mostrarJoin");
let incorrectPassword = document.createElement("p");
let arrayLocalStorage = [];
let token;
let arrayRespuestas = [];
let dificultad;
let tipo;
let usuario = {};
let score = 0;
let url;
let id;
let i;
let elem;
let width;

// localStorage.clear();


boton1.addEventListener("click", function () {
    comprobarRespuesta(boton1);
})
boton2.addEventListener("click", function () {
    comprobarRespuesta(boton2);
})
boton3.addEventListener("click", function () {
    comprobarRespuesta(boton3);
})
boton4.addEventListener("click", function () {
    comprobarRespuesta(boton4);
})

if (cambiarJugador !== null) {
    cambiarJugador.addEventListener("click", function () {
        divJoin.classList.remove('d-none');
        divJuego.classList.add('d-none');
    })
}

if (submitJoin !== null) {
    submitJoin.addEventListener("click", function () {
        cambiarUsuario();
        cargarEjemplo();
    })
}

if (divContenedorTarjeta !== null && submitJoin === null) {
    divContenedorTarjeta.addEventListener("load", cargarEjemplo());
}

if (contenedorCategoria !== null) {
    contenedorCategoria.addEventListener("load", rellenarCategorias());
    contenedorCategoria.addEventListener("change", function () {
        let id = event.target.value;
        url = `https://opentdb.com/api.php?amount=1&category=${id}&token=${usuario.token}`;
        fetch(url).then(recibirDatos).then(mostrarDatos);
    })
}

if (botonNext !== null) {
    botonNext.addEventListener("click", function () {
        fetch(url).then(recibirDatos).then(mostrarDatos);
    })
}

function recibirDatos(datos) {
    clearInterval(id);
    i = 0;
    return datos.json();
}

function mostrarDatos(datos) {
    divContenedorTarjeta.innerHTML = "";
    switch (datos.response_code) {
        case 0:
            let divColorDificultad = document.createElement("div");
            let divCategoria = document.createElement("div");
            let divPregunta = document.createElement("div");
            let divProgressBar = document.createElement("div");
            let divContenedorBotones = document.createElement("div");
            let divFilaUno = document.createElement("div");
            let divFilaDos = document.createElement("div");
            let indice = Math.floor(Math.random() * 4);
            dificultad = datos.results[0].difficulty;
            tipo = datos.results[0].type;

            if (tipo === "boolean") {
                arrayRespuestas = [datos.results[0].correct_answer, datos.results[0].incorrect_answers[0]];
            } else {
                arrayRespuestas = [datos.results[0].correct_answer, datos.results[0].incorrect_answers[0], datos.results[0].incorrect_answers[1], datos.results[0].incorrect_answers[2]];
            }

            divColorDificultad.innerHTML = `<p class="text-uppercase text-center shadow p-3 mb-4 rounded border border-dark">${datos.results[0].difficulty}</p>`;
            divContenedorTarjeta.appendChild(divColorDificultad);

            if (dificultad === "easy") {
                divColorDificultad.setAttribute("class", "colorFacil rounded");
            } else if (dificultad === "medium") {
                divColorDificultad.setAttribute("class", "colorMedium rounded");
            } else {
                divColorDificultad.setAttribute("class", "colorHard rounded");
            }

            divCategoria.innerHTML = `<p class="text-center">${datos.results[0].category}</p>`
            divContenedorTarjeta.appendChild(divCategoria);

            divPregunta.innerHTML = `<p class="text-center pt-2 pb-2">${datos.results[0].question}</p>`
            divContenedorTarjeta.appendChild(divPregunta);

            //progress bar
            divProgressBar.setAttribute("class", "myProgress border border-dark mb-3")
            divProgressBar.innerHTML = `<div class="myBar rounded"></div>`;
            divContenedorTarjeta.appendChild(divProgressBar);

            divContenedorTarjeta.appendChild(divContenedorBotones);

            if (tipo === "multiple") {
                // fila 1 de botones
                divFilaUno.setAttribute("class", "d-flex flex-row justify-content-between align-items-center pb-1");
                divContenedorBotones.appendChild(divFilaUno);

                boton1.setAttribute("class", "btn btn-outline-dark col-5");
                boton1.setAttribute("type", "button");
                boton1.innerHTML = arrayRespuestas[indice];
                if (indice === 3) {
                    indice = 0;
                } else {
                    indice++;
                }
                divFilaUno.appendChild(boton1);

                boton2.setAttribute("class", "btn btn-outline-dark col-5");
                boton2.setAttribute("type", "button");
                boton2.innerHTML = arrayRespuestas[indice];
                if (indice === 3) {
                    indice = 0;
                } else {
                    indice++;
                }
                divFilaUno.appendChild(boton2);

                // fila 2 de botones
                divFilaDos.setAttribute("class", "d-flex flex-row justify-content-between align-items-center");
                divContenedorBotones.appendChild(divFilaDos);

                boton3.setAttribute("class", "btn btn-outline-dark col-5");
                boton3.setAttribute("type", "button");
                boton3.innerHTML = arrayRespuestas[indice];
                if (indice === 3) {
                    indice = 0;
                } else {
                    indice++;
                }
                divFilaDos.appendChild(boton3);

                boton4.setAttribute("class", "btn btn-outline-dark col-5");
                boton4.setAttribute("type", "button");
                boton4.innerHTML = arrayRespuestas[indice];
                divFilaDos.appendChild(boton4);
                barraProgreso();

                boton1.removeAttribute("aria-disabled", "true");
                boton1.removeAttribute("disabled", "true");
                boton2.removeAttribute("aria-disabled", "true");
                boton2.removeAttribute("disabled", "true");
                boton3.removeAttribute("aria-disabled", "true");
                boton3.removeAttribute("disabled", "true");
                boton4.removeAttribute("aria-disabled", "true");
                boton4.removeAttribute("disabled", "true");
            } else {
                divFilaUno.setAttribute("class", "d-flex flex-row justify-content-between align-items-center pb-1");
                divContenedorBotones.appendChild(divFilaUno);

                boton1.setAttribute("class", "btn btn-outline-dark col-5");
                boton1.setAttribute("type", "button");
                boton1.innerHTML = "True";
                divFilaUno.appendChild(boton1);

                boton2.setAttribute("class", "btn btn-outline-dark col-5");
                boton2.setAttribute("type", "button");
                boton2.innerHTML = "False";
                divFilaUno.appendChild(boton2);
                barraProgreso();


                boton1.removeAttribute("aria-disabled", "true");
                boton1.removeAttribute("disabled", "true");
                boton2.removeAttribute("aria-disabled", "true");
                boton2.removeAttribute("disabled", "true");
            }
            break;
        case 3: //token expirado
            let aviso = document.createElement("p");
            aviso.setAttribute("class", "text-center pt-2 pb-2 text-danger");
            aviso.innerHTML = "Your token has expired. Reseting... click next or select a category to continue."
            divContenedorTarjeta.appendChild(aviso);
            let urlReset = "https://opentdb.com/api_token.php?command=request"
            fetch(urlReset).then(recibirDatos).then(function (datos) {
                usuario.token = datos.token;
                for (let index = 0; index < arrayLocalStorage.length; index++) {
                    if (usuario.email === arrayLocalStorage[index].email) {
                        arrayLocalStorage[index].token = usuario.token;
                    }
                }
                localStorage.setItem("arrayLocalStorage", JSON.stringify(arrayLocalStorage));
                url = `https://opentdb.com/api.php?amount=1&token=${usuario.token}`
            })
            break;
        case 4: //no quedan más preguntas para ese token
            aviso = document.createElement("p");
            aviso.setAttribute("class", "text-center pt-2 pb-2 text-danger");
            aviso.innerHTML = "No questions left for that query. Reset the token or try with another category.";
            divContenedorTarjeta.appendChild(aviso);
            botonReset = document.createElement("button");
            botonReset.setAttribute("class", "btn btn-outline-dark fondo shadow offset-5 col-2 mt-4 mb-2");
            botonReset.setAttribute("type", "button");
            divContenedorTarjeta.appendChild(botonReset);
            botonReset.addEventListener("click", function (datos) {
                urlReset = "https://opentdb.com/api_token.php?command=request"
                fetch(urlReset).then(recibirDatos).then(function (datos) {
                    usuario.token = datos.token;
                    for (let index = 0; index < arrayLocalStorage.length; index++) {
                        if (usuario.email === arrayLocalStorage[index].email) {
                            arrayLocalStorage[index].token = usuario.token;
                        }
                    }
                    localStorage.setItem("arrayLocalStorage", JSON.stringify(arrayLocalStorage));
                    url = `https://opentdb.com/api.php?amount=1&token=${usuario.token}`
                })
            })
            break;
    }
}

function cargarEjemplo() {
    if (usuario.token !== undefined) {
        url = `https://opentdb.com/api.php?amount=1&token=${usuario.token}`;
    } else {
        url = `https://opentdb.com/api.php?amount=1`;
    }
    fetch(url).then(recibirDatos).then(mostrarDatos);
}

function comprobarRespuesta(boton) {
    let scoreBadge = document.getElementById("score");
    let respuesta = document.createElement("p");
    if (boton.innerHTML === arrayRespuestas[0]) {
        respuesta.innerHTML = "CORRECT!";
        respuesta.setAttribute("class", "text-center mt-4 text-success");
        if (botonNext !== null) {
            if (dificultad === "easy") {
                score += 1;
                scoreBadge.innerHTML = score;
            } else if (dificultad === "medium") {
                score += 2;
                scoreBadge.innerHTML = score;
            } else {
                score += 3;
                scoreBadge.innerHTML = score;
            }
            for (let index = 0; index < arrayLocalStorage.length; index++) {
                if (usuario.email === arrayLocalStorage[index].email) {
                    arrayLocalStorage[index].score = score;
                    localStorage.setItem("arrayLocalStorage", JSON.stringify(arrayLocalStorage));
                }
            }
        }
    } else {
        respuesta.innerHTML = "Nope.";
        respuesta.setAttribute("class", "text-center mt-4 text-danger");
    }
    divContenedorTarjeta.appendChild(respuesta);

    if (tipo === "boolean") {
        boton1.setAttribute("aria-disabled", "true");
        boton1.setAttribute("disabled", "true");
        boton2.setAttribute("aria-disabled", "true");
        boton2.setAttribute("disabled", "true");
    } else {
        boton1.setAttribute("aria-disabled", "true");
        boton1.setAttribute("disabled", "true");
        boton2.setAttribute("aria-disabled", "true");
        boton2.setAttribute("disabled", "true");
        boton3.setAttribute("aria-disabled", "true");
        boton3.setAttribute("disabled", "true");
        boton4.setAttribute("aria-disabled", "true");
        boton4.setAttribute("disabled", "true");
    }
}

function rellenar(datos) {
    for (let index = 0; index < datos.trivia_categories.length; index++) {
        let opcion = document.createElement("option");
        opcion.setAttribute("value", datos.trivia_categories[index].id);
        opcion.innerHTML = datos.trivia_categories[index].name;
        contenedorCategoria.appendChild(opcion);
    }
}

function rellenarCategorias() {
    let urlCategorias = `https://opentdb.com/api_category.php`;
    fetch(urlCategorias).then(recibirDatos).then(rellenar);
}

function cambiarUsuario() {
    incorrectPassword.innerHTML = "";
    obtenerLocalStorage();
    let usuarioRegistrado = "false";
    if (arrayLocalStorage !== null) {
        for (let index = 0; index < arrayLocalStorage.length; index++) {
            if (email.value === arrayLocalStorage[index].email) {
                usuarioRegistrado = "true";
                usuario = { "email": arrayLocalStorage[index].email, "password": arrayLocalStorage[index].password, "token": arrayLocalStorage[index].token, "score": arrayLocalStorage[index].score };
            }
        }
        if (usuarioRegistrado === "false") {
            CrearYGuardarUsuario();
        } else {
            if (usuario.password === password.value) {
                divJoin.classList.add('d-none');
                divJuego.classList.remove('d-none');
                score = usuario.score;
                spanScore.innerHTML = score;
            } else {
                incorrectPassword.setAttribute("class", "text-danger offset-4 mt-3");
                incorrectPassword.innerHTML = "Incorrect password.";
                divJoin.appendChild(incorrectPassword);
                password.value = "";
            }
        }
    } else {
        CrearYGuardarUsuario();
    }
}

function CrearYGuardarUsuario() {
    url = "https://opentdb.com/api_token.php?command=request";
    fetch(url).then(recibirDatos).then(function (datos) {
        token = datos.token;
        usuario = { "email": email.value, "password": password.value, "token": token, "score": 0 };
        arrayLocalStorage.push(usuario);
        localStorage.setItem("arrayLocalStorage", JSON.stringify(arrayLocalStorage));
        divJoin.classList.add('d-none');
        divJuego.classList.remove('d-none');
        score = usuario.score;
        spanScore.innerHTML = score;
    })
}

function obtenerLocalStorage() {
    if (JSON.parse(localStorage.getItem("arrayLocalStorage")) !== null) {
        arrayLocalStorage = JSON.parse(localStorage.getItem("arrayLocalStorage"));
    }
}

function barraProgreso() {
    i = 0;
    move();
}

function move() {
    if (i == 0) {
        i = 1;
        elem = document.getElementsByClassName("myBar")[0];
        width = 1;
        id = setInterval(frame, 60);
        elem.classList.add("colorActivo");
    }
}

function frame() {
    if (width >= 100) {
        clearInterval(id);
        i = 0;
        elem.classList.remove("colorActivo");
        elem.classList.add("colorInactivo");
        if (tipo === "multiple") {
            boton1.setAttribute("aria-disabled", "true");
            boton1.setAttribute("disabled", "true");
            boton2.setAttribute("aria-disabled", "true");
            boton2.setAttribute("disabled", "true");
            boton3.setAttribute("aria-disabled", "true");
            boton3.setAttribute("disabled", "true");
            boton4.setAttribute("aria-disabled", "true");
            boton4.setAttribute("disabled", "true");
        } else {
            boton1.setAttribute("aria-disabled", "true");
            boton1.setAttribute("disabled", "true");
            boton2.setAttribute("aria-disabled", "true");
            boton2.setAttribute("disabled", "true");
        }
    } else if (boton1.disabled === true) {
        clearInterval(id);
        i = 0;
        elem.classList.remove("colorActivo");
        elem.classList.add("colorInactivo");
    } else {
        width++;
        elem.style.width = width + "%";
    }
}
// arrayLocalStorage = JSON.parse(localStorage.getItem("arrayLocalStorage"));
// arrayLocalStorage.setItem("arrayLocalStorage", JSON.stringify(arrayLocalStorage));