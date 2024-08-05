import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, CardBody, CardTitle, CardText, Button, Input, Table } from "reactstrap";
import NotificationAlert from "react-notification-alert";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import { obtenerTodoElCarrito, eliminarArticuloDelCarrito } from '../services/apiCarrito';
import { getCuponPorCodigo } from '../services/apiCupones';

const CarritoCompras = () => {
  const [carritos, setCarritos] = useState([]);
  const [cupon, setCupon] = useState('');
  const [descuento, setDescuento] = useState(0);  // Estado para guardar el porcentaje de descuento
  const notificationAlert = useRef();

  useEffect(() => {
    const fetchCarritos = async () => {
      try {
        const data = await obtenerTodoElCarrito();
        const carritosConProductos = data.filter(carrito => carrito.listaDeProductos && carrito.listaDeProductos.length > 0);
        setCarritos(carritosConProductos);
      } catch (error) {
        console.error('Error fetching data:', error);
        notify('danger', 'Error al obtener datos del carrito.');
      }
    };

    fetchCarritos();
  }, []);

  const calcularTotal = (productos) => {
    if (!productos) return 0;
    return productos.reduce((total, producto) => total + (producto.precio || 0), 0);
  };

  const calcularImpuestos = (productos) => {
    if (!productos) return 0;
    return productos.reduce((total, producto) => total + (producto.precio * 0.16 || 0), 0);
  };

  const aplicarCupon = async () => {
    try {
      const cuponData = await getCuponPorCodigo(cupon);
      if (cuponData.isSuccess && cuponData.result && cuponData.result.porcentajeDescuento) {
        const descuentoAplicado = cuponData.result.porcentajeDescuento;
        setDescuento(descuentoAplicado);
        notify('success', `Cupón aplicado con éxito. Descuento: ${descuentoAplicado}%`);
      } else {
        notify('danger', 'Cupón no válido.');
      }
    } catch (error) {
      console.error('Error al aplicar cupón:', error);
      notify('danger', 'Error al aplicar cupón.');
    }
  }; 

  const eliminarArticulo = async (carritoSesionId, productoId) => {
    try {
      await eliminarArticuloDelCarrito(carritoSesionId, productoId);
      const carritoActualizado = carritos.map(carrito => {
        if (carrito.carritoId === carritoSesionId) {
          const productosActualizados = carrito.listaDeProductos.filter(p => p.libroId !== productoId);
          if (productosActualizados.length > 0) {
            return { ...carrito, listaDeProductos: productosActualizados };
          } else {
            return null;
          }
        }
        return carrito;
      }).filter(carrito => carrito !== null);
      setCarritos(carritoActualizado);
      notify('success', 'Artículo eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar artículo:', error);
      notify('danger', 'Error al eliminar artículo.');
    }
  };

  const notify = (type, message) => {
    const options = {
      place: 'tr',
      message: <div>{message}</div>,
      type: type,
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 7
    };
    notificationAlert.current.notificationAlert(options);
  };

  // Cálculos del total con y sin descuento
  const totalSubtotal = carritos.reduce((total, carrito) => total + calcularTotal(carrito.listaDeProductos), 0);
  const totalImpuestos = carritos.reduce((total, carrito) => total + calcularImpuestos(carrito.listaDeProductos), 0);
  const totalConDescuento = totalSubtotal * ((100 - descuento) / 100);  // Aplica el descuento al subtotal
  const totalFinal = totalConDescuento + totalImpuestos;  // Suma los impuestos para obtener el total final

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content" style={{ marginTop: '20px' }}>
        <NotificationAlert ref={notificationAlert} />
        <Row>
          <Col md={8}>
            <h3 className="mb-4">Carrito Registrado</h3>
            {carritos.length > 0 ? (
              carritos.map((carrito) => (
                <Card className="mb-4" key={carrito.carritoId}>
                  <CardBody>
                    {carrito.listaDeProductos.map((producto, index) => (
                      <Row key={producto.libroId + '-' + index} className="mb-2">
                        <Col md={2}>
                          <img src="/path/to/image.jpg" alt={producto.tituloLibro} width="100%" />
                        </Col>
                        <Col md={6}>
                          <CardTitle tag="h5">{producto.tituloLibro}</CardTitle>
                          <CardText>Género: {producto.genero}</CardText>
                          <CardText>Fecha de Publicación: {new Date(producto.fechaPublicacion).toLocaleDateString()}</CardText>
                        </Col>
                        <Col md={2} className="text-right">
                          <CardText className="text-success">${producto.precio ? producto.precio.toFixed(2) : 'Sin precio'}</CardText>
                        </Col>
                        <Col md={2} className="text-right">
                          <Button color="danger" size="sm" onClick={() => eliminarArticulo(carrito.carritoId, producto.libroId)}>Eliminar</Button>
                        </Col>
                      </Row>
                    ))}
                  </CardBody>
                </Card>
              ))
            ) : (
              <Card className="mb-4">
                <CardBody>
                  <CardText>No hay carritos con productos seleccionados.</CardText>
                </CardBody>
              </Card>
            )}
          </Col>
          <Col md={4}>
            <h3 className="mb-4">Detalle del Pedido</h3>
            <Card>
              <CardBody>
                <Table borderless>
                  <tbody>
                    <tr>
                      <th>Cantidad:</th>
                      <td>{carritos.reduce((total, carrito) => total + carrito.listaDeProductos.length, 0)}</td>
                    </tr>
                    <tr>
                      <th>Subtotal:</th>
                      <td>${totalSubtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th>Descuento:</th>
                      <td>{descuento}%</td>
                    </tr>
                    <tr>
                      <th>Impuestos:</th>
                      <td>${totalImpuestos.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th>Total:</th>
                      <td>${totalFinal.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </Table>
                <Button color="primary" block>Comprar</Button>
              </CardBody>
            </Card>
            <Card className="mt-4">
              <CardBody>
                <Input type="text" value={cupon} onChange={(e) => setCupon(e.target.value)} placeholder="Ingrese código de cupón" />
                <Button color="primary" block className="mt-3" onClick={aplicarCupon}>Aplicar Cupón</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CarritoCompras;
