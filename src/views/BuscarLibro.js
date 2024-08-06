import React, { useState } from 'react';
import { getLibroPorId } from '../services/apiLibro.js';
import { Card, CardHeader, CardBody, CardImg, Row, Col, Form, Input, Button } from "reactstrap";
import PanelHeader from "components/PanelHeader/PanelHeader.js";

function BuscarLibroPorGuid() {
  const [searchGuid, setSearchGuid] = useState('');
  const [libro, setLibro] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const data = await getLibroPorId(searchGuid);

      // Formatear la fecha para mostrar solo la fecha sin la hora
      if (data && data.fechaPublicacion) {
        data.fechaPublicacion = new Date(data.fechaPublicacion).toLocaleDateString();
      }

      setLibro(data);
      setSearched(true);
    } catch (error) {
      console.error('Error al obtener libro por GUID:', error);
      setLibro(null);
      setSearched(true);
    }
  };

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col md={6}>
            <Card>
              <CardHeader>
                <h5 className="title">Buscar Libro por ID</h5>
                <p className="category">Ingresa el ID del libro</p>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSearch}>
                  <Row>
                    <Col md="8">
                      <Input
                        type="text"
                        placeholder="ID del Libro"
                        value={searchGuid}
                        onChange={(e) => setSearchGuid(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md="6">
                      <Button type="submit" color="primary">
                        Buscar
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
          {libro && (
            <Col md="6">
              <Card>
                <CardHeader>
                  <h4 className="title">{libro.titulo}</h4>
                </CardHeader>
                <CardImg
                  top
                  width="100%"
                  src={libro.imagenes ? `data:image/jpeg;base64,${libro.imagenes}` : 'placeholder.jpg'}
                  alt={libro.autorNombre}
                  style={{ height: '350px', objectFit: 'cover' }}
                />
                <CardBody>
                  <p>Escrito por: {libro.autorNombre}</p>
                  <p>Fecha de publicacion: {libro.fechaPublicacion}</p>
                  <p>Precio: {libro.precio ? `$${libro.precio.toFixed(2)}` : 'Sin precio'}</p>
                </CardBody>
              </Card>
            </Col>
          )}
          {searched && !libro && (
            <Col md={12}>
              <div className="mt-4">
                <p>No se encontró ningún libro con el GUID proporcionado.</p>
              </div>
            </Col>
          )}
        </Row>
      </div>
    </>
  );
}

export default BuscarLibroPorGuid;
