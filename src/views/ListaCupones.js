import React, { useState, useEffect } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Table,
    Row,
    Col,
    Spinner,
    Input,
    InputGroup,
    InputGroupAddon,
    Button,
    Form,
    Alert // Importa Alert de reactstrap para mostrar mensajes de error
} from 'reactstrap';
import PanelHeader from 'components/PanelHeader/PanelHeader';
import { Link } from 'react-router-dom';
import { getCupones, getCuponPorId, getCuponPorCodigo } from '../services/apiCupones';

function TablaCupones() {
    const [cupones, setCupones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCupones();
                if (response.isSuccess) {
                    setCupones(response.result);
                } else {
                    setError('Error al obtener cupones: ' + response.message);
                }
                setLoading(false);
            } catch (error) {
                setError('Error al obtener cupones: ' + error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            let searchResult;
            if (!isNaN(searchTerm)) { // Si es un número, buscar por ID
                searchResult = await getCuponPorId(searchTerm);
            } else { // Si no, buscar por código de cupón
                searchResult = await getCuponPorCodigo(searchTerm);
            }
            if (searchResult.isSuccess) {
                setCupones([searchResult.result]);
                setError(null); // Limpiar error si la búsqueda fue exitosa
            } else {
                setError('Error al buscar cupón: ' + searchResult.message);
                setCupones([]); // Establecer cupones como un array vacío en caso de error
            }
        } catch (error) {
            setError('Error al buscar cupón: ' + error.message);
        }
        setLoading(false);
    };

    const handleClearSearch = async () => {
        setSearchTerm('');
        setLoading(true);
        try {
            const response = await getCupones();
            if (response.isSuccess) {
                setCupones(response.result);
                setError(null); // Limpiar error si la búsqueda fue exitosa
            } else {
                setError('Error al obtener cupones: ' + response.message);
            }
        } catch (error) {
            setError('Error al obtener cupones: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <>
            <PanelHeader size="sm" />
            <div className="content">
                <Row>
                    <Col xs={12}>
                        <Card>
                            <CardHeader>
                                <Row>
                                    <Col xs={6}>
                                        <h4 className="title">Cupones</h4>
                                    </Col>
                                    <Col xs={6}>
                                        <Form inline className="justify-content-end">
                                            <InputGroup style={{ display: 'flex', alignItems: 'center' }}>
                                                <Input
                                                    placeholder="Buscar por ID o Código"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    style={{ borderRadius: '0.75rem 0 0 0.75rem', height: '38px' }}
                                                />
                                                <InputGroupAddon addonType="append">
                                                    <Button color="primary" style={{ borderRadius: '0 0.75rem 0.75rem 0', height: '38px' }} onClick={handleSearch}>Buscar</Button>
                                                </InputGroupAddon>
                                                <Button color="default" style={{ borderRadius: '0.75rem 0.75rem', height: '38px' }} onClick={handleClearSearch}>Limpiar</Button>
                                            </InputGroup>
                                        </Form>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {loading ? (
                                    <div className="text-center">
                                        <Spinner color="primary" />
                                        <p className="mt-2">Cargando cupones...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center">
                                        <Alert color="danger">{error}</Alert>
                                    </div>
                                ) : (
                                    <>
                                        <Table responsive>
                                            <thead className="text-primary">
                                                <tr>
                                                    <th>Código del Cupón</th>
                                                    <th>Porcentaje de Descuento (%)</th>
                                                    <th>Descuento Mínimo</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cupones.map((cupon, index) => (
                                                    <tr key={index}>
                                                        <td>{cupon.cuponCode}</td>
                                                        <td>{cupon.porcentajeDescuento}</td>
                                                        <td>{cupon.descuentoMinimo}</td>
                                                        <td>
                                                            <Button color="info" size="sm">
                                                                <Link to={`/admin/edit-cupon/${cupon.cuponId}`} style={{ color: 'white' }}>
                                                                    Editar
                                                                </Link>
                                                            </Button>
                                                            {/* Agregar más botones de acción según necesites */}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                        {cupones.length === 0 && (
                                            <div className="text-center">
                                                <p>No se encontraron cupones.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                                <Button color="success">
                                    <Link to="/admin/add-cupon" style={{ color: 'white' }}>Agregar Nuevo</Link>
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default TablaCupones;
