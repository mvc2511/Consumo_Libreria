import React, { useState, useEffect } from "react";
import { getAutores } from "../services/apiAutor.js"; // Importación de funciones del servicio API de autores
import { Card, CardBody, CardHeader, Table, Row, Col } from "reactstrap"; // Importación de componentes de Reactstrap
import PanelHeader from "components/PanelHeader/PanelHeader.js"; // Importación de un componente personalizado
import { getLibros } from "../services/apiLibro.js"; // Importa la función para obtener libros

function TablaAutores() {
  const [autores, setAutores] = useState([]); // Estado para almacenar la lista de autores
  const [librosConAutores, setLibrosConAutores] = useState([]); // Estado para almacenar los libros con nombres de autores

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataAutores = await getAutores();
        setAutores(dataAutores || []); // Actualizar el estado con la lista de autores obtenida

        const dataLibros = await getLibros();
        setLibrosConAutores(dataLibros || []); // Actualizar el estado con la lista de libros obtenida
      } catch (error) {
        console.error("Error al obtener autores o libros:", error); // Manejo de errores
      }
    };

    fetchData(); // Llamar a la función fetchData al montar el componente
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Manejar casos donde la fecha no está definida

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (1 + date.getMonth()).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${day}/${month}/${year}`; // Formatear la fecha como día/mes/año
  };

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <h4 className="title">Autores</h4>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Fecha de Nacimiento</th>
                      <th>Imagen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {autores.map((autor, index) => (
                      <tr key={index}>
                        <td>{autor.nombre}</td>
                        <td>{autor.apellido}</td>
                        <td>{formatDate(autor.fechaNacimiento)}</td>
                        <td>
                          {autor.imagen ? (
                            <img 
                              src={`data:image/jpeg;base64,${autor.imagen}`} 
                              alt={`Imagen de ${autor.nombre}`} 
                              style={{ width: '100px', height: 'auto' }} 
                            />
                          ) : (
                            <span>Imagen no disponible</span>
                          )}
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
