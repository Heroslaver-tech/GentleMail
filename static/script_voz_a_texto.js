const recordingDiv = document.getElementById("recordingDiv");
const presentDiv = document.getElementById("presentDiv");
const resultDiv = document.getElementById("resultDiv");
const nextBtn = document.getElementById("next-btn");
const recordingBtn = document.getElementById("start-btn");
const generateDiv = document.getElementById("generate-div");

const hearBtn = document.getElementById("hear-btn");
const stopBtn = document.getElementById("stop-btn");
const generateBtn = document.getElementById("generate-btn");
const outputDiv = document.getElementById("output");
const listeningStatus = document.getElementById("listeningStatusText");
const errorDiv = document.getElementById("errorAlert");

document.getElementById("rate").addEventListener("input", function () {
  document.getElementById("rate-value").textContent = this.value;
});
document.getElementById("pitch").addEventListener("input", function () {
  document.getElementById("pitch-value").textContent = this.value;
});
document.getElementById("volume").addEventListener("input", function () {
  document.getElementById("volume-value").textContent = this.value;
});

var finalTranscript = "";

if (
  !("webkitSpeechRecognition" in window) &&
  !("SpeechRecognition" in window)
) {
  outputDiv.textContent =
    "Tu navegador no soporta la Web Speech API para reconocimiento de voz.";
} else {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = "es-ES";
  recognition.interimResults = false;
  recognition.continuous = true;

  let isRecording = false;

  //dont erase it
  if (outputDiv.value) {
    generateDiv.style = "visibility: visible";
  } else {
    generateDiv.style = "visibility: hidden";
  }

  recognition.onresult = function (event) {
    let interimTranscript = "";
    errorDiv.style = "visibility: hidden";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + " ";
      } else {
        interimTranscript += transcript;
      }
    }
    outputDiv.value += finalTranscript;

    if (outputDiv.value) {
      generateDiv.style = "visibility: visible";
    } else {
      generateDiv.style = "visibility: hidden";
    }
  };

  recognition.onerror = function (event) {
    errorDiv.style = "visibility: visible";
    errorDiv.textContent = "Error recognizing audio: " + event.error;
  };

  nextBtn.addEventListener("click", function () {
    presentDiv.style = "display: none";
    recordingDiv.style = "display: block";
  });

  recordingBtn.addEventListener("click", function () {
    if (isRecording) {
      isRecording = false;
      recordingBtn.style = "background: #3B82F6";
      recordingBtn.innerHTML = "🎤 Start Recording";
      listeningStatus.innerHTML = "Not Listening";
      recognition.stop();
    } else {
      isRecording = true;
      recordingBtn.style = "background: #EF4444";
      recordingBtn.innerHTML = "Stop Recording";
      listeningStatus.innerHTML = "Listening...";
      recognition.start();
    }
  });

  generateBtn.addEventListener("click", function () {
    var finalMessage = outputDiv.value.trim();
    if (finalMessage) {
      window.location.href = "/procesamiento/" + finalMessage;
    }
  });

  outputDiv.addEventListener("input", function () {
    if (outputDiv.value) {
      generateDiv.style = "visibility: visible";
    } else {
      generateDiv.style = "visibility: hidden";
    }
  });

  hearBtn.addEventListener("click", function () {
    if (window.speechSynthesis.speaking) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        hearBtn.innerText = "Pause";
      } else {
        window.speechSynthesis.pause();
        hearBtn.innerText = "Resume";
      }
    } else {
      function readMessage(message) {
        const speech = new SpeechSynthesisUtterance(message);
        const voices = window.speechSynthesis.getVoices();
        speech.voice =
          voices.find((voice) => voice.lang === "es-ES") || voices[0];
        speech.rate = parseFloat(document.getElementById("rate").value);
        speech.pitch = parseFloat(document.getElementById("pitch").value);
        speech.volume = parseFloat(document.getElementById("volume").value);

        speech.onend = function () {
          hearBtn.innerText = "🎧 Hear it";
          stopBtn.style = "visibility: hidden";
        };

        // Este bloque asegurará que se cancele cualquier síntesis en curso antes de hablar nuevamente
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);

        stopBtn.style = "visibility: visible";
      }

      if(outputDiv.value.trim()){
          readMessage(outputDiv.value);
          hearBtn.innerText = "Pause";
      }
    }
  });

  stopBtn.addEventListener("click", function () {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      hearBtn.innerText = "🎧 Hear it";
      stopBtn.style = "visibility: hidden";
    }
  });
}
