import Head from "next/head";
import axios from "axios";
import { Container, Row, Col} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Bar, Pie } from "react-chartjs-2";
import Switch from "react-switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-regular-svg-icons";
import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";
import DataTable from "../components/DataTable";

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
            isBajaTension : true
        },
        {
            type: "cortesServicioMedia",
            label: "Servicio Media",
            backgroundColor: "#111111",
        },
    ];    

    //Función para generar los datos del gráfico
    const dataGrafico = () => {
        setPieData({
            labels: ["Sin suministro", "Con suministro"],
            datasets: [
                {
                    data: [
                        parseInt(data.totalUsuariosSinSuministro.replace(/\./g, "")),
                        parseInt(data.totalUsuariosConSuministro.replace(/\./g, "")),
                    ],
                    backgroundColor: ["#999999", "#111111"],
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
                <title>ENRE Reporte de cortes de luz</title>
                <meta name="title" content="ENRE Reporte de cortes de luz"/>
                <meta name="description" content="Sitio no oficial del Ente Regulador de la Electricidad de Argentina. Reporte de cortes de luz con gráficos."/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://enre.vercel.app/"/>
                <meta property="og:title" content="ENRE Reporte de cortes de luz"/>
                <meta property="og:description" content="Sitio no oficial del Ente Regulador de la Electricidad de Argentina. Reporte de cortes de luz con gráficos."/>
                <meta property="og:image" content="https://images.pexels.com/photos/577514/pexels-photo-577514.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"/>
                <meta property="twitter:card" content="summary_large_image"/>
                <meta property="twitter:url" content="https://enre.vercel.app/"/>
                <meta property="twitter:title" content="ENRE Reporte de cortes de luz"/>
                <meta property="twitter:description" content="Sitio no oficial del Ente Regulador de la Electricidad de Argentina. Reporte de cortes de luz con gráficos."/>
                <meta property="twitter:image" content="https://images.pexels.com/photos/577514/pexels-photo-577514.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"/>                
            </Head>

            <main className="my-2">
                <ToastContainer />
                <Container fluid>
                    <Row className="my-5">
                        <Col lg={6}>
                            <Row>
                                <Col xs={8}>
                                    <Row>
                                        <Col xs={4} className="text-right">Edesur</Col>
                                        <Col xs={4} className="text-center">
                                            <label>
                                                <Switch
                                                    aria-label="Prestador"
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
                                        <Col xs={4} className="text-left">Edenor</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={4} className="text-right">Localidad</Col>
                                        <Col xs={4} className="text-center">
                                            <label>
                                                <Switch
                                                    aria-label="Tipo de gráfico"
                                                    onChange={handleChangeModoGrafico}
                                                    checked={modoGrafico == "partido"}
                                                    offColor="#333"
                                                    onColor="#333"
                                                    uncheckedIcon={<div></div>}
                                                    checkedIcon={<div></div>}
                                                />
                                            </label>
                                        </Col>
                                        <Col xs={4} className="text-left">Partido</Col>
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
                            <h6>Usuarios sin suministro: {data.totalUsuariosSinSuministro}</h6>
                            <h6>Usuarios con suministro: {data.totalUsuariosConSuministro}</h6>
                            <h6>Última actualización: {data.ultimaActualizacion}</h6>
                            <h6>Usuarios que ayer no tuvieron suministro: {data.totalUsuariosAyer}</h6>
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
                                            yAxes: [{stacked: true}],
                                            xAxes: [{stacked: true}]                                            
                                        }
                                    }}
                                />
                        </Col>
                        <Col lg={6}>
                            <Pie data={pieData} />
                        </Col>
                    </Row>

                    {
                        dataTypes.map((item, i) => {
                            return(
                                data[item.type].length > 0?(
                                    <DataTable
                                        key = {i}
                                        data = {data[item.type]}
                                        type = {item}
                                    />
                                ):('')
                            )
                        })
                    }

                </Container>
            </main>

            <footer className="text-center">
                <p>
                    Desarrollado por Leandro Omar Musso
                    <a className="ml-1 text-dark" target="_blank" href="https://github.com/leandromusso/enre" aria-label="Github" rel="noopener"> 
                        <FontAwesomeIcon size="lg" icon={faGithubAlt}/>
                    </a>
                </p>
            </footer>

        </div>
    );
}