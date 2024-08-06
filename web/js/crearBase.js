// Expresiones regulares para validación
var regexNombreBase = /^[A-Za-z0-9]+$/;

// Obtener elementos del formulario
var nombreBase = document.getElementById("nombreBase");
var mensajeNombreBaseCorrecto = document.getElementsByClassName("mensajeNombreBaseCorrecto")[0];
var mensajeNombreBaseIncorrecto = document.getElementsByClassName("mensajeNombreBaseIncorrecto")[0];
var enviarDatos = 1;
var band = 0;

// Validar nombre de la base de datos
nombreBase.addEventListener("blur", () => {
    if (!regexNombreBase.test(nombreBase.value)) {
        enviarDatos = 0;
        mensajeNombreBaseCorrecto.classList.add("ocultar");
        mensajeNombreBaseIncorrecto.classList.remove("ocultar");
        nombreBase.classList.add("error");
        nombreBase.classList.remove("correcto");
    } else {
        band++;
        enviarDatos = 1;
        mensajeNombreBaseCorrecto.classList.remove("ocultar");
        mensajeNombreBaseIncorrecto.classList.add("ocultar");
        nombreBase.classList.remove("error");
        nombreBase.classList.add("correcto");
    }
});

// Validar formulario al enviar
var formulario = document.getElementById("formularioCrearBase");
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
