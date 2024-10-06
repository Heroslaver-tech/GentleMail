const recordingDiv = document.getElementById('recordingDiv')
const presentDiv = document.getElementById('presentDiv')
const resultDiv = document.getElementById('resultDiv')
const nextBtn = document.getElementById('next-btn');
const recordingBtn = document.getElementById('start-btn');
const generateBtn = document.getElementById('generate-btn');
const outputDiv = document.getElementById('output');
const listeningStatus = document.getElementById('listeningStatusText')
const errorDiv = document.getElementById('errorAlert')
var finalTranscript = '';

if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    outputDiv.textContent = 'Tu navegador no soporta la Web Speech API para reconocimiento de voz.';
} else {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';  
    recognition.interimResults = false; 
    recognition.continuous = true;  

    let isRecording = false;

    recognition.onresult = function(event) {
        let interimTranscript = ''; 
        errorDiv.style ="display: none"
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';  
            } else {
                interimTranscript += transcript; 
            }
        }

        outputDiv.innerHTML = `${finalTranscript}`;
    };

    recognition.onerror = function(event) {
        errorDiv.textContent = 'Error recognizing audio: '+ event.error;
    };

    nextBtn.addEventListener('click', function() {
        presentDiv.style = "display: none"
        recordingDiv.style = "display: block"
    });

    recordingBtn.addEventListener('click', function() {
        if(isRecording){
            isRecording = false;
            recordingBtn.style = "background: #3B82F6"
            recordingBtn.innerHTML = "🎤 Start Recording"
            listeningStatus.innerHTML = 'Not Listening';
            recognition.stop();
        }else{
            isRecording = true;
            recordingBtn.style = "background: #EF4444"
            recordingBtn.innerHTML = "Stop Recording"
            listeningStatus.innerHTML = 'Listening...';
            recognition.start();
        }
    });

    generateBtn.addEventListener('click', function() {
        if(outputDiv.value.trim() != ""){
            recordingDiv.style = "display: none"
            resultDiv.style = "display: block"
        }
    });

}
