const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
const volumeControl = document.getElementById("volume");
let audioContext, analyser, source, dataArray, bufferLength;
const audio = document.querySelector("audio");
let valor = true;
let pas = true;

function playRadio() {
    if (!audioContext) {
        initVisualizer();
    }
    audio.play();
}

function pauseRadio() {
    audio.pause();
}

function muteRadio() {
    
    if(valor){
        muted1()
    }else{
        muted2()
    }
   valor = !valor;
}
function muted2(){
    audio.muted = false
    document.querySelector('#muted_boton').style.color="black"
}

function muted1(){
    audio.muted = true
    document.querySelector('#muted_boton').style.color="red"
}

function setVolume(value) {
    audio.volume = value;
}

function PlayAndStop(){

    if(pas){
        playRadio()
    }else{
        pauseRadio()
    }
    pas = !pas;

}

function initVisualizer() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    drawVisualizer();
}

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }
}
