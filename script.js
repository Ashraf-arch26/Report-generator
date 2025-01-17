const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const transcriptionArea = document.getElementById('transcription');
const reportOutput = document.getElementById('report-output');
const waveAnimation = document.getElementById('wave-animation');
const languageSelect = document.getElementById('language');

let recognition;
let isRecording = false;

// Check for Speech Recognition API Support
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    // Start Recording
    startBtn.addEventListener('click', () => {
        recognition.lang = languageSelect.value;
        recognition.start();
        isRecording = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        waveAnimation.style.display = 'block';
    });

    // Stop Recording
    stopBtn.addEventListener('click', () => {
        recognition.stop();
        isRecording = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        waveAnimation.style.display = 'none';
    });

    // Handle Speech Recognition Results
    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        transcriptionArea.value = finalTranscript + interimTranscript;
    };

    // Handle Errors
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        alert(`Error: ${event.error}`);
        startBtn.disabled = false;
        stopBtn.disabled = true;
        waveAnimation.style.display = 'none';
    };
} else {
    alert('Speech Recognition API is not supported in this browser.');
}

// Generate Report
generateBtn.addEventListener('click', () => {
    const text = transcriptionArea.value.trim();

    if (!text) {
        alert('Please provide a description to generate the report.');
        return;
    }

    const report = `Daily Report:\n\n${text}`;
    reportOutput.value = report;
    downloadBtn.disabled = false;
});

// Download Report
downloadBtn.addEventListener('click', () => {
    const reportText = reportOutput.value;
    const blob = new Blob([reportText], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Daily_Report.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
