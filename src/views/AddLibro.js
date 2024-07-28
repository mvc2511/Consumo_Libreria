import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, FormGroup, Form, Input, Row, Col, Button, Alert } from "reactstrap";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import { agregarLibro, getAutores } from "../services/apiLibro.js";

function AgregarLibro() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [fechaPublicacion, setFechaPublicacion] = useState("");
  const [precio, setPrecio] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("success");
  const [autores, setAutores] = useState([]);

  useEffect(() => {
    const fetchAutores = async () => {
      try {
        const respuesta = await getAutores();
        setAutores(respuesta);
      } catch (error) {
        console.error("Error al obtener autores:", error);
      }
    };
    fetchAutores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fechaUtc = new Date(fechaPublicacion).toISOString();
      const nuevoLibro = {
        titulo,
        autor,
        fechaPublicacion: fechaUtc,
        precio: parseFloat(precio)
      };

      console.log('Datos del nuevo libro:', nuevoLibro);

      const respuesta = await agregarLibro(nuevoLibro);

      console.log("Libro agregado:", respuesta);

      setTitulo("");
      setAutor("");
      setFechaPublicacion("");
      setPrecio("");

      setAlertMessage("Libro agregado exitosamente");
      setAlertColor("success");
      setAlertVisible(true);
    } catch (error) {
      console.error("Error al agregar libro:", error);

      setAlertMessage("Error al agregar libro");
      setAlertColor("danger");
      setAlertVisible(true);
    }
  };

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Agregar Libro</h5>
              </CardHeader>
              <CardBody>
                {alertVisible && (
                  <Alert color={alertColor} isOpen={alertVisible} toggle={() => setAlertVisible(false)}>
                    <span>
                      <b>{alertColor === "success" ? "Success - " : "Danger - "}</b>
                      {alertMessage}
                    </span>
                  </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Título</label>
                        <Input
                          value={titulo}
                          onChange={(e) => setTitulo(e.target.value)}
                          placeholder="Título"
                          type="text"
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Autor</label>
                        <Input
                          type="select"
                          value={autor}
                          onChange={(e) => setAutor(e.target.value)}
                          required
                        >
                          <option value="" disabled>Seleccionar Autor</option>
                          {autores.map((autor) => (
                            <option key={autor.autorGuid || autor.nombre} value={autor.nombre}>
                              {autor.nombre}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Fecha de Publicación</label>
                        <Input
                          value={fechaPublicacion}
                          onChange={(e) => setFechaPublicacion(e.target.value)}
                          placeholder="Fecha de Publicación"
                          type="date"
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Precio</label>
                        <Input
                          value={precio}
                          onChange={(e) => setPrecio(e.target.value)}
                          placeholder="Precio"
                          type="number"
                          step="0.01"
                          min="0"
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button type="submit" color="primary">Agregar Libro</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default AgregarLibro;
