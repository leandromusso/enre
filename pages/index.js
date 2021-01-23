// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import Head from "next/head";
import axios from "axios";
import {
    Container,
    Row,
    Col,
    InputGroup,
    FormControl,
    Card,
    Spinner
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Bar, Pie } from "react-chartjs-2";
import Switch from "react-switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";
import DataTable from "../components/DataTable";

export default function Home() {
    const [loading, setLoading] = React.useState(false);

    const [modoNoche, setModoNoche] = React.useState(false);

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

    const [colors, setColors] = React.useState([
        "#e3b505",
        "#95190c",
        "#610345",
        "#107e7d",
        "#044b7f",
        "#dc3545",
        "#28a745",
    ]);

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
        if(data.ultimaActualizacion){
            toast.dark("Información Actualizada!", {
                position: "bottom-left",
            });
        }
    }, [data.ultimaActualizacion]);

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
                data: [],
                backgroundColor: [],
            },
        ],
    });

    const dataTypes = [
        {
            type: "cortesComunicados",
            label: "Comunicados",
            backgroundColor: colors[0],
        },
        {
            type: "cortesPreventivos",
            label: "Preventivos",
            backgroundColor: colors[1],
        },
        {
            type: "cortesProgramados",
            label: "Programados",
            backgroundColor: colors[2],
        },
        {
            type: "cortesServicioBaja",
            label: "Servicio Baja",
            backgroundColor: colors[3],
            isBajaTension: true,
        },
        {
            type: "cortesServicioMedia",
            label: "Servicio Media",
            backgroundColor: colors[4],
        },
    ];

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
                    backgroundColor: [colors[5], colors[6]],
                    borderWidth: 0,
                },
            ],
        });

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
                        borderWidth: 0,
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

    const [filterText, setFilterText] = React.useState("");

    return (
        <div>
            <Head>
                <title>ENRE Reporte de cortes de luz</title>
                <meta name="title" content="ENRE Reporte de cortes de luz" />
                <meta
                    name="description"
                    content="Sitio no oficial del Ente Regulador de la Electricidad de Argentina. Reporte de cortes de luz con gráficos."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://enre.vercel.app/" />
                <meta
                    property="og:title"
                    content="ENRE Reporte de cortes de luz"
                />
                <meta
                    property="og:description"
                    content="Sitio no oficial del Ente Regulador de la Electricidad de Argentina. Reporte de cortes de luz con gráficos."
                />
                <meta
                    property="og:image"
                    content="https://images.pexels.com/photos/577514/pexels-photo-577514.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                />
                <meta property="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:url"
                    content="https://enre.vercel.app/"
                />
                <meta
                    property="twitter:title"
                    content="ENRE Reporte de cortes de luz"
                />
                <meta
                    property="twitter:description"
                    content="Sitio no oficial del Ente Regulador de la Electricidad de Argentina. Reporte de cortes de luz con gráficos."
                />
                <meta
                    property="twitter:image"
                    content="https://images.pexels.com/photos/577514/pexels-photo-577514.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                />

                <link
                    rel="apple-touch-icon"
                    sizes="57x57"
                    href="/apple-icon-57x57.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="60x60"
                    href="/apple-icon-60x60.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="72x72"
                    href="/apple-icon-72x72.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="76x76"
                    href="/apple-icon-76x76.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="114x114"
                    href="/apple-icon-114x114.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="120x120"
                    href="/apple-icon-120x120.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="144x144"
                    href="/apple-icon-144x144.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="152x152"
                    href="/apple-icon-152x152.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-icon-180x180.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="192x192"
                    href="/android-icon-192x192.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="96x96"
                    href="/favicon-96x96.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/manifest.json" />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta
                    name="msapplication-TileImage"
                    content="/ms-icon-144x144.png"
                />
                <meta name="theme-color" content="#ffffff" />
            </Head>

            <main className="my-2">
                <ToastContainer
                    position="bottom-left"
                />                        
                <div className="text-center"
                    style = {
                        {
                            position: "fixed",
                            bottom : "10px",
                            right : "10px",
                            zIndex : 99
                        }
                    }
                >
                    {loading ? (
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    ) : (
                        ""
                    )}
                </div>
               
                <Container fluid>
                    <Row className="my-3">
                        <Col lg={6} className="order-lg-1">
                            <Card className="w-100 h-100">
                                <Card.Header
                                    style={{
                                        background: "#333",
                                        color: "white",
                                    }}
                                >CONFIGURACIÓN</Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col xs={12}>
                                            <Row>
                                                <Col
                                                    xs={4}
                                                    className="text-right p-0"
                                                >
                                                    <a
                                                    style = {
                                                        {
                                                            cursor: 'pointer',
                                                            textDecoration : prestador == 'S'? 'underline': 'none'
                                                        }
                                                    }                                                    
                                                    onClick={() => setPrestador('S')}>Edesur</a>
                                                </Col>
                                                <Col
                                                    xs={4}
                                                    className="text-center p-0"
                                                >
                                                    <label>
                                                        <Switch
                                                            aria-label="Prestador"
                                                            disabled = {loading}
                                                            onChange={
                                                                handleChangePrestador
                                                            }
                                                            checked={
                                                                prestador == "N"
                                                            }
                                                            offColor="#333"
                                                            onColor="#333"
                                                            uncheckedIcon={
                                                                <div></div>
                                                            }
                                                            checkedIcon={
                                                                <div></div>
                                                            }
                                                        />
                                                    </label>
                                                </Col>
                                                <Col
                                                    xs={4}
                                                    className="text-left p-0"
                                                >
                                                    <a
                                                    style = {
                                                        {
                                                            cursor: 'pointer',
                                                            textDecoration : prestador == 'N'? 'underline': 'none'
                                                        }
                                                    }                                                     
                                                    onClick={() => setPrestador('N')}>Edenor</a>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col
                                                    xs={4}
                                                    className="text-right p-0"
                                                >
                                                    <a
                                                    style = {
                                                        {
                                                            cursor: 'pointer',
                                                            textDecoration : modoGrafico == 'localidad'? 'underline': 'none'
                                                        }
                                                    }                                                    
                                                    onClick={() => setModoGrafico('localidad')}>Localidad</a>
                                                </Col>
                                                <Col
                                                    xs={4}
                                                    className="text-center p-0"
                                                >
                                                    <label>
                                                        <Switch
                                                            disabled = {loading}
                                                            aria-label="Tipo de gráfico"
                                                            onChange={
                                                                handleChangeModoGrafico
                                                            }
                                                            checked={
                                                                modoGrafico ==
                                                                "partido"
                                                            }
                                                            offColor="#333"
                                                            onColor="#333"
                                                            uncheckedIcon={
                                                                <div></div>
                                                            }
                                                            checkedIcon={
                                                                <div></div>
                                                            }
                                                        />
                                                    </label>
                                                </Col>
                                                <Col
                                                    xs={4}
                                                    className="text-left p-0"
                                                >
                                                    <a
                                                    style = {
                                                        {
                                                            cursor: 'pointer',
                                                            textDecoration : modoGrafico == 'partido'? 'underline': 'none'
                                                        }
                                                    }
                                                    onClick={() => setModoGrafico('partido')}>Partido</a>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={6} className="order-lg-0 mt-3 mt-md-0">
                            <Card>
                                <Card.Header
                                    style={{
                                        background: "#333",
                                        color: "white",
                                    }}
                                >
                                    {data.empresa}
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col sm={6}>
                                            <h6 className="text-center">Usuarios sin suministro:</h6>
                                        </Col>
                                        <Col sm={6}>
                                            <h6 className="text-center"
                                                style={{
                                                    color: colors[5],
                                                }}
                                            >
                                                {data.totalUsuariosSinSuministro}
                                            </h6>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={6}>
                                            <h6 className="text-center">Usuarios con suministro:</h6>
                                        </Col>
                                        <Col sm={6}>
                                            <h6 className="text-center"
                                                style={{
                                                    color: colors[6],
                                                }}
                                            >
                                                {data.totalUsuariosConSuministro}
                                            </h6>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={6}>
                                            <h6 className="text-center">Última actualización:</h6>
                                        </Col>
                                        <Col sm={6}>
                                            <h6 className="text-center">
                                                {data.ultimaActualizacion}
                                            </h6>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={6}>
                                            <h6 className="text-center">Usuarios que ayer no tuvieron suministro:</h6>
                                        </Col>
                                        <Col sm={6}>
                                            <h6 className="text-center">
                                                {data.totalUsuariosAyer}
                                            </h6>
                                        </Col>
                                    </Row>                                                                                                            
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={8}>
                            <Bar
                                height={300}
                                data={barData}
                                options={{
                                    legend: {
                                        labels : {
                                            fontFamily : "'Roboto Mono', 'monospace'",
                                        }
                                    },                                    
                                    tooltips: {
                                        mode: "index",
                                        intersect: true,
                                    },
                                    maintainAspectRatio: false,
                                    scales: {
                                        yAxes: [
                                            {
                                                stacked: true,
                                                gridLines: {
                                                    color: "white",
                                                },
                                                ticks: {
                                                    fontFamily: "'Roboto Mono', 'monospace'",
                                                }
                                            },
                                        ],
                                        xAxes: [
                                            {
                                                stacked: true,
                                                ticks: {
                                                    fontFamily: "'Roboto Mono', 'monospace'",
                                                }
                                            },
                                        ],
                                    },
                                }}
                            />
                        </Col>
                        <Col lg={4}>
                            <Pie
                                options={{
                                    legend: {
                                        labels : {
                                            fontFamily : "'Roboto Mono', 'monospace'",
                                        }
                                    },                                    
                                    maintainAspectRatio: false,
                                }}                            
                                data={pieData} />
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} className="my-4">
                            <InputGroup
                                onChange={(e) => setFilterText(e.target.value)}
                            >
                                <FormControl placeholder="Ingresá tu localidad o partido" />
                            </InputGroup>
                        </Col>
                    </Row>

                    {dataTypes.map((item, i) => {
                        return data[item.type].length > 0 ? (
                            <DataTable
                                key={i}
                                data={data[item.type]}
                                type={item}
                                filterText={filterText}
                                color={colors[i]}
                            />
                        ) : (
                            ""
                        );
                    })}
                </Container>
            </main>

            <footer className="text-center">
                <p>
                    Desarrollado por Leandro Omar Musso
                    <a
                        className="ml-1 text-dark"
                        target="_blank"
                        href="https://github.com/leandromusso/enre"
                        aria-label="Github"
                        rel="noopener"
                    >
                        <FontAwesomeIcon size="lg" icon={faGithubAlt} />
                    </a>
                </p>
            </footer>
        </div>
    );
}
