import axios from 'axios';

const API_LIBRO_URL = 'https://localhost:7225/api/LibroMaterial';
const API_AUTOR_URL = 'https://localhost:7114/api/Autor';

export const getLibros = async () => {
  try {
    const responseLibros = await axios.get(API_LIBRO_URL);
    const libros = responseLibros.data;

    const autores = await getAutores();

    const autoresDic = {};
    autores.forEach(autor => {
      autoresDic[autor.autorLibroGuid] = {
        nombre: `${autor.nombre} ${autor.apellido}`,
      };
    });

    const librosConNombresDeAutores = libros.map(libro => {
      const autor = autoresDic[libro.autorLibro] || { nombre: 'Autor desconocido'};
      return {
        ...libro,
        autorNombre: autor.nombre
      };
    });

    return librosConNombresDeAutores;
  } catch (error) {
    console.error('Error al obtener libros o autores:', error);
    throw error;
  }
};

export const getLibroPorId = async (guid) => {
  try {
    const response = await axios.get(`${API_LIBRO_URL}/id?id=${guid}`, null, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const libro = response.data;

    const autorResponse = await axios.get(`${API_AUTOR_URL}/${libro.autorLibro}`);
    const autor = autorResponse.data;

    const libroConAutor = {
      ...libro,
      autorNombre: `${autor.nombre} ${autor.apellido}`
    };

    return libroConAutor;
  } catch (error) {
    console.error('Error al obtener libro por GUID:', error);
    throw error;
  }
};

export const agregarLibro = async (nuevoLibro, imagen) => {
  try {
    const autores = await getAutores();

    const autorEncontrado = autores.find(autor => `${autor.nombre} ${autor.apellido}` === nuevoLibro.autor);

    if (!autorEncontrado) {
      throw new Error('No se encontró el autor especificado');
    }

    const libroParaEnviar = new FormData();
    libroParaEnviar.append('titulo', nuevoLibro.titulo);
    libroParaEnviar.append('fechaPublicacion', nuevoLibro.fechaPublicacion);
    libroParaEnviar.append('autorLibro', autorEncontrado.autorLibroGuid);
    libroParaEnviar.append('precio', nuevoLibro.precio);
    if (imagen) {
      libroParaEnviar.append('imagen', imagen);
    }

    const response = await axios.post(API_LIBRO_URL, libroParaEnviar, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error al agregar libro:', error);
    throw error;
  }
};

export const getAutores = async () => {
  try {
    const response = await axios.get(API_AUTOR_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener autores:', error);
    throw error;
  }
};
