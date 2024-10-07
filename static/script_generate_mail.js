document.getElementById("rate").addEventListener("input", function () {
  document.getElementById("rate-value").textContent = this.value;
});
document.getElementById("pitch").addEventListener("input", function () {
  document.getElementById("pitch-value").textContent = this.value;
});
document.getElementById("volume").addEventListener("input", function () {
  document.getElementById("volume-value").textContent = this.value;
});

function copyMessage(messageId) {
  const message = document.getElementById(messageId).value;
  navigator.clipboard
    .writeText(message)
    .then(() => {
      alert("Mensaje copiado al portapapeles");
    })
    .catch((err) => {
      console.error("Error al copiar al portapapeles: ", err);
    });
}

var isTalking = false;

function readMessage(textareaId, buttonIdImage, stopButtonId, buttonId) {
  const message = document.getElementById(textareaId).value;
  const button = document.getElementById(buttonIdImage);
  const stopButton = document.getElementById(stopButtonId);

  if (!isTalking) {
    // Crear un nuevo objeto de síntesis de voz
    const speech = new SpeechSynthesisUtterance(message);
    const voices = window.speechSynthesis.getVoices();
    speech.voice = voices.find((voice) => voice.lang === "es-ES") || voices[0];
    speech.rate = parseFloat(document.getElementById("rate").value);
    speech.pitch = parseFloat(document.getElementById("pitch").value);
    speech.volume = parseFloat(document.getElementById("volume").value);

    speech.onend = () => {
      button.src = "/static/play.png"; // Cambiar el ícono al finalizar el mensaje
      stopButton.style.visibility = "hidden"; // Ocultar el botón de detener
      isTalking = false;
      toggleButtons(false); // Reactivar los otros botones
    };

    // Comenzar a hablar y cambiar el ícono a "pause"
    window.speechSynthesis.speak(speech);
    button.src = "/static/pause.png"; // Cambiar el ícono a "pause"
    stopButton.style.visibility = "visible"; // Mostrar el botón de detener
    // Desactivar otros botones
    toggleButtons(true, buttonId);
    stopButton.disabled = false;
    isTalking = true;
  } else {
    // Si la instancia existe, comprobar su estado
    if (window.speechSynthesis.paused) {
      // Si está en pausa, reanudar y cambiar el ícono a "pause"
      window.speechSynthesis.resume();
      button.src = "/static/pause.png";
    } else if (window.speechSynthesis.speaking) {
      // Si está hablando, pausar
      window.speechSynthesis.pause();
      button.src = "/static/play.png"; // Cambiar el ícono a "play"
    }
  }
}

function stopSpeech(textareaId, buttonId) {
  const stopButton = document.getElementById(buttonId);
  if (isTalking) {
    window.speechSynthesis.cancel(); // Detener cualquier síntesis en curso
    isTalking = false;

    stopButton.style.visibility = "hidden"; // Ocultar el botón de detener
    const playButton = document.getElementById(
      textareaId.replace("textArea", "buttonImage")
    );
    playButton.src = "/static/play.png"; // Restablecer el ícono del botón de reproducción
    toggleButtons(false); // Reactivar los otros botones
  }
}

function toggleButtons(disable, currentButtonId) {
  // Seleccionar todos los botones que no sean el botón actual y desactivarlos o activarlos
  document.querySelectorAll("button").forEach((btn) => {
    if (btn.id !== currentButtonId) {
      btn.disabled = disable;
    }
  });
}
