import React, { useState } from "react";
import { getAutorPorId } from "../service/apiAutor.js"; // Importación de la función getAutorPorId desde el servicio API
import { Card, CardHeader, CardBody, Row, Col, Form, Input, Button } from "reactstrap"; // Importación de componentes de Reactstrap
import PanelHeader from "components/PanelHeader/PanelHeader.js"; // Importación de un componente personalizado

function BuscarAutorId() {
  // Definición de estados para manejar el ID de búsqueda y la información del autor encontrado
  const [searchId, setSearchId] = useState(""); // Estado para el ID de búsqueda
  const [autor, setAutor] = useState(null); // Estado para almacenar la información del autor encontrado
  const [searched, setSearched] = useState(false); // Estado para controlar si se ha realizado una búsqueda

  // Función que se ejecuta al enviar el formulario de búsqueda
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    try {
      // Llamar a la función getAutorPorId del servicio API para obtener la información del autor
      const data = await getAutorPorId(searchId);

      // Formatear la fecha de nacimiento para mostrar solo la fecha sin la hora
      if (data && data.fechaNacimiento) {
        data.fechaNacimiento = new Date(data.fechaNacimiento).toLocaleDateString();
      }

      setAutor(data); // Actualizar el estado con la información del autor encontrado
      setSearched(true); // Indicar que se ha realizado una búsqueda
    } catch (error) {
      // En caso de error, mostrar un mensaje de error y reiniciar la información del autor
      console.error("Error al obtener autor:", error);
      setAutor(null);
      setSearched(true); // Indicar que se ha realizado una búsqueda
    }
  };

  // Renderizado del componente
  return (
    <>
      <PanelHeader size="sm" /> {/* Encabezado del panel */}
      <div className="content">
        <Row>
          <Col md={6}>
            <Card>
              <CardHeader>
                <h5 className="title">Buscar Autor por Id</h5> {/* Título del formulario de búsqueda */}
                <p className="category">Ingresa el ID del autor</p> {/* Descripción del formulario */}
              </CardHeader>
              <CardBody>
                {/* Formulario para buscar un autor por su ID */}
                <Form onSubmit={handleSearch}>
                  <Row>
                    <Col md="8">
                      {/* Campo de entrada para ingresar el ID del autor */}
                      <Input
                        type="text"
                        placeholder="ID del Autor"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md="6">
                      {/* Botón para enviar el formulario de búsqueda */}
                      <Button type="submit" color="primary">Buscar</Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
          {autor && (
            <Col md="6">
              <Card className="card-user">
                <div className="image">
                  {/* Aquí puedes usar una imagen predeterminada o un color de fondo */}
                  {/* <img alt="background" src={"path/to/default/background/image.jpg"} /> */}
                </div>
                <CardBody>
                  <div className="author">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="avatar border-gray"
                        src={autor.imagenes ? `data:image/jpeg;base64,${autor.imagenes}` : "path/to/default/avatar.jpg"}
                        style={{ width: '150px', height: '150px' }} // Estilo en línea para agrandar la imagen
                      />
                      <h5 className="title">{autor.nombre} {autor.apellido}</h5>
                    </a>
                    <p className="description">Fecha de nacimiento: {autor.fechaNacimiento}</p>
                  </div>
                  {/* 
                  <p className="description text-center">
                    "Aquí puedes agregar una cita o una breve descripción del autor."
                  </p>
                  */}
                </CardBody>
                <hr />
                <div className="button-container">
                  <Button
                    className="btn-neutral btn-icon btn-round"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="lg"
                  >
                    <i className="fab fa-facebook-f" />
                  </Button>
                  <Button
                    className="btn-neutral btn-icon btn-round"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="lg"
                  >
                    <i className="fab fa-twitter" />
                  </Button>
                  <Button
                    className="btn-neutral btn-icon btn-round"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="lg"
                  >
                    <i className="fab fa-google-plus-g" />
                  </Button>
                </div>
              </Card>
            </Col>
          )}
          {/* Si no se encuentra ningún autor con el ID proporcionado después de la búsqueda, mostrar un mensaje */}
          {searched && !autor && (
            <Col md={12}>
              <div className="mt-4">
                <p>No se encontró ningún autor con el ID proporcionado.</p>
              </div>
            </Col>
          )}
        </Row>
      </div>
    </>
  );
}

export default BuscarAutorId;
