import Head from "next/head";
import axios from "axios";
import { Container, Row, Col, Table, Card } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import Countdown from "react-countdown";

export default function Home() {
    const [data, setData] = React.useState({
        fuente: "",
        empresa: "",
        totalUsuariosSinSuministro: "",
        totalUsuariosConSuministro: "",
        ultimaActualizacion: "",
        totalUsuariosAyer: "",
        cortesPreventivos: [],
        cortesProgramados: [],
        cortesServicioMedia: [],
        cortesComunicados: [],
        cortesServicioBaja: [],
    });

    const getData = async () => {
        const data = await axios.get("./api");
        setData(data.data);
    };

    React.useEffect(() => {
        getData();
        const interval = setInterval(() => {
            getData();
        }, 60000);
    }, []);

    React.useEffect(() => {
        toast("Información Actualizada!");
    }, [data.ultimaActualizacion]);

    const Completionist = () => {
        return <span>¿En este momento?</span>;
    };

    return (
        <div>
            <Head>
                <title>Reporte ENRE</title>
            </Head>

            <main className="my-2">
                <ToastContainer />
                <Container fluid>
                    <h6>Fuente: {data.fuente}</h6>
                    <h6>Empresa: {data.empresa}</h6>
                    <h6>
                        Usuarios sin suministro:{" "}
                        {data.totalUsuariosSinSuministro}
                    </h6>
                    <h6>
                        Usuarios con suministro:{" "}
                        {data.totalUsuariosConSuministro}
                    </h6>
                    <h6>Última actualización: {data.ultimaActualizacion}</h6>
                    <h6>
                        Usuarios que ayer no tuvieron suministro:{" "}
                        {data.totalUsuariosAyer}
                    </h6>

                    {data.cortesPreventivos.length > 0 ? (
                        <Card className="my-2">
                            <Card.Header>Cortes Preventivos</Card.Header>
                            <Card.Body>
                                <Table
                                    responsive
                                    striped
                                    bordered
                                    hover
                                    size="sm"
                                >
                                    <thead>
                                        <tr>
                                            <th>Partido</th>
                                            <th>Localidad</th>
                                            <th>Subestación</th>
                                            <th>Usuarios</th>
                                            <th>Normalización</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.cortesPreventivos.map(
                                            (item, i) => {
                                                return (
                                                    <tr>
                                                        <td>{item.partido}</td>
                                                        <td>
                                                            {item.localidad}
                                                        </td>
                                                        <td>
                                                            {
                                                                item.subestacion_alimentador
                                                            }
                                                        </td>
                                                        <td>{item.usuarios}</td>
                                                        <td>
                                                            {
                                                                item.normalizacion != 'Sin datos'?(
                                                                    <Countdown
                                                                        date={
                                                                            item.normalizacion
                                                                        }
                                                                    >
                                                                        <Completionist />
                                                                    </Countdown>
                                                                ):('Sin datos')
                                                            }
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    ) : (
                        ""
                    )}

                    {data.cortesProgramados.length > 0 ? (
                        <Card className="my-2">
                            <Card.Header>Cortes Programados</Card.Header>
                            <Card.Body>
                                <Table
                                    responsive
                                    striped
                                    bordered
                                    hover
                                    size="sm"
                                >
                                    <thead>
                                        <tr>
                                            <th>Partido</th>
                                            <th>Localidad</th>
                                            <th>Subestación</th>
                                            <th>Usuarios</th>
                                            <th>Normalización</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.cortesProgramados.map(
                                            (item, i) => {
                                                return (
                                                    <tr>
                                                        <td>{item.partido}</td>
                                                        <td>
                                                            {item.localidad}
                                                        </td>
                                                        <td>
                                                            {
                                                                item.subestacion_alimentador
                                                            }
                                                        </td>
                                                        <td>{item.usuarios}</td>
                                                        <td>
                                                        {
                                                                item.normalizacion != 'Sin datos'?(
                                                                    <Countdown
                                                                        date={
                                                                            item.normalizacion
                                                                        }
                                                                    >
                                                                        <Completionist />
                                                                    </Countdown>
                                                                ):('Sin datos')
                                                            }
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    ) : (
                        ""
                    )}
                    {data.cortesServicioMedia.length > 0 ? (
                        <Card className="my-2">
                            <Card.Header>Cortes en Media Tensión</Card.Header>
                            <Card.Body>
                                <Table
                                    responsive
                                    striped
                                    bordered
                                    hover
                                    size="sm"
                                >
                                    <thead>
                                        <tr>
                                            <th>Partido</th>
                                            <th>Localidad</th>
                                            <th>Subestación</th>
                                            <th>Usuarios</th>
                                            <th>Normalización</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.cortesServicioMedia.map(
                                            (item, i) => {
                                                return (
                                                    <tr>
                                                        <td>{item.partido}</td>
                                                        <td>
                                                            {item.localidad}
                                                        </td>
                                                        <td>
                                                            {
                                                                item.subestacion_alimentador
                                                            }
                                                        </td>
                                                        <td>{item.usuarios}</td>
                                                        <td>
                                                        {
                                                                item.normalizacion != 'Sin datos'?(
                                                                    <Countdown
                                                                        date={
                                                                            item.normalizacion
                                                                        }
                                                                    >
                                                                        <Completionist />
                                                                    </Countdown>
                                                                ):('Sin datos')
                                                            }
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    ) : (
                        ""
                    )}
                    {data.cortesComunicados.length > 0 ? (
                        <Card className="my-2">
                            <Card.Header>Cortes Comunicados</Card.Header>
                            <Card.Body>
                                <Table
                                    responsive
                                    striped
                                    bordered
                                    hover
                                    size="sm"
                                >
                                    <thead>
                                        <tr>
                                            <th>Partido</th>
                                            <th>Localidad</th>
                                            <th>Subestación</th>
                                            <th>Usuarios</th>
                                            <th>Normalización</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.cortesComunicados.map(
                                            (item, i) => {
                                                return (
                                                    <tr>
                                                        <td>{item.partido}</td>
                                                        <td>
                                                            {item.localidad}
                                                        </td>
                                                        <td>
                                                            {
                                                                item.subestacion_alimentador
                                                            }
                                                        </td>
                                                        <td>{item.usuarios}</td>
                                                        <td>
                                                        {
                                                                item.normalizacion != 'Sin datos'?(
                                                                    <Countdown
                                                                        date={
                                                                            item.normalizacion
                                                                        }
                                                                    >
                                                                        <Completionist />
                                                                    </Countdown>
                                                                ):('Sin datos')
                                                            }
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    ) : (
                        ""
                    )}
                    {data.cortesServicioBaja.length > 0 ? (
                        <Card className="my-2">
                            <Card.Header>Cortes en Baja Tensión</Card.Header>
                            <Card.Body>
                                <Table
                                    responsive
                                    striped
                                    bordered
                                    hover
                                    size="sm"
                                >
                                    <thead>
                                        <tr>
                                            <th>Partido</th>
                                            <th>Localidad</th>
                                            <th>Usuarios</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.cortesServicioBaja.map(
                                            (item, i) => {
                                                return (
                                                    <tr>
                                                        <td>{item.partido}</td>
                                                        <td>
                                                            {item.localidad}
                                                        </td>
                                                        <td>{item.usuarios}</td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    ) : (
                        ""
                    )}
                </Container>
            </main>

            <footer></footer>
        </div>
    );
}
