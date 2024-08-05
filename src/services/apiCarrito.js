import axios from 'axios';

const API_BASE_URL = 'https://localhost:7194/api/CarritoCompras';

export const crearCarrito = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Crear`, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear el carrito:', error);
    throw error;
  }
};

export const obtenerCarritoPorId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener carrito por ID:', error);
    throw error;
  }
};

export const obtenerTodoElCarrito = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener todo el carrito:', error);
    throw error;
  }
};

export const eliminarArticuloDelCarrito = async (carritoSesionId, productoId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/Eliminar/${carritoSesionId}/${productoId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el artículo del carrito:', error);
    throw error;
  }
};
