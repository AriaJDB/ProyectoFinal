document.addEventListener('DOMContentLoaded', () => {
    var regexCampo = /^[A-Za-z0-9]+$/;
    var campos = document.getElementsByClassName("campo");
    var enviarDatos = true;

    for (let campo of campos) {
        campo.addEventListener("blur", () => {
            let mensajeCampoCorrecto = document.getElementById(`mensajeCampoCorrecto_${campo.id}`);
            let mensajeCampoIncorrecto = document.getElementById(`mensajeCampoIncorrecto_${campo.id}`);

            if (!regexCampo.test(campo.value)) {
                enviarDatos = false;
                mensajeCampoCorrecto.classList.add("ocultar");
                mensajeCampoIncorrecto.classList.remove("ocultar");
                campo.classList.add("error");
                campo.classList.remove("correcto");
            } else {
                enviarDatos = true;
                mensajeCampoCorrecto.classList.remove("ocultar");
                mensajeCampoIncorrecto.classList.add("ocultar");
                campo.classList.remove("error");
                campo.classList.add("correcto");
            }
        });
    }

    var formulario = document.getElementById("formularioModificarRegistro");
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        if (enviarDatos) {
            formulario.submit();
            requestNotification("Registro modificado correctamente");
        } else {
            requestNotification("Error al modificar el registro");
        }
    });
});

function requestNotification(message) {
    Notification.requestPermission()
        .then(permission => {
            if (permission === "granted") {
                new Notification(message);
            }
        });
}
