import {Table, Card} from "react-bootstrap";
import Countdown from "react-countdown";

function DataTable({data, type}) {

    //Componente que se muestra al finalizar el contador
    const Completionist = () => {
        return <span>¿En este momento?</span>;
    };

    return (
        <Card className="my-2">
        <Card.Header>{type.label}</Card.Header>
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
                        {
                            !type.isBajaTension?(
                                <th>Subestación</th>
                            ):('')
                        }
                        <th>Usuarios</th>
                        {
                            !type.isBajaTension?(
                                <th>Normalización</th>
                            ):('')
                        }                        
                    </tr>
                </thead>
                <tbody>
                    {data.map(
                        (item, i) => {
                            return (
                                <tr key={i}>
                                    <td>{item.partido}</td>
                                    <td>
                                        {item.localidad}
                                    </td>
                                    {
                                        !type.isBajaTension?(
                                            <td>
                                                {
                                                    item.subestacion_alimentador
                                                }
                                            </td>
                                        ):('')
                                    }                                    
                                    <td>{item.usuarios}</td>
                                    {
                                        !type.isBajaTension?(
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
                                                    )
                                                }
                                            </td>
                                        ):('')
                                    }
                                </tr>
                            );
                        }
                    )}
                </tbody>
            </Table>
        </Card.Body>
    </Card>

    );
}

export default DataTable;