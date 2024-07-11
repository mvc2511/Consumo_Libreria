import React, { useState, useEffect } from "react";
import { getAutores } from "../services/apiAutor.js"; // Importación de funciones del servicio API de autores
import { Card, CardBody, CardHeader, Table, Row, Col } from "reactstrap"; // Importación de componentes de Reactstrap
import PanelHeader from "components/PanelHeader/PanelHeader.js"; // Importación de un componente personalizado
import { getLibros } from "../services/apiLibro.js"; // Importa la función para obtener libros

function TablaAutores() {
  const [autores, setAutores] = useState([]); // Estado para almacenar la lista de autores
  const [librosConAutores, setLibrosConAutores] = useState([]); // Estado para almacenar los libros con nombres de autores

  useEffect(() => {
    // Efecto de lado para cargar la lista de autores al cargar el componente
    const fetchData = async () => {
      try {
        // Obtener la lista de autores usando la función getAutores del servicio API
        const dataAutores = await getAutores();
        setAutores(dataAutores); // Actualizar el estado con la lista de autores obtenida

        // Obtener la lista de libros con nombres de autores usando la función getLibros del servicio API
        const dataLibros = await getLibros();
        setLibrosConAutores(dataLibros); // Actualizar el estado con la lista de libros obtenida
      } catch (error) {
        console.error("Error al obtener autores o libros:", error); // Manejo de errores si falla la obtención de autores o libros
      }
    };

    fetchData(); // Llamar a la función fetchData al montar el componente
  }, []);

  // Función para formatear la fecha y mostrarla sin la hora
  const formatDate = (dateString) => {
    if (!dateString) return ""; // Manejar casos donde la fecha no está definida

    const date = new Date(dateString); // Crear un objeto de fecha desde la cadena de fecha
    const year = date.getFullYear(); // Obtener el año
    const month = (1 + date.getMonth()).toString().padStart(2, "0"); // Obtener el mes y formatearlo
    const day = date.getDate().toString().padStart(2, "0"); // Obtener el día y formatearlo

    return `${day}/${month}/${year}`; // Formatear la fecha como día/mes/año
  };

  // Renderizado del componente
  return (
    <>
      <PanelHeader size="sm" /> {/* Encabezado del panel */}
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <h4 className="title">Autores</h4>
              </CardHeader>
              <CardBody>
                {/* Tabla para mostrar la lista de autores */}
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Nombre</th> {/* Encabezado de columna para el nombre del autor */}
                      <th>Apellido</th> {/* Encabezado de columna para el apellido del autor */}
                      <th>Fecha de Nacimiento</th> {/* Encabezado de columna para la fecha de nacimiento del autor */}
                      <th>Imagen</th> {/* Encabezado de columna para la imagen del autor */}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mapeo de la lista de autores para mostrar cada autor en una fila */}
                    {autores.map((autor, index) => (
                      <tr key={index}>
                        <td>{autor.nombre}</td> {/* Celda con el nombre del autor */}
                        <td>{autor.apellido}</td> {/* Celda con el apellido del autor */}
                        <td>{formatDate(autor.fechaNacimiento)}</td> {/* Celda con la fecha de nacimiento del autor */}
                        <td>
                          {/* Celda con la imagen del autor */}
                          <img src={`data:image/jpeg;base64,${autor.imagen}`} alt={`Imagen de ${autor.nombre}`} style={{ width: '100px', height: 'auto' }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default TablaAutores;
