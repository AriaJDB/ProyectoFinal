var regexTablaNombre = /^[A-Za-z0-9]+$/;
var regexNumeroCampos = /^[1-9]\d*$/;

var tablaNombre = document.getElementById("tablaNombre");
var mensajeNombreTablaCorrecto = document.getElementsByClassName("mensajeNombreTablaCorrecto")[0];
var mensajeNombreTablaIncorrecto = document.getElementsByClassName("mensajeNombreTablaIncorrecto")[0];
var enviarDatos = 1;
var band = 0;

tablaNombre.addEventListener("blur", () => {
    if (!regexTablaNombre.test(tablaNombre.value)) {
        enviarDatos = 0;
        mensajeNombreTablaCorrecto.classList.add("ocultar");
        mensajeNombreTablaIncorrecto.classList.remove("ocultar");
        tablaNombre.classList.add("error");
        tablaNombre.classList.remove("correcto");
    } else {
        band++;
        enviarDatos = 1;
        mensajeNombreTablaCorrecto.classList.remove("ocultar");
        mensajeNombreTablaIncorrecto.classList.add("ocultar");
        tablaNombre.classList.remove("error");
        tablaNombre.classList.add("correcto");
    }
});

var numeroCampos = document.getElementById("numeroCampos");
var mensajeNumeroCamposCorrecto = document.getElementsByClassName("mensajeNumeroCamposCorrecto")[0];
var mensajeNumeroCamposIncorrecto = document.getElementsByClassName("mensajeNumeroCamposIncorrecto")[0];

numeroCampos.addEventListener("blur", () => {
    if (!regexNumeroCampos.test(numeroCampos.value)) {
        enviarDatos = 0;
        mensajeNumeroCamposCorrecto.classList.add("ocultar");
        mensajeNumeroCamposIncorrecto.classList.remove("ocultar");
        numeroCampos.classList.add("error");
        numeroCampos.classList.remove("correcto");
    } else {
        band++;
        enviarDatos = 1;
        mensajeNumeroCamposCorrecto.classList.remove("ocultar");
        mensajeNumeroCamposIncorrecto.classList.add("ocultar");
        numeroCampos.classList.remove("error");
        numeroCampos.classList.add("correcto");
    }
});

// Validar formulario al enviar
var formulario = document.getElementById("formularioCrearTabla");
formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    if (enviarDatos === 1 && band === 1) {
        formulario.submit();
        requestNotification();
    } else {
        enviarDatos = 0;
        requestNotification1();
    }
});

// Notificación de éxito
function requestNotification() {
    Notification.requestPermission()
        .then(permission => {
            if (permission === "granted") {
                new Notification("Se registró correctamente");
            }
        });
}

// Notificación de error
function requestNotification1() {
    Notification.requestPermission()
        .then(permission => {
            if (permission === "granted") {
                new Notification("Error al registrarse");
            }
        });
}