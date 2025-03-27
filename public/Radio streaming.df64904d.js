let audioContext,analyser,dataArray,bufferLength,canvas=document.getElementById("visualizer"),ctx=canvas.getContext("2d"),volumeControl=document.getElementById("volume"),audio=document.querySelector("audio");function playRadio(){audioContext||initVisualizer(),document.getElementById("P_a_s").src="./style/utility/images/stop.png",audio.play()}function pauseRadio(){document.getElementById("P_a_s").src="./style/utility/images/Play.png",audio.pause()}function muteRadio(){audio.muted?(muted2(),audio.volume>0&&(document.getElementById("muted_boton").src="./style/utility/images/Con_sonido.png",document.getElementById("muted_boton2").src="./style/utility/images/Con_sonido.png")):(muted1(),document.getElementById("muted_boton").src="./style/utility/images/Sin_sonido.png",document.getElementById("muted_boton2").src="./style/utility/images/Sin_sonido.png")}function muted2(){audio.muted=!1,audio.volume>0&&(document.getElementById("muted_boton").src="./style/utility/images/Con_sonido.png",document.getElementById("muted_boton2").src="./style/utility/images/Con_sonido.png")}function muted1(){audio.muted=!0,document.getElementById("muted_boton").src="./style/utility/images/Sin_sonido.png",document.getElementById("muted_boton2").src="./style/utility/images/Sin_sonido.png"}function setVolume(e){audio.volume=e,0===audio.volume?muted1():muted2()}function PlayAndStop(){audio.paused?playRadio():pauseRadio()}function initVisualizer(){analyser=(audioContext=new(window.AudioContext||window.webkitAudioContext)).createAnalyser(),audioContext.createMediaElementSource(audio).connect(analyser),analyser.connect(audioContext.destination),analyser.fftSize=256,dataArray=new Uint8Array(bufferLength=analyser.frequencyBinCount),drawVisualizer()}function drawVisualizer(){requestAnimationFrame(drawVisualizer),analyser.getByteFrequencyData(dataArray),ctx.clearRect(0,0,canvas.width,canvas.height),ctx.fillStyle="white",ctx.fillRect(0,0,canvas.width,canvas.height);let e=canvas.width/bufferLength*2.5,t=0;for(let n=0;n<bufferLength;n++){let o=dataArray[n]/2;ctx.fillStyle=`rgb(${o+100}, 50, 150)`,ctx.fillRect(t,canvas.height-o,e,o),t+=e+1}}async function loadImages(){try{let[e,t]=await Promise.all([fetch("/imagenes1"),fetch("/imagenes2")]);if(!e.ok||!t.ok)throw Error(`Error HTTP: ${e.status} - ${t.status}`);let[n,o]=await Promise.all([e.json(),t.json()]);await updateCarousel("#carrusel1",n,"carrusel_1"),await updateCarousel("#carrusel2",o,"carrusel_2")}catch(e){console.error("❌ Error cargando imágenes:",e)}}async function updateCarousel(e,t,n){let o=document.querySelector(`${e} .carousel-content`),a=document.querySelector(`${e} .carrusel-preloader`),i=document.querySelector(e);if(!o){console.error(`Error: No se encontr\xf3 el contenedor de ${e}`);return}if(o.innerHTML="",i.style.visibility="hidden",0===t.length){console.error(`No se encontraron im\xe1genes en ${n}.`);return}a.style.display="flex";let l=0,r=t.map(e=>new Promise(t=>{let a=document.createElement("div");a.classList.add("carousel-item");let i=new Image;i.classList.add("w-full","h-full","object-contain"),i.src=`/imagenes/${n}/${e}`,i.alt="Imagen del carrusel",i.onload=function(){l++,a.appendChild(i),o.appendChild(a),t()},i.onerror=function(){console.error(`Error al cargar imagen: ${i.src}`),t()}}));await Promise.all(r),a.style.display="none",i.style.visibility="visible",setTimeout(()=>{o.style.opacity="1",o.style.display="flex"},100),t.length>1&&startCarousel(e)}function startCarousel(e){let t=document.querySelector(`${e} .carousel-content`),n=document.querySelectorAll(`${e} .carousel-item`),o=0;if(0===n.length){console.error(`No hay im\xe1genes en ${e}.`);return}t.style.transform="translateX(0%)",setInterval(()=>{o=(o+1)%n.length,t.style.transform=`translateX(-${100*o}%)`},3e3)}document.addEventListener("DOMContentLoaded",function(){console.log("El DOM está listo, pero aún se están cargando imágenes..."),loadImages()});
//# sourceMappingURL=Radio streaming.df64904d.js.map
