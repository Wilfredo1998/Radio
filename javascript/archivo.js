const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
const volumeControl = document.getElementById("volume");
let audioContext, analyser, source, dataArray, bufferLength;
const audio = document.querySelector("audio");




function playRadio() {
    if (!audioContext) {
        initVisualizer();
    }
    document.getElementById("P_a_s").src = "./style/utility/images/stop.png";
    audio.play();
}

function pauseRadio() {
    document.getElementById("P_a_s").src = "./style/utility/images/Play.png";
    audio.pause();
}

function muteRadio() {
    
    if(audio.muted){
        muted2()
        if(audio.volume > 0){
        document.getElementById("muted_boton").src = "./style/utility/images/Con_sonido.png";
        document.getElementById("muted_boton2").src = "./style/utility/images/Con_sonido.png";
        }
        
    }else{
        muted1()
        document.getElementById("muted_boton").src = "./style/utility/images/Sin_sonido.png";
        document.getElementById("muted_boton2").src = "./style/utility/images/Sin_sonido.png";
    }

}
function muted2() {
    audio.muted = false;
    if (audio.volume > 0) {
        document.getElementById("muted_boton").src = "./style/utility/images/Con_sonido.png";
        document.getElementById("muted_boton2").src = "./style/utility/images/Con_sonido.png";
    }
}

function muted1() {
    audio.muted = true;
    document.getElementById("muted_boton").src = "./style/utility/images/Sin_sonido.png";
    document.getElementById("muted_boton2").src = "./style/utility/images/Sin_sonido.png";
}


function setVolume(value) {
    audio.volume = value;
    if (audio.volume === 0) {
        muted1()
    }
    else{
        muted2()
    }
}

function PlayAndStop(){

    if (audio.paused) {
        playRadio();
    } else {
        pauseRadio(); 
    }

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
