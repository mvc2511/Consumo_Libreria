import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, FormGroup, Form, Input, Row, Col, Button, Alert } from "reactstrap";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import { agregarLibro, getAutores } from "../services/apiLibro.js";

function AgregarLibro() {
  // Estados para manejar los datos del formulario y alertas
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");  // Estado para almacenar el nombre del autor seleccionado
  const [fechaPublicacion, setFechaPublicacion] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("success");
  const [autores, setAutores] = useState([]);  // Estado para almacenar la lista de autores obtenidos

  // Efecto para cargar la lista de autores al cargar el componente
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
  }, []);  // El array vacío asegura que se llame solo una vez al montar el componente

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convertir la fecha de publicación a formato UTC antes de enviarla al backend
      const fechaUtc = new Date(fechaPublicacion).toISOString();

      // Construir el objeto con los datos del nuevo libro
      const nuevoLibro = {
        titulo,
        autor,  // Utiliza `autor` para el nombre del autor seleccionado
        fechaPublicacion: fechaUtc  // Envía la fecha en formato UTC
      };

      console.log('Datos del nuevo libro:', nuevoLibro);

      // Llamar a la función para agregar el libro, que está definida en `apiLibro.js`
      const respuesta = await agregarLibro(nuevoLibro);

      console.log("Libro agregado:", respuesta);

      // Limpiar los campos del formulario después de agregar el libro con éxito
      setTitulo("");
      setAutor("");  // Limpiar el estado del nombre del autor después de enviar el formulario
      setFechaPublicacion("");

      // Mostrar una alerta de éxito al usuario
      setAlertMessage("Libro agregado exitosamente");
      setAlertColor("success");
      setAlertVisible(true);
    } catch (error) {
      console.error("Error al agregar libro:", error);

      // Mostrar una alerta de error al usuario
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
                {/* Mostrar la alerta si `alertVisible` es true */}
                {alertVisible && (
                  <Alert color={alertColor} isOpen={alertVisible} toggle={() => setAlertVisible(false)}>
                    <span>
                      <b>{alertColor === "success" ? "Success - " : "Danger - "}</b>
                      {alertMessage}
                    </span>
                  </Alert>
                )}
                {/* Formulario para agregar un libro */}
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
                          value={autor}  // Utiliza `autor` para el nombre del autor seleccionado
                          onChange={(e) => setAutor(e.target.value)}  // Actualiza `autor` con el nombre seleccionado
                          required
                        >
                          <option value="" disabled>Seleccionar Autor</option>
                          {/* Iterar sobre la lista de autores y crear opciones */}
                          {autores.map((autor) => (
                            <option key={autor.autorGuid} value={autor.nombre}>
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
                  {/* Botón para enviar el formulario */}
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
