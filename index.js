// Importar módulos necesarios
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;


const session = require('express-session');

app.use(session({
  secret: 'mi_secreto_seguro', // Cambia esto por un secreto fuerte
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Usa `true` solo si usas HTTPS
}));


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());
app.use(helmet());

// Configurar carpeta "public" como estática
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestion_empleados',
});

// Verificar conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
  }
  console.log('¡Conexión exitosa a la base de datos!');
});


app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('Todos los campos son obligatorios.');
  }

  // Verificar si el correo ya está registrado
  const querySelect = 'SELECT * FROM users WHERE email = ?';
  connection.query(querySelect, [email], async (err, results) => {
    if (err) {
      console.error('Error al verificar el correo:', err);
      return res.status(500).send('Error interno al verificar el correo.');
    }
    if (results.length > 0) {
      return res.status(400).send('El correo ya está registrado.');
    }

    try {
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertar usuario en la base de datos
      const queryInsert = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      connection.query(queryInsert, [name, email, hashedPassword], (err) => {
        if (err) {
          console.error('Error al registrar usuario:', err);
          return res.status(500).send('Error interno al registrar el usuario.');
        }
        res.send('¡Usuario registrado exitosamente!');
      });
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).send('Error interno al procesar la solicitud.');
    }
  });
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Todos los campos son obligatorios.');
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  connection.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error al buscar el usuario:', err);
      return res.status(500).send('Error interno al buscar el usuario.');
    }

    if (results.length === 0) {
      return res.status(404).send('Correo no registrado.');
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Guardar al usuario en la sesión
      req.session.user = { id: user.id, name: user.name, email: user.email };

      // Redirigir al Dashboard
      res.redirect('/dashboard');
    } else {
      res.status(400).send('Contraseña incorrecta.');
    }
  });
});


app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirige al login si no está autenticado
  }

  // Envía la página del Dashboard si el usuario está autenticado
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});


app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión.');
    }
    res.status(200).send('Sesión cerrada.');
  });
});



// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
