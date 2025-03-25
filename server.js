const http = require("http");
const fs = require("fs");
const path = require("path");

const imageFolder = path.join(__dirname, "style/utility/carrusel_2");
const jsFolder = path.join(__dirname, "javascript");
const cssFolder = path.join(__dirname, "style"); // 📌 Carpeta CSS

// 🔹 Función para servir archivos con CORS
function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 
                "Content-Type": "text/plain",
                "Access-Control-Allow-Origin": "*"
            });
            res.end("Archivo no encontrado");
        } else {
            res.writeHead(200, { 
                "Content-Type": contentType,
                "Access-Control-Allow-Origin": "*"
            });
            res.end(content);
        }
    });
}

// 🔹 Servidor HTTP
http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
    }

    if (req.url === "/") {
        serveFile(res, "index.html", "text/html");
    } else if (req.url === "/imagenes") {
        fs.readdir(imageFolder, (err, files) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "No se pudieron leer las imágenes" }));
                return;
            }

            const images = files.filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file));
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(images));
        });
    } else if (req.url.startsWith("/imagenes/")) {
        const imageName = req.url.replace("/imagenes/", "");
        const filePath = path.join(imageFolder, imageName);
        serveFile(res, filePath, "image/png");
    } else if (req.url.startsWith("/javascript/")) {
        const jsFileName = req.url.replace("/javascript/", "");
        const jsFilePath = path.join(jsFolder, jsFileName);
        serveFile(res, jsFilePath, "application/javascript");
    } else if (req.url.startsWith("/style/")) {
        // 🔹 Servir archivos CSS correctamente
        const cssFileName = req.url.replace("/style/", "");
        const cssFilePath = path.join(cssFolder, cssFileName);
        serveFile(res, cssFilePath, "text/css");
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Página no encontrada");
    }
}).listen(3000, () => console.log("🔥 Servidor corriendo en http://localhost:3000"));
