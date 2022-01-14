    const spanScore = document.getElementById("score");
    const cambiarJugador = document.getElementById("cambiarJugador");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const divDerechaPlay = document.getElementById("divDerechaPlay");
    const divContenedorTarjeta = document.getElementById("divContenedorTarjeta");
    const contenedorCategoria = document.getElementById("contenedorCategoria");
    const botonNext = document.getElementById("next");
    const boton1 = document.createElement("button");
    const boton2 = document.createElement("button");
    const boton3 = document.createElement("button");
    const boton4 = document.createElement("button");
    const submitJoin = document.getElementById("submitJoin");
    const divJuego = document.getElementById("mostrarJuego");
    const divJoin = document.getElementById("mostrarJoin");
    const incorrectPassword = document.createElement("p");
    let arrayRespuestas = [];
    let arrayLocalStorage = [];
    let token;
    let dificultad;
    let tipo;
    let usuario = {};
    let score = 0;
    let url;
    let id;
    let mover;
    let elem;
    let width;

    window.onload = () => {
        document.getElementsByClassName("textoFooter")
            .forEach(element => element.innerHTML = "Copyright © 2020 - " + new Date().getFullYear() + " - " + "by Mezdelex");
    }

    boton1.addEventListener("click", () => {
        comprobarRespuesta(boton1);
    })
    boton2.addEventListener("click", () => {
        comprobarRespuesta(boton2);
    })
    boton3.addEventListener("click", () => {
        comprobarRespuesta(boton3);
    })
    boton4.addEventListener("click", () => {
        comprobarRespuesta(boton4);
    })

    const rellenarCategorias = () => {
        let urlCategorias = `https://opentdb.com/api_category.php`;
        fetch(urlCategorias).then(recibirDatos).then(rellenar);
    }

    const rellenar = (datos) => {
        for (let index = 0; index < datos.trivia_categories.length; ++index) {
            let opcion = document.createElement("option");
            opcion.setAttribute("value", datos.trivia_categories[index].id);
            opcion.innerHTML = datos.trivia_categories[index].name;
            contenedorCategoria.appendChild(opcion);
        }
    }

    const inicializarPuntuacion = () => {
        divJoin.classList.add('d-none');
        divJuego.classList.remove('d-none');
        score = usuario.score;
        spanScore.innerHTML = score;
    }

    const cambiarUsuario = () => {
        incorrectPassword.innerHTML = "";
        obtenerLocalStorage();
        let usuarioRegistrado = false;
        if (arrayLocalStorage !== null) {
            for (let index = 0; index < arrayLocalStorage.length; ++index) {
                if (email.value === arrayLocalStorage[index].email) {
                    usuarioRegistrado = true;
                    usuario = {
                        "email": arrayLocalStorage[index].email,
                        "password": arrayLocalStorage[index].password,
                        "token": arrayLocalStorage[index].token,
                        "score": arrayLocalStorage[index].score
                    };
                    break;
                }
            }
            if (usuarioRegistrado === false) {
                crearYGuardarUsuario();
            } else {
                if (usuario.password === password.value) {
                    inicializarPuntuacion();
                } else {
                    incorrectPassword.setAttribute("class", "text-danger mt-3");
                    incorrectPassword.innerHTML = "Incorrect password.";
                    divJoin.appendChild(incorrectPassword);
                    password.value = "";
                }
            }
        } else {
            crearYGuardarUsuario();
        }
    }

    const crearYGuardarUsuario = () => {
        url = "https://opentdb.com/api_token.php?command=request";
        fetch(url).then(recibirDatos).then((datos) => {
            token = datos.token;
            usuario = {
                "email": email.value,
                "password": password.value,
                "token": token,
                "score": 0
            };
            arrayLocalStorage.push(usuario);
            localStorage.setItem("arrayLocalStorage", JSON.stringify(arrayLocalStorage));
            inicializarPuntuacion();
        })
    }

    const obtenerLocalStorage = () => {
        if (JSON.parse(localStorage.getItem("arrayLocalStorage")) !== null) {
            arrayLocalStorage = JSON.parse(localStorage.getItem("arrayLocalStorage"));
        }
    }

    const barraProgreso = () => {
        mover = true;
        move();
    }

    const move = () => {
        if (mover) {
            mover = !mover;
            elem = document.getElementsByClassName("myBar")[0];
            width = 1;
            id = setInterval(frame, 60);
            elem.classList.add("colorActivo");
        }
    }

    const limpiarIntervalo = () => {
        clearInterval(id);
        mover = true;
    }

    const frame = () => {
        if (width >= 100 || boton1.disabled === true) {
            limpiarIntervalo();
            elem.classList.remove("colorActivo");
            elem.classList.add("colorInactivo");
            if (width >= 100) {
                boton1.setAttribute("aria-disabled", "true");
                boton1.setAttribute("disabled", "true");
                boton2.setAttribute("aria-disabled", "true");
                boton2.setAttribute("disabled", "true");
                if (tipo === "multiple") {
                    boton3.setAttribute("aria-disabled", "true");
                    boton3.setAttribute("disabled", "true");
                    boton4.setAttribute("aria-disabled", "true");
                    boton4.setAttribute("disabled", "true");
                }
            }
        } else {
            width++;
            elem.style.width = width + "%";
        }
    }

    const recibirDatos = (datos) => {
        limpiarIntervalo();
        return datos.json();
    }

    const mostrarDatos = (datos) => {
        divContenedorTarjeta.innerHTML = "";
        switch (datos.response_code) {
            case 0:
                dibujarPreguntas(datos);
                break;
            case 3: // Token expirado
                resetearToken();
                break;
            case 4: // No quedan más preguntas para ese token
                maxPreguntas();
        }
    }

    const activarBotones = () => {
        boton1.removeAttribute("aria-disabled", "true");
        boton1.removeAttribute("disabled", "true");
        boton2.removeAttribute("aria-disabled", "true");
        boton2.removeAttribute("disabled", "true");
        if (tipo === "multiple") {
            boton3.removeAttribute("aria-disabled", "true");
            boton3.removeAttribute("disabled", "true");
            boton4.removeAttribute("aria-disabled", "true");
            boton4.removeAttribute("disabled", "true");
        }
    }

    const desactivarBotones = () => {
        boton1.setAttribute("aria-disabled", "true");
        boton1.setAttribute("disabled", "true");
        boton2.setAttribute("aria-disabled", "true");
        boton2.setAttribute("disabled", "true");
        if (tipo === "multiple") {
            boton3.setAttribute("aria-disabled", "true");
            boton3.setAttribute("disabled", "true");
            boton4.setAttribute("aria-disabled", "true");
            boton4.setAttribute("disabled", "true");
        }
    }

    const cargarEjemplo = () => {
        url = usuario.token !== undefined ? `https://opentdb.com/api.php?amount=1&token=${usuario.token}` : `https://opentdb.com/api.php?amount=1`;
        fetch(url).then(recibirDatos).then(mostrarDatos);
    }

    const comprobarIndice = (indice, tipo) => {
        return tipo === "multiple" ?
            indice === 3 ? 0 : ++indice :
            indice === 1 ? 0 : 1;
    }

    const dibujarPreguntas = (datos) => {
        const divColorDificultad = document.createElement("div");
        const divCategoria = document.createElement("div");
        const divPregunta = document.createElement("div");
        const divProgressBar = document.createElement("div");
        const divContenedorBotones = document.createElement("div");
        const divFilaUno = document.createElement("div");
        const divFilaDos = document.createElement("div");
        dificultad = datos.results[0].difficulty;
        tipo = datos.results[0].type;
        let indice = tipo === "multiple" ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 2);

        arrayRespuestas = (tipo === "boolean") ? [datos.results[0].correct_answer, datos.results[0].incorrect_answers[0]] : [datos.results[0].correct_answer, datos.results[0].incorrect_answers[0], datos.results[0].incorrect_answers[1], datos.results[0].incorrect_answers[2]]

        divColorDificultad.innerHTML = `<p class="text-uppercase text-center shadow p-3 mb-4 rounded border border-dark">${datos.results[0].difficulty}</p>`;
        divContenedorTarjeta.appendChild(divColorDificultad);

        diccionarioDificultad = {
            "easy": () => divColorDificultad.setAttribute("class", "colorFacil rounded"),
            "medium": () => divColorDificultad.setAttribute("class", "colorMedio rounded"),
            "hard": () => divColorDificultad.setAttribute("class", "colorDificil rounded")
        }
        diccionarioDificultad[dificultad]();

        divCategoria.innerHTML = `<p class="text-center">${datos.results[0].category}</p>`
        divContenedorTarjeta.appendChild(divCategoria);

        divPregunta.innerHTML = `<p class="text-center pt-2 pb-2">${datos.results[0].question}</p>`
        divContenedorTarjeta.appendChild(divPregunta);

        // Barra de progreso
        divProgressBar.setAttribute("class", "myProgress border border-dark mb-3")
        divProgressBar.innerHTML = `<div class="myBar rounded"></div>`;
        divContenedorTarjeta.appendChild(divProgressBar);

        divContenedorTarjeta.appendChild(divContenedorBotones);

        // Fila 1 de botones
        divFilaUno.setAttribute("class", "d-flex flex-row justify-content-between align-items-center pb-1");
        divContenedorBotones.appendChild(divFilaUno);

        boton1.setAttribute("class", "btn btn-outline-dark col-5");
        boton1.setAttribute("type", "button");
        boton1.innerHTML = arrayRespuestas[indice];
        indice = comprobarIndice(indice, tipo);
        divFilaUno.appendChild(boton1);

        boton2.setAttribute("class", "btn btn-outline-dark col-5");
        boton2.setAttribute("type", "button");
        boton2.innerHTML = arrayRespuestas[indice];
        if (tipo === "multiple") indice = comprobarIndice(indice, tipo);
        divFilaUno.appendChild(boton2);

        if (tipo === "multiple") {
            // Fila 2 de botones
            divFilaDos.setAttribute("class", "d-flex flex-row justify-content-between align-items-center");
            divContenedorBotones.appendChild(divFilaDos);

            boton3.setAttribute("class", "btn btn-outline-dark col-5");
            boton3.setAttribute("type", "button");
            boton3.innerHTML = arrayRespuestas[indice];
            indice = comprobarIndice(indice, tipo);
            divFilaDos.appendChild(boton3);

            boton4.setAttribute("class", "btn btn-outline-dark col-5");
            boton4.setAttribute("type", "button");
            boton4.innerHTML = arrayRespuestas[indice];
            divFilaDos.appendChild(boton4);
        }
        barraProgreso();
        activarBotones();
    }

    const resetearYGuardar = () => {
        let urlReset = "https://opentdb.com/api_token.php?command=request"
        fetch(urlReset).then(recibirDatos).then((datos) => {
            usuario.token = datos.token;
            for (let index = 0; index < arrayLocalStorage.length; ++index) {
                if (usuario.email === arrayLocalStorage[index].email) {
                    arrayLocalStorage[index].token = usuario.token;
                    break;
                }
            }
            localStorage.setItem("arrayLocalStorage", JSON.stringify(arrayLocalStorage));
            url = `https://opentdb.com/api.php?amount=1&token=${usuario.token}`
        })
    }

    const resetearToken = () => {
        let aviso = document.createElement("p");
        aviso.setAttribute("class", "text-center pt-2 pb-2 text-danger");
        aviso.innerHTML = "Your token has expired. Reseting... click next or select a category to continue."
        divContenedorTarjeta.appendChild(aviso);
        resetearYGuardar();
    }

    const maxPreguntas = () => {
        aviso = document.createElement("p");
        aviso.setAttribute("class", "text-center pt-2 pb-2 text-danger");
        aviso.innerHTML = "No questions left for that query. Reset the token or try with another category.";
        divContenedorTarjeta.appendChild(aviso);
        botonReset = document.createElement("button");
        botonReset.setAttribute("class", "btn btn-outline-dark fondo shadow offset-5 col-2 mt-4 mb-2");
        botonReset.setAttribute("type", "button");
        divContenedorTarjeta.appendChild(botonReset);

        botonReset.addEventListener("click", () => resetearYGuardar());
    }

    const comprobarRespuesta = (boton) => {
        let scoreBadge = document.getElementById("score");
        let respuesta = document.createElement("p");
        if (boton.innerHTML === arrayRespuestas[0]) {
            respuesta.innerHTML = "CORRECT!";
            respuesta.setAttribute("class", "text-center mt-4 text-success");

            if (botonNext !== null) {
                diccionarioDificultad = {
                    "easy": () => score++,
                    "medium": () => score += 2,
                    "hard": () => score += 3
                }
                diccionarioDificultad[dificultad]();
                scoreBadge.innerHTML = score;

                for (let index = 0; index < arrayLocalStorage.length; ++index) {
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

        desactivarBotones();
    }

    if (cambiarJugador !== null) {
        cambiarJugador.addEventListener("click", () => {
            divJoin.classList.remove('d-none');
            divJuego.classList.add('d-none');
        })
    }

    if (submitJoin !== null) {
        submitJoin.addEventListener("click", () => {
            cambiarUsuario();
            cargarEjemplo();
        })
    }

    if (divContenedorTarjeta !== null && submitJoin === null) {
        divContenedorTarjeta.addEventListener("load", cargarEjemplo());
    }

    if (contenedorCategoria !== null) {
        contenedorCategoria.addEventListener("load", rellenarCategorias());
        contenedorCategoria.addEventListener("change", (event) => {
            let id = event.target.value;
            url = `https://opentdb.com/api.php?amount=1&category=${id}&token=${usuario.token}`;
            fetch(url).then(recibirDatos).then(mostrarDatos);
        })
    }

    if (botonNext !== null) {
        botonNext.addEventListener("click", () => {
            fetch(url).then(recibirDatos).then(mostrarDatos);
        })
    }