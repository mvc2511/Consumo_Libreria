import React, { useState, useEffect } from "react";
import { getLibros } from "../services/apiLibro";
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
        const librosData = await getLibros();
        setLibros(librosData);
      } catch (error) {
        console.error("Error al obtener libros:", error);
      }
    };

    fetchLibros();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (1 + date.getMonth()).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${day}/${month}/${year}`;
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
                      <th>Imagen del Autor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {libros.map((libro, index) => (
                      <tr key={index}>
                        <td>{libro.titulo}</td>
                        <td>{formatDate(libro.fechaPublicacion)}</td>
                        <td>{libro.autorNombre ? libro.autorNombre : 'Sin información de autores'}</td>
                        <td>
                          {libro.autorImagen ? (
                            <img src={`data:image/jpeg;base64,${libro.autorImagen}`} alt={libro.autorNombre} style={{ width: '50px', height: 'auto' }} />
                          ) : (
                            'Sin imagen'
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

export default ListBooks;
