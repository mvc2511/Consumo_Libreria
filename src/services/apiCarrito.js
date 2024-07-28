import axios from 'axios';

const API_CARRITO_URL = 'https://localhost:7194/api/CarritoCompras';

export const obtenerCarrito = async (carritoId) => {
  try {
    const response = await axios.get(`${API_CARRITO_URL}/${carritoId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    throw error;
  }
};


export const agregarAlCarrito = async (libro) => {
  try {
    // Serializa los datos del libro a una cadena JSON
    const libroComoCadena = JSON.stringify({
      libroId: libro.libreriaMaterialId,
      tituloLibro: libro.titulo,
      autorLibro: libro.autorNombre,
      fechaPublicacion: libro.fechaPublicacion,
      precio: libro.precio
    });

    // Envía la cadena dentro de la lista productoLista
    const response = await axios.post(API_CARRITO_URL, {
      fechaCreacionSesion: new Date().toISOString(),
      productoLista: [libroComoCadena]
    });

    return response.data;
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    throw error;
  }
};
