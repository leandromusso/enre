import Head from "next/head";
import axios from "axios";
import { Container, Row, Col, Table, Card, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import Countdown from "react-countdown";
import { Bar, Pie } from "react-chartjs-2";
import Switch from "react-switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb } from "@fortawesome/free-regular-svg-icons";


export default function Home() {
    const [loading, setLoading] = React.useState(false);

    //Declaro hook de prestador y modo gráfico
    const [prestador, setPrestador] = React.useState("S");
    const [modoGrafico, setModoGrafico] = React.useState("localidad");

    const handleChangePrestador = () => {
        if (prestador == "S") {
            return setPrestador("N");
        }
        return setPrestador("S");
    };

    const handleChangeModoGrafico = () => {
        if (modoGrafico == "localidad") {
            return setModoGrafico("partido");
        }
        return setModoGrafico("localidad");
    };

    //Declaro hook de control para evitar múltiples intervalos
    const [started, setStarted] = React.useState(false);
    //Declaro tiempo entre request
    const refreshTime = 60; // En segundos

    //Declaro hook que contiene los datos
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

    //Función para obtener los datos
    const getData = async () => {
        if (prestador) {
            setLoading(true);
            const data = await axios.get(`./api?prestador=${prestador}`);
            setLoading(false);
            setData(data.data);
        }
    };

    React.useEffect(() => {
        setStarted(true);
        getData();
    }, [prestador, modoGrafico]);

    React.useEffect(() => {
        let intervalID;
        if (started) {
            intervalID = setInterval(() => {
                getData();
            }, refreshTime * 1000);
        } else {
            clearInterval(intervalID);
        }
        return () => clearInterval(intervalID);
    }, [started, prestador, modoGrafico]);

    //Evento al obtener una nueva hora de actualización
    React.useEffect(() => {
        toast("Información Actualizada!");
    }, [data.ultimaActualizacion]);

    //Componente que se muestra al finalizar el contador
    const Completionist = () => {
        return <span>¿En este momento?</span>;
    };

    //Declaro hook para el gráfico de barras
    const [barData, setBarData] = React.useState({
        labels: [],
        datasets: [],
    });

    //Declaro hook para el gráfico de torta
    const [pieData, setPieData] = React.useState({
        labels: ["Sin suministro", "Con suministro"],
        datasets: [
            {
                data: [0, 0],
                backgroundColor: ["#999999", "#111111"],
            },
        ],
    });

    //Función para generar los datos del gráfico
    const dataGrafico = () => {
        setPieData({
            labels: ["Sin suministro", "Con suministro"],
            datasets: [
                {
                    data: [
                        parseInt(
                            data.totalUsuariosSinSuministro.replace(/\./g, "")
                        ),
                        parseInt(
                            data.totalUsuariosConSuministro.replace(/\./g, "")
                        ),
                    ],
                    backgroundColor: ["#999999", "#111111"],
                },
            ],
        });

        const dataTypes = [
            {
                type: "cortesComunicados",
                label: "Comunicados",
                backgroundColor: "#999999",
            },
            {
                type: "cortesPreventivos",
                label: "Preventivos",
                backgroundColor: "#777777",
            },
            {
                type: "cortesProgramados",
                label: "Programados",
                backgroundColor: "#555555",
            },
            {
                type: "cortesServicioBaja",
                label: "Servicio Baja",
                backgroundColor: "#333333",
            },
            {
                type: "cortesServicioMedia",
                label: "Servicio Media",
                backgroundColor: "#111111",
            },
        ];

        //Declaro variables auxiliares
        let labels = [];
        let datasets = [];

        if (data.fuente != "") {
            setBarData({
                labels: [],
                datasets: [],
            });

            dataTypes.map((type, iType) => {
                if (data[type.type]) {
                    data[type.type].map((item, i) => {
                        if (!labels.includes(item[modoGrafico])) {
                            labels.push(item[modoGrafico]);
                        }
                    });

                    const { label, backgroundColor } = type;

                    datasets.push({
                        label,
                        backgroundColor,
                        data: [],
                    });
                }
            });

            //Por cada label
            labels.map((label, i) => {
                //Por cada tipo de dato
                dataTypes.map((type, iType) => {
                    //Si tiene datos
                    if (data[type.type]) {
                        let usuarios = 0;
                        //Recorro los datos
                        data[type.type].map((item, i) => {
                            if (item[modoGrafico] === label) {
                                usuarios += parseInt(item.usuarios);
                            }
                        });
                        datasets[iType].data.push(usuarios);
                    }
                });
            });

            setBarData({
                labels,
                datasets,
            });
        }
    };

    React.useEffect(() => {
        dataGrafico();
    }, [data]);

    return (
        <div>
            <Head>
                <title>Reporte ENRE</title>
            </Head>

            <main className="my-2">
                <ToastContainer />
                <Container fluid>
                    <Row className="my-5">
                        <Col lg={6}>
                            <Row>
                                <Col xs={8}>
                                    <Row>
                                        <Col xs={4} className="text-right">
                                            Edesur
                                        </Col>
                                        <Col xs={4} className="text-center">
                                            <label>
                                                <Switch
                                                    onChange={
                                                        handleChangePrestador
                                                    }
                                                    checked={prestador == "N"}
                                                    offColor="#333"
                                                    onColor="#333"
                                                    uncheckedIcon={<div></div>}
                                                    checkedIcon={<div></div>}
                                                />
                                            </label>
                                        </Col>
                                        <Col xs={4} className="text-left">
                                            Edenor
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={4} className="text-right">
                                            Localidad
                                        </Col>
                                        <Col xs={4} className="text-center">
                                            <label>
                                                <Switch
                                                    onChange={
                                                        handleChangeModoGrafico
                                                    }
                                                    checked={
                                                        modoGrafico == "partido"
                                                    }
                                                    offColor="#333"
                                                    onColor="#333"
                                                    uncheckedIcon={<div></div>}
                                                    checkedIcon={<div></div>}
                                                />
                                            </label>
                                        </Col>
                                        <Col xs={4} className="text-left">
                                            Partido
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={4}>
                                    <Row>
                                        <Col
                                            xs={12}
                                            className="text-center"
                                        >
                                            {
                                                loading?(
                                                    <div>
                                                        <FontAwesomeIcon
                                                            icon={faLightbulb}
                                                            size="2x"
                                                            spin
                                                        />
                                                        <h6>...Cargando</h6>
                                                    </div>
                                                ):('')
                                            }
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={6}>
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
                            <h6>
                                Última actualización: {data.ultimaActualizacion}
                            </h6>
                            <h6>
                                Usuarios que ayer no tuvieron suministro:{" "}
                                {data.totalUsuariosAyer}
                            </h6>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6}>
                                <Bar
                                    height={300}
                                    data={barData}
                                    options={{
                                        tooltips: {
                                            mode: "index",
                                            intersect: true,
                                        },
                                        maintainAspectRatio: false,
                                        scales: {
                                            xAxes: [
                                                {
                                                    stacked: true,
                                                },
                                            ],
                                            yAxes: [
                                                {
                                                    stacked: true,
                                                },
                                            ],
                                        },
                                    }}
                                />
                        </Col>
                        <Col lg={6}>
                            <Pie data={pieData} />
                        </Col>
                    </Row>

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
                                                    <tr key={i}>
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
                                                            {item.normalizacion !=
                                                            "Sin datos" ? (
                                                                <Countdown
                                                                    date={
                                                                        item.normalizacion
                                                                    }
                                                                >
                                                                    <Completionist />
                                                                </Countdown>
                                                            ) : (
                                                                "Sin datos"
                                                            )}
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
                                                    <tr key={i}>
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
                                                            {item.normalizacion !=
                                                            "Sin datos" ? (
                                                                <Countdown
                                                                    date={
                                                                        item.normalizacion
                                                                    }
                                                                >
                                                                    <Completionist />
                                                                </Countdown>
                                                            ) : (
                                                                "Sin datos"
                                                            )}
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
                                                    <tr key={i}>
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
                                                            {item.normalizacion !=
                                                            "Sin datos" ? (
                                                                <Countdown
                                                                    date={
                                                                        item.normalizacion
                                                                    }
                                                                >
                                                                    <Completionist />
                                                                </Countdown>
                                                            ) : (
                                                                "Sin datos"
                                                            )}
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
                                                    <tr key={i}>
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
                                                            {item.normalizacion !=
                                                            "Sin datos" ? (
                                                                <Countdown
                                                                    date={
                                                                        item.normalizacion
                                                                    }
                                                                >
                                                                    <Completionist />
                                                                </Countdown>
                                                            ) : (
                                                                "Sin datos"
                                                            )}
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
                                                    <tr key={i}>
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

            <footer className="text-center">
                <p>
                    Desarrollado por Leandro Omar Musso. Código fuente
                    disponible en{" "}
                    <a
                        target="_blank"
                        href="https://github.com/leandromusso/enre"
                    >
                        Github
                    </a>
                </p>
            </footer>

        </div>
    );
}
