import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, FormGroup, Form, Input, Row, Col, Button, Alert } from 'reactstrap';
import PanelHeader from 'components/PanelHeader/PanelHeader';
import { getCuponPorId, actualizarCupon } from '../services/apiCupones';
import { Link, useParams, useNavigate } from 'react-router-dom';

function EditarCupon() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [cupon, setCupon] = useState({
        cuponId: '',
        cuponCode: '',
        porcentajeDescuento: '',
        descuentoMinimo: ''
    });

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertColor, setAlertColor] = useState('success');

    useEffect(() => {
        const fetchCupon = async () => {
            try {
                const cuponData = await getCuponPorId(id);
                if (cuponData && cuponData.result && cuponData.result.cuponId) {
                    const { cuponId, cuponCode, porcentajeDescuento, descuentoMinimo } = cuponData.result;
                    setCupon({
                        cuponId,
                        cuponCode: cuponCode || '',
                        porcentajeDescuento: porcentajeDescuento || '',
                        descuentoMinimo: descuentoMinimo || ''
                    });
                } else {
                    throw new Error('El cupón no existe o los datos son inválidos');
                }
            } catch (error) {
                console.error('Error al obtener cupón:', error);
                setAlertMessage('Error al cargar los datos del cupón');
                setAlertColor('danger');
                setAlertVisible(true);
            }
        };

        fetchCupon();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const respuesta = await actualizarCupon(cupon);
            console.log('Cupón actualizado:', respuesta);

            setAlertMessage('Cupón actualizado exitosamente');
            setAlertColor('success');
            setAlertVisible(true);

            setTimeout(() => {
                navigate('/admin/lista-cupones');
            }, 2000);
        } catch (error) {
            console.error('Error al actualizar cupón:', error);

            setAlertMessage('Error al actualizar cupón');
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
                                        <h5 className="title">Editar Cupón</h5>
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
                                    <FormGroup>
                                        <label>ID del Cupón</label>
                                        <Input
                                            value={cupon.cuponId}
                                            readOnly
                                            disabled
                                        />
                                    </FormGroup>
                                    <Row>
                                        <Col className="pr-1" md="6">
                                            <FormGroup>
                                                <label>Código</label>
                                                <Input
                                                    value={cupon.cuponCode}
                                                    onChange={(e) => setCupon({ ...cupon, cuponCode: e.target.value })}
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
                                                    value={cupon.porcentajeDescuento}
                                                    onChange={(e) => setCupon({ ...cupon, porcentajeDescuento: e.target.value })}
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
                                                    value={cupon.descuentoMinimo}
                                                    onChange={(e) => setCupon({ ...cupon, descuentoMinimo: e.target.value })}
                                                    placeholder="Descuento Mínimo"
                                                    type="number"
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Button type="submit" color="primary">
                                        Actualizar Cupón
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

export default EditarCupon;
