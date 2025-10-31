const mysql = require("mysql");

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "taller_productos",
  insecureAuth: true
});

conexion.connect(err => {
  if (err) {
    console.error("❌ Error de conexión:", err);
    console.log("💡 Sugerencia: Asegúrate de que XAMPP esté ejecutándose y la base de datos 'taller_productos' exista");
  } else {
    console.log("✅ Conexión a MySQL exitosa - Base de datos: taller_productos");
  }
});

module.exports = conexion;
