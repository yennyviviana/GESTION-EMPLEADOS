const mysql = require('mysql2');

// Crea una conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',  // O la IP del servidor si no estás usando localhost
  user: 'usuario',    // El usuario que creaste o root si usas ese
  password: 'contraseña',  // La contraseña que asignaste al usuario
  database: 'gestion_empleados'  // El nombre de la base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos como id ' + connection.threadId);
});

module.exports = connection;  // Exportamos la conexión para usarla en otras partes del proyecto
