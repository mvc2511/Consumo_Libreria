import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, CardBody, CardTitle, CardText, Button, Input, Table } from "reactstrap";
import NotificationAlert from "react-notification-alert";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import { obtenerTodoElCarrito, eliminarArticuloDelCarrito } from '../services/apiCarrito';
import { getCuponPorCodigo, getCupones } from '../services/apiCupones';
import { getAutores } from '../services/apiAutor';

const CarritoCompras = () => {
  const [carritos, setCarritos] = useState([]);
  const [cupon, setCupon] = useState('');
  const [descuento, setDescuento] = useState(0);
  const [autores, setAutores] = useState({});
  const notificationAlert = useRef();
  const [cuponesValidos, setCuponesValidos] = useState([]);

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

    const fetchAutores = async () => {
      try {
        const autoresData = await getAutores();
        const autoresDic = {};
        autoresData.forEach(autor => {
          autoresDic[autor.autorLibroGuid] = `${autor.nombre} ${autor.apellido}`;
        });
        setAutores(autoresDic);
      } catch (error) {
        console.error('Error al obtener autores:', error);
        notify('danger', 'Error al obtener datos de los autores.');
      }
    };

    const fetchCupones = async () => {
      try {
        const response = await getCupones();
        if (response.isSuccess) {
          const cuponesActivos = response.result.filter(cupon => new Date(cupon.fechaFin) > new Date());
          setCuponesValidos(cuponesActivos);
        } else {
          console.error('Error al obtener cupones:', response.message);
          notify('danger', 'Error al obtener cupones.');
        }
      } catch (error) {
        console.error('Error al obtener cupones:', error);
        notify('danger', 'Error al obtener cupones.');
      }
    };

    fetchCupones();
    fetchCarritos();
    fetchAutores();
  }, []);

  const agruparProductos = (productos) => {
    const productosAgrupados = {};
    productos.forEach((producto) => {
      if (productosAgrupados[producto.libroId]) {
        productosAgrupados[producto.libroId].cantidad += 1;
      } else {
        productosAgrupados[producto.libroId] = { ...producto, cantidad: 1 };
      }
    });
    return Object.values(productosAgrupados);
  };

  const calcularTotal = (productos) => {
    if (!productos) return 0;
    return productos.reduce((total, producto) => total + (producto.precio || 0) * (producto.cantidad || 1), 0);
  };

  const calcularImpuestos = (productos) => {
    if (!productos) return 0;
    return productos.reduce((total, producto) => total + (producto.precio * (producto.cantidad || 1) * 0.16 || 0), 0);
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

  const productosAgrupados = agruparProductos(
    carritos.flatMap((carrito) => carrito.listaDeProductos)
  );
  const totalCantidad = productosAgrupados.reduce((acc, prod) => acc + prod.cantidad, 0);
  const subtotal = calcularTotal(productosAgrupados);
  const totalImpuestos = calcularImpuestos(productosAgrupados);
  const totalConImpuestos = subtotal + totalImpuestos;
  const totalConDescuento = totalConImpuestos * ((100 - descuento) / 100);

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content" style={{ marginTop: '20px' }}>
        <NotificationAlert ref={notificationAlert} />
        <Row>
          <Col md={8}>
            <h3 className="mb-4">Carrito Registrado</h3>
            {productosAgrupados.length > 0 ? (
              productosAgrupados.map((producto) => {
                const carrito = carritos.find(c => c.listaDeProductos.some(p => p.libroId === producto.libroId));
                return (
                  <Card className="mb-4" key={producto.libroId}>
                    <CardBody>
                      <Row>
                        <Col md={2}>
                          <img
                            src={producto.imagenes ? `data:image/jpeg;base64,${producto.imagenes}` : 'placeholder.jpg'}
                            alt={producto.tituloLibro}
                            style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                          />
                        </Col>
                        <Col md={6}>
                          <CardTitle tag="h5">{producto.tituloLibro}</CardTitle>
                          <CardText>Autor: {autores[producto.autorLibro] || "Autor desconocido"}</CardText>
                          <CardText>Fecha de Publicación: {new Date(producto.fechaPublicacion).toLocaleDateString()}</CardText>
                          <CardText>Cantidad: {producto.cantidad}</CardText>
                        </Col>
                        <Col md={2} className="text-right">
                          <CardText className="text-success">${(producto.precio * producto.cantidad).toFixed(2)}</CardText>
                        </Col>
                        <Col md={2} className="text-right">
                          <Button color="danger" size="sm" onClick={() => eliminarArticulo(carrito.carritoId, producto.libroId)}>Eliminar</Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                )
              })
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
                      <td>{totalCantidad}</td>
                    </tr>
                    <tr>
                      <th>Subtotal:</th>
                      <td>${subtotal.toFixed(2)}</td>
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
                      <td>${totalConImpuestos.toFixed(2)}</td>
                    </tr>
                    {descuento > 0 && (
                      <tr>
                        <th>Total con Descuento:</th>
                        <td>${totalConDescuento.toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <Button color="primary" block>Finalizar Compra</Button>
              </CardBody>
            </Card>
            <Card className="mt-4">
              <CardBody>
                <Input
                  type="text"
                  placeholder="Código de cupón"
                  value={cupon}
                  onChange={(e) => setCupon(e.target.value)}
                />
                <Button color="success" block onClick={aplicarCupon}>Aplicar Cupón</Button>
              </CardBody>
            </Card>
            <Card className="mt-4">
              <CardBody>
                <h5>Cupones Disponibles</h5>
                <Table borderless>
                  <tbody>
                    <tr>
                      <th>Código</th>
                      <th>Descuento (%)</th>
                    </tr>
                    {cuponesValidos.length > 0 ? (
                      cuponesValidos.map((cupon, indexC) => (
                        <tr key={indexC}>
                          <td>{cupon.cuponCode}</td>
                          <td>{cupon.porcentajeDescuento}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">No hay cupones disponibles.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CarritoCompras;
