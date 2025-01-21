document.querySelector('#registerForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que la página se recargue
  
    // Obtener valores del formulario
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
  
    // Enviar datos al servidor
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (response.ok) {
        const data = await response.text();
        alert(data); // Muestra el mensaje del servidor
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error('Error al enviar datos:', error);
      alert('Ocurrió un error al registrar el usuario.');
    }
  });

  
  document.querySelector('#loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que la página se recargue
  
    // Obtener los datos del formulario
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
  
    // Enviar datos al servidor
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.text();
        alert(data); // Mostrar mensaje de éxito
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Ocurrió un error al intentar iniciar sesión.');
    }
  });
  