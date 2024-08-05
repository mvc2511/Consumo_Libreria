import React, { useState, useEffect, useRef } from "react";
import { getLibros } from "../services/apiLibro";
import { crearCarrito } from "../services/apiCarrito";
import { Row, Col, Card, CardBody, CardImg, CardTitle, CardSubtitle, Button } from "reactstrap";
import NotificationAlert from "react-notification-alert";
import PanelHeader from "components/PanelHeader/PanelHeader.js";

function ListBooks() {
  const [libros, setLibros] = useState([]);
  const notificationAlert = useRef();

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

  const handleAgregarAlCarrito = async (libro) => {
    try {
      if (!libro.libreriaMaterialId) {
        console.error("libreriaMaterialId no está definido para este libro:", libro);
        notify('danger', "Error: No se puede agregar al carrito. Falta información del libro.");
        return;
      }

      // Crear el objeto data con el formato esperado por la API
      const data = {
        fechaCreacionSesion: new Date().toISOString(), // Fecha actual en formato ISO
        productoLista: [libro.libreriaMaterialId.toString()] // Lista de IDs del libro (GUID o libreriaMaterialId)
      };

      await crearCarrito(data);
      notify('success', "Libro agregado al carrito con éxito.");
    } catch (error) {
      console.error("Error al agregar el libro al carrito:", error);
      notify('danger', "Error al agregar el libro al carrito.");
    }
  };

  const notify = (type, message) => {
    const options = {
      place: 'tr', // Top right
      message: <div>{message}</div>,
      type: type,
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 7
    };
    notificationAlert.current.notificationAlert(options);
  };

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <NotificationAlert ref={notificationAlert} />
        <Row>
          {libros.map((libro) => (
            <Col md={4} key={libro.libreriaMaterialId || libro.id || libro.titulo}>
              <Card>
                <CardImg
                  top
                  width="100%"
                  src={libro.autorImagen ? `data:image/jpeg;base64,${libro.autorImagen}` : 'placeholder.jpg'}
                  alt={libro.autorNombre}
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <CardBody>
                  <CardTitle tag="h5">{libro.titulo}</CardTitle>
                  <CardSubtitle tag="h6" className="mb-2 text-muted">
                    {libro.autorNombre || "Autor desconocido"}
                  </CardSubtitle>
                  <p>Precio: {libro.precio ? `$${libro.precio.toFixed(2)}` : 'Sin precio'}</p>
                  <p>Fecha de Publicación: {new Date(libro.fechaPublicacion).toLocaleDateString()}</p>
                  <Button color="primary" onClick={() => handleAgregarAlCarrito(libro)}>Agregar al carrito</Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default ListBooks;
