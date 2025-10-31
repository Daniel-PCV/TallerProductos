const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const productosRoutes = require("./routes/productos");

const app = express();
const PORT = 3000;

// ====== MIDDLEWARE ======
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Sirve archivos estáticos (HTML, CSS, JS)

// ====== RUTAS API ======
// Rutas de productos
app.use("/api/productos", productosRoutes);

// Ruta de información de la API
app.get("/api", (req, res) => {
  res.json({ 
    message: "🚀 API del Taller de Productos funcionando",
    endpoints: {
      productos: "/api/productos",
      crear: "POST /api/productos",
      obtener: "GET /api/productos",
      actualizar: "PUT /api/productos/:id",
      eliminar: "DELETE /api/productos/:id"
    }
  });
});

// ====== RUTA PARA EL FRONTEND ======
// Servir index.html en la ruta raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Ruta para manejar endpoints no encontrados
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint no encontrado" });
});

// ====== INICIAR SERVIDOR ======
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📱 Frontend disponible en http://localhost:${PORT}`);
  console.log(`🔗 API de productos en http://localhost:${PORT}/api/productos`);
});
