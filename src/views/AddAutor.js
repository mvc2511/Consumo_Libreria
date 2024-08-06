import React, { useState } from "react";
import { Card, CardHeader, CardBody, FormGroup, Form, Input, Row, Col, Button, Alert } from "reactstrap"; // Importación de componentes de Reactstrap
import PanelHeader from "components/PanelHeader/PanelHeader.js"; // Importación de un componente personalizado
import { agregarAutor } from "../services/apiAutor.js"; // Importación de la función agregarAutor desde el servicio API

function User() {
  // Definición de estados para manejar el formulario y mensajes de alerta
  const [nombre, setNombre] = useState(""); // Estado para el nombre del autor
  const [apellido, setApellido] = useState(""); // Estado para el apellido del autor
  const [fechaNacimiento, setFechaNacimiento] = useState(""); // Estado para la fecha de nacimiento del autor
  const [imagen, setImagen] = useState(null); // Estado para la imagen del autor
  const [imagenPreview, setImagenPreview] = useState(null); // Estado para la vista previa de la imagen
  const [alertVisible, setAlertVisible] = useState(false); // Estado para la visibilidad de la alerta
  const [alertMessage, setAlertMessage] = useState(""); // Estado para el mensaje de la alerta
  const [alertColor, setAlertColor] = useState("success"); // Estado para el color de la alerta

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    try {
      // Crear un objeto con los datos del nuevo autor
      const nuevoAutor = { nombre, apellido, fechaNacimiento };
      // Llamar a la función agregarAutor del servicio API para agregar el nuevo autor
      const respuesta = await agregarAutor(nuevoAutor, imagen);

      //console.log("Autor agregado:", respuesta);

      // Reiniciar los valores del formulario y mostrar un mensaje de éxito
      setNombre("");
      setApellido("");
      setFechaNacimiento("");
      setImagen(null);
      setImagenPreview(null);

      setAlertMessage("Autor agregado exitosamente");
      setAlertColor("success");
      setAlertVisible(true);
    } catch (error) {
      // En caso de error, mostrar un mensaje de error
      console.error("Error al agregar autor:", error);

      setAlertMessage("Error al agregar autor");
      setAlertColor("danger");
      setAlertVisible(true);
    }
  };

  // Función que se ejecuta al cambiar la imagen seleccionada
  const handleImagenChange = (e) => {
    const selectedImagen = e.target.files[0]; // Obtener la imagen seleccionada
    setImagen(selectedImagen); // Actualizar el estado de la imagen

    // Crear un objeto FileReader para leer la imagen y mostrar una vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenPreview(reader.result); // Actualizar el estado de la vista previa de la imagen
    };
    reader.readAsDataURL(selectedImagen); // Leer la imagen como una URL de datos
  };

  // Renderizado del componente
  return (
    <>
      <PanelHeader size="sm" /> {/* Encabezado del panel */}
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Agregar Autor</h5> {/* Título del formulario */}
              </CardHeader>
              <CardBody>
                {/* Alerta para mostrar mensajes de éxito o error */}
                {alertVisible && (
                  <Alert color={alertColor} isOpen={alertVisible} toggle={() => setAlertVisible(false)}>
                    <span>
                      <b>{alertColor === "success" ? "Success - " : "Danger - "}</b>
                      {alertMessage}
                    </span>
                  </Alert>
                )}
                {/* Formulario para agregar un nuevo autor */}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    {/* Campo para ingresar el nombre del autor */}
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Nombre</label>
                        <Input
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          placeholder="Nombre"
                          type="text"
                          required
                        />
                      </FormGroup>
                    </Col>
                    {/* Campo para ingresar el apellido del autor */}
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Apellido</label>
                        <Input
                          value={apellido}
                          onChange={(e) => setApellido(e.target.value)}
                          placeholder="Apellido"
                          type="text"
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* Campo para ingresar la fecha de nacimiento del autor */}
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Fecha de Nacimiento</label>
                        <Input
                          value={fechaNacimiento}
                          onChange={(e) => setFechaNacimiento(e.target.value)}
                          placeholder="Fecha de Nacimiento"
                          type="date"
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* Campo para seleccionar una imagen */}
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Imagen</label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImagenChange}
                          required
                        />
                      </FormGroup>
                      {/* Vista previa de la imagen seleccionada */}
                      {imagenPreview && (
                        <img src={imagenPreview} alt="Vista previa de la imagen" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                      )}
                    </Col>
                  </Row>
                  {/* Botón para enviar el formulario */}
                  <Button type="submit" color="primary">Agregar Autor</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default User;
