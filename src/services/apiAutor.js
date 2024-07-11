import axios from 'axios'; 

const API_URL = 'https://localhost:7114/api/Autor'; // URL base de la API para interactuar con la entidad Autor

// Función asincrónica para obtener la lista de autores
export const getAutores = async () => {
  try {
    const response = await axios.get(API_URL); // Realizar una solicitud GET para obtener la lista de autores
    return response.data; // Devolver los datos de la respuesta
  } catch (error) {
    console.error('Error al obtener autores:', error); // Manejar errores en caso de fallo
    throw error; 
  }
};

// Función asincrónica para obtener un autor por su ID
export const getAutorPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`); // Realizar una solicitud GET para obtener un autor específico por su ID
    return response.data; // Devolver los datos de la respuesta
  } catch (error) {
    console.error('Error al obtener autor por ID:', error); // Manejar errores en caso de fallo
    throw error; 
  }
};

// Función asincrónica para agregar un nuevo autor
export const agregarAutor = async (nuevoAutor, imagen) => {
  try {
    const formData = new FormData(); // Crear un objeto FormData para enviar datos de formulario
    formData.append('nombre', nuevoAutor.nombre); // Agregar el nombre del nuevo autor al formulario
    formData.append('apellido', nuevoAutor.apellido); // Agregar el apellido del nuevo autor al formulario
    formData.append('fechaNacimiento', nuevoAutor.fechaNacimiento); // Agregar la fecha de nacimiento del nuevo autor al formulario
    formData.append('imagen', imagen); // Agregar la imagen del nuevo autor al formulario

    const response = await axios.post(API_URL, formData, { // Realizar una solicitud POST para agregar un nuevo autor
      headers: {
        'Content-Type': 'multipart/form-data' // Especificar el tipo de contenido como 'multipart/form-data' para el envío de archivos
      }
    });
    return response.data; // Devolver los datos de la respuesta
  } catch (error) {
    console.error('Error al agregar autor:', error); // Manejar errores en caso de fallo
    throw error;
  }
};
