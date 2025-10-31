const express = require("express");
const conexion = require("../db/conexion");
const router = express.Router();

// ====== OBTENER TODOS LOS PRODUCTOS (CON BÚSQUEDA) ======
router.get("/", (req, res) => {
  const { q } = req.query; // Parámetro de búsqueda
  
  let sql = "SELECT * FROM productos";
  let params = [];
  
  if (q && q.trim()) {
    sql += " WHERE nombre LIKE ? OR categoria LIKE ?";
    const searchTerm = `%${q.trim()}%`;
    params = [searchTerm, searchTerm];
  }
  
  sql += " ORDER BY id DESC"; // Ordenar por ID descendente (más recientes primero)
  
  conexion.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error al obtener productos:", err);
      res.status(500).json({ error: "Error al obtener productos" });
    } else {
      res.json(results);
    }
  });
});

// ====== OBTENER UN PRODUCTO POR ID ======
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM productos WHERE id = ?";
  conexion.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener producto:", err);
      res.status(500).json({ error: "Error al obtener producto" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.json(results[0]);
    }
  });
});

// ====== CREAR NUEVO PRODUCTO ======
router.post("/", (req, res) => {
  const { nombre, precio, categoria } = req.body;
  
  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql = "INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)";
  conexion.query(sql, [nombre, precio, categoria], (err, result) => {
    if (err) {
      console.error("Error al crear producto:", err);
      res.status(500).json({ error: "Error al crear producto" });
    } else {
      res.status(201).json({ 
        message: "Producto creado exitosamente", 
        id: result.insertId,
        producto: { id: result.insertId, nombre, precio, categoria }
      });
    }
  });
});

// ====== ACTUALIZAR PRODUCTO ======
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categoria } = req.body;

  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql = "UPDATE productos SET nombre = ?, precio = ?, categoria = ? WHERE id = ?";
  conexion.query(sql, [nombre, precio, categoria, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar producto:", err);
      res.status(500).json({ error: "Error al actualizar producto" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.json({ 
        message: "Producto actualizado exitosamente",
        producto: { id, nombre, precio, categoria }
      });
    }
  });
});

// ====== ELIMINAR PRODUCTO ======
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM productos WHERE id = ?";
  conexion.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar producto:", err);
      res.status(500).json({ error: "Error al eliminar producto" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.json({ message: "Producto eliminado exitosamente" });
    }
  });
});

module.exports = router;
