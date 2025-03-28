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
        const [response1, response2] = await Promise.all([
            fetch("/imagenes1"),
            fetch("/imagenes2"),
        ]);

        if (!response1.ok || !response2.ok) 
            throw new Error(`Error HTTP: ${response1.status} - ${response2.status}`);

        const [images1, images2] = await Promise.all([
            response1.json(),
            response2.json(),
        ]);

        await updateCarousel("#carrusel1", images1, "carrusel_1");
        await updateCarousel("#carrusel2", images2, "carrusel_2");
    } catch (error) {
        console.error("❌ Error cargando imágenes:", error);
    }
}

async function updateCarousel(carruselId, images, folder) {
    const carouselWrapper = document.querySelector(`${carruselId} .carousel-content`);
    const preloader = document.querySelector(`${carruselId} .carrusel-preloader`);
    const carouselContainer = document.querySelector(carruselId);

    if (!carouselWrapper) {
        console.error(`Error: No se encontró el contenedor de ${carruselId}`);
        return;
    }

    carouselWrapper.innerHTML = ""; 
    carouselContainer.style.visibility = "hidden"; // Ocultar mientras carga

    if (images.length === 0) {
        console.error(`No se encontraron imágenes en ${folder}.`);
        return;
    }

    preloader.style.display = "flex"; // Mostrar preloader

    let loadedImages = 0;
    const loadImagePromises = images.map(image => new Promise((resolve) => {
        const div = document.createElement("div");
        div.classList.add("carousel-item");

        const img = new Image();
        img.classList.add("w-full", "h-full", "object-contain"); // 🔹 Ajusta aquí
        img.src = `/imagenes/${folder}/${image}`;
        img.alt = "Imagen del carrusel";

        img.onload = function () {
            loadedImages++;
            div.appendChild(img);
            carouselWrapper.appendChild(div);
            resolve();
        };

        img.onerror = function () {
            console.error(`Error al cargar imagen: ${img.src}`);
            resolve();
        };
    }));

    // ✅ Esperar a que todas las imágenes carguen
    await Promise.all(loadImagePromises);

    preloader.style.display = "none"; // Ocultar preloader
    carouselContainer.style.visibility = "visible"; // Mostrar carrusel

    setTimeout(() => {
        carouselWrapper.style.opacity = "1"; // Aplicar transición suave
        carouselWrapper.style.display = "flex";
    }, 100);

    if (images.length > 1) startCarousel(carruselId);
}

function startCarousel(carruselId) {
    const carousel = document.querySelector(`${carruselId} .carousel-content`);
    const items = document.querySelectorAll(`${carruselId} .carousel-item`);
    let index = 0;

    if (items.length === 0) {
        console.error(`No hay imágenes en ${carruselId}.`);
        return;
    }

    carousel.style.transform = `translateX(0%)`; // 🔹 Asegura que empiece bien

    setInterval(() => {
        index = (index + 1) % items.length;
        carousel.style.transform = `translateX(-${index * 100}%)`;
    }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {

    loadImages();
});

function updateSlider(slider) {
    if (!slider) return; // Evita errores si el elemento no existe

    const min = slider.min;
    const max = slider.max;
    const value = slider.value;

    // Calcular porcentaje de progreso
    const percentage = ((value - min) / (max - min)) * 100;

    // Aplicar fondo dinámico con degradado
    slider.style.background = `linear-gradient(to right, #007bff ${percentage}%, #ddd ${percentage}%)`;
}

// Asegurar que el script se ejecute cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function() {
    const slider = document.getElementById("volume");
    if (slider) {
        updateSlider(slider);
        slider.addEventListener("input", () => updateSlider(slider)); // Actualizar al mover el slider
    }
});