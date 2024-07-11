import axios from 'axios';

const API_URL = 'https://localhost:7075/api/Cupones';

// Función asincrónica para obtener la lista de cupones
export const getCupones = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // Devuelve los datos obtenidos desde la API
    } catch (error) {
        console.error('Error al obtener cupones:', error);
        throw error; // Propaga el error para manejarlo en el componente que llama a getCupones
    }
};

// Función asincrónica para obtener un cupón por su ID
export const getCuponPorId = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/id:int?id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener cupón por ID:', error);
        throw error;
    }
};

// Función asincrónica para obtener un cupón por su código
export const getCuponPorCodigo = async (codigo) => {
    try {
        const response = await axios.get(`${API_URL}/getbycode/${codigo}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener cupón por código:', error);
        throw error;
    }
};

// Función asincrónica para agregar un nuevo cupón
export const agregarCupon = async (nuevoCupon) => {
    try {
        const response = await axios.post(API_URL, nuevoCupon, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al agregar cupón:', error);
        throw error;
    }
};

// Función asincrónica para actualizar un cupón existente
export const actualizarCupon = async (cuponActualizado) => {
    try {
        const response = await axios.put(API_URL, cuponActualizado, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar cupón:', error);
        throw error;
    }
};
