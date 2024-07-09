import React, { useState, useEffect } from "react";
import { getLibros } from "../service/apiLibro"; // Importa la función para obtener libros
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Table,
} from "reactstrap";
import PanelHeader from "components/PanelHeader/PanelHeader.js";

function ListBooks() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const librosData = await getLibros(); // Obtener la lista de libros
        setLibros(librosData); // Actualizar el estado con la lista de libros obtenida
      } catch (error) {
        console.error("Error al obtener libros:", error);
      }
    };

    fetchLibros();
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

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <h4 className="title">Libros</h4>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Título</th>
                      <th>Fecha de Publicación</th>
                      <th>Autor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {libros.map((libro, index) => (
                      <tr key={index}>
                        <td>{libro.titulo}</td>
                        <td>{formatDate(libro.fechaPublicacion)}</td> {/* Aplicar formatDate para mostrar solo la fecha */}
                        <td>{libro.autorNombre ? libro.autorNombre : 'Sin información de autores'}</td> {/* Mostrar el nombre del autor */}
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

export default ListBooks;
