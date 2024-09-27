const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const outputDiv = document.getElementById('output');

if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    outputDiv.textContent = 'Tu navegador no soporta la Web Speech API para reconocimiento de voz.';
} else {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';  
    recognition.interimResults = false; 
    recognition.continuous = true;  

    let finalTranscript = '';  

    recognition.onresult = function(event) {
        let interimTranscript = ''; 
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';  
            } else {
                interimTranscript += transcript; 
            }
        }

        outputDiv.innerHTML = `<br/><strong>Tu grabación:</strong> ${finalTranscript}`;
    };

    recognition.onerror = function(event) {
        outputDiv.textContent = 'Error al reconocer el audio: ' + event.error;
    };

    startBtn.addEventListener('click', function() {
        recognition.start();
        outputDiv.textContent = 'Escuchando...';
    });

}
