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
    if (audio.muted) {
        muted2();
        if (audio.volume > 0) {
            document.getElementById("muted_boton").src = "./style/utility/images/Con_sonido.png";
            document.getElementById("muted_boton2").src = "./style/utility/images/Con_sonido.png";
        }
    } else {
        muted1();
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
        muted1();
    } else {
        muted2();
    }
}

function PlayAndStop() {
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
    ctx.fillStyle = "white";
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

async function loadImages() {
    try {
        const response1 = await fetch("/imagenes1");
        const response2 = await fetch("/imagenes2");

        console.log("Ruta de carrusel_1:", response1);
        console.log("Ruta de carrusel_2:", response2);

        if (!response1.ok || !response2.ok)
            throw new Error(`Error HTTP: ${response1.status} - ${response2.status}`);

        const images1 = await response1.json();
        const images2 = await response2.json();
        console.log("Imágenes recibidas para carrusel1:", images1);
        console.log("Imágenes recibidas para carrusel2:", images2);

        updateCarousel("#carrusel1", images1, "carrusel_1");
        updateCarousel("#carrusel2", images2, "carrusel_2");
    } catch (error) {
        console.error("❌ Error cargando imágenes:", error);
    }
}

function updateCarousel(carruselId, images, folder) {
    const carouselWrapper = document.querySelector(`${carruselId} .carousel-content`);
    if (!carouselWrapper) {
        console.error(`Error: No se encontró el contenedor de ${carruselId}`);
        return;
    }

    carouselWrapper.innerHTML = "";

    if (images.length === 0) {
        console.error(`No se encontraron imágenes en ${folder}.`);
        return;
    }

    images.forEach((image) => {
        let div = document.createElement("div");
        div.classList.add("carousel-item", "w-full", "flex", "justify-center", "shrink-0");

        let div2 = document.createElement("div");
        div2.classList.add("w-200");

        let img = document.createElement("img");
        img.classList.add("w-full", "h-full", "object-contain");
        img.src = `/imagenes/${folder}/${image}`;
        img.alt = "Imagen del carrusel";

        div2.appendChild(img);
        div.appendChild(div2);
        carouselWrapper.appendChild(div);
    });

    console.log(`Imágenes agregadas al DOM en ${carruselId}.`);

    if (images.length > 1) startCarousel(carruselId);
}

function startCarousel(carruselId) {
    const carousel = document.querySelector(`${carruselId} .carousel-content`);
    const items = document.querySelectorAll(`${carruselId} .carousel-item`);
    let index = 0;

    console.log(`📸 Total imágenes en ${carruselId}:`, items.length);

    if (items.length === 0) {
        console.error(`No hay imágenes en ${carruselId}.`);
        return;
    }

    setInterval(() => {
        index = (index + 1) % items.length;
        carousel.style.transform = `translateX(-${index * 100}%)`;
    }, 3000);
}


loadImages();

