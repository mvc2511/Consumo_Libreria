import React, { useState } from 'react';
import { Card, CardHeader, CardBody, FormGroup, Form, Input, Row, Col, Button, Alert } from 'reactstrap';
import PanelHeader from 'components/PanelHeader/PanelHeader';
import { agregarCupon } from '../services/apiCupones';
import { Link } from 'react-router-dom';

function AgregarCupon() {
  const [codigo, setCodigo] = useState('');
  const [porcentajeDescuento, setPorcentajeDescuento] = useState('');
  const [descuentoMinimo, setDescuentoMinimo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const nuevoCupon = {
        cuponCode: codigo,
        porcentajeDescuento,
        descuentoMinimo,
        fechaInicio,
        fechaFin
      };

      const respuesta = await agregarCupon(nuevoCupon);
      console.log('Cupón agregado:', respuesta);

      setCodigo('');
      setPorcentajeDescuento('');
      setDescuentoMinimo('');
      setFechaInicio('');
      setFechaFin('');

      setAlertMessage('Cupón agregado exitosamente');
      setAlertColor('success');
      setAlertVisible(true);
    } catch (error) {
      console.error('Error al agregar cupón:', error);

      setAlertMessage('Error al agregar cupón');
      setAlertColor('danger');
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
                <Row>
                  <Col>
                    <h5 className="title">Agregar Cupón</h5>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Link to="/admin/lista-cupones">
                      <Button color="secondary" className="btn-round btn-sm">
                        Regresar a la lista
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {alertVisible && (
                  <Alert color={alertColor} isOpen={alertVisible} toggle={() => setAlertVisible(false)}>
                    <span>
                      <b>{alertColor === 'success' ? 'Éxito - ' : 'Error - '}</b>
                      {alertMessage}
                    </span>
                  </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Código</label>
                        <Input
                          value={codigo}
                          onChange={(e) => setCodigo(e.target.value)}
                          placeholder="Código"
                          type="text"
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Porcentaje de Descuento</label>
                        <Input
                          value={porcentajeDescuento}
                          onChange={(e) => setPorcentajeDescuento(e.target.value)}
                          placeholder="Porcentaje de Descuento"
                          type="number"
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Descuento Mínimo</label>
                        <Input
                          value={descuentoMinimo}
                          onChange={(e) => setDescuentoMinimo(e.target.value)}
                          placeholder="Descuento Mínimo"
                          type="number"
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Fecha de Inicio</label>
                        <Input
                          value={fechaInicio}
                          onChange={(e) => setFechaInicio(e.target.value)}
                          placeholder="Fecha de Inicio"
                          type="date"
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Fecha de Fin</label>
                        <Input
                          value={fechaFin}
                          onChange={(e) => setFechaFin(e.target.value)}
                          placeholder="Fecha de Fin"
                          type="date"
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button type="submit" color="primary">
                    Agregar Cupón
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default AgregarCupon;
