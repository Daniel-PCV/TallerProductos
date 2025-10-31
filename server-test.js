const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const productosRoutes = require("./routes/productos");

const app = express();
const PORT = 3000;

// ====== MIDDLEWARE ======
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Sirve archivos estáticos (HTML, CSS, JS)

// ====== RUTAS ======
// Ruta de bienvenida
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Servidor del Taller de Productos funcionando",
    status: "OK",
    timestamp: new Date().toISOString(),
    endpoints: {
      productos: "/api/productos",
      crear: "POST /api/productos",
      obtener: "GET /api/productos",
      actualizar: "PUT /api/productos/:id",
      eliminar: "DELETE /api/productos/:id"
    }
  });
});

// Rutas de productos
app.use("/api/productos", productosRoutes);

// Ruta para manejar endpoints no encontrados
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint no encontrado" });
});

// ====== INICIAR SERVIDOR ======
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📱 Frontend disponible en http://localhost:${PORT}`);
  console.log(`🔗 API de productos en http://localhost:${PORT}/api/productos`);
  console.log(`📄 Prueba la API visitando: http://localhost:${PORT}`);
});