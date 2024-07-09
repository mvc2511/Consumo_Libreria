// apiLibro.js - Servicio API
import axios from 'axios';

const API_LIBRO_URL = 'https://localhost:7225/api/LibroMaterial';
const API_AUTOR_URL = 'https://localhost:7114/api/Autor';

// Obtener todos los libros con nombres de autores
export const getLibros = async () => {
  try {
    // Obtener la lista de libros
    const responseLibros = await axios.get(API_LIBRO_URL);
    const libros = responseLibros.data;

    // Obtener la lista completa de autores
    const autores = await getAutores();

    // Crear un diccionario de autores por GUID para facilitar la búsqueda
    const autoresDic = {};
    autores.forEach(autor => {
      autoresDic[autor.autorLibroGuid] = `${autor.nombre} ${autor.apellido}`;
    });

    // Reemplazar los GUIDs de autores en los libros con los nombres correspondientes
    const librosConNombresDeAutores = libros.map(libro => {
      return {
        ...libro,
        autorNombre: autoresDic[libro.autorLibro] || 'Autor desconocido'
      };
    });

    return librosConNombresDeAutores;
  } catch (error) {
    console.error('Error al obtener libros o autores:', error);
    throw error;
  }
};



// Obtener un libro por GUID (POST)
export const getLibroPorId = async (guid) => {
  try {
    const response = await axios.post(`${API_LIBRO_URL}/id?id=${guid}`, null, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const libro = response.data;

    // Obtener la información del autor correspondiente
    const autorResponse = await axios.get(`${API_AUTOR_URL}/${libro.autorLibro}`);
    const autor = autorResponse.data;

    // Combinar la información del libro y del autor
    const libroConAutor = {
      ...libro,
      autorNombre: `${autor.nombre} ${autor.apellido}`,
    };

    return libroConAutor;
  } catch (error) {
    console.error('Error al obtener libro por GUID:', error);
    throw error;
  }
};



// Agregar un nuevo libro (POST)
export const agregarLibro = async (nuevoLibro) => {
  try {
    // Obtener la lista completa de autores
    const autores = await getAutores();

    // Encontrar el autor que coincida con el nombre seleccionado
    const autorEncontrado = autores.find(autor => autor.nombre === nuevoLibro.autor);

    if (!autorEncontrado) {
      throw new Error('No se encontró el autor especificado');
    }

    // Construir el objeto a enviar con el GUID correcto del autor
    const libroParaEnviar = {
      titulo: nuevoLibro.titulo,
      fechaPublicacion: nuevoLibro.fechaPublicacion,
      autorLibro: autorEncontrado.autorLibroGuid, // Aquí debe ser el GUID del autor en el campo autorLibro
    };

    console.log('Datos a enviar:', libroParaEnviar);

    // Enviar la solicitud POST con el objeto modificado
    const response = await axios.post(API_LIBRO_URL, libroParaEnviar, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al agregar libro:', error);
    throw error;
  }
};



// Obtener todos los autores
export const getAutores = async () => {
  try {
    const response = await axios.get(API_AUTOR_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener autores:', error);
    throw error;
  }
};
