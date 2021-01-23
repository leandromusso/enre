import {Card} from "react-bootstrap";
import Countdown from "react-countdown";
import DataTable from "react-data-table-component";

function DataTableComponent({data, type, filterText, color}) {

    const filteredItems = data.filter(
        (item) =>
            `${item.partido}${item.localidad}` &&
            `${item.partido}${item.localidad}`
                .toLowerCase()
                .includes(filterText.toLowerCase())
    );      

    //Componente que se muestra al finalizar el contador
    const Completionist = () => {
        return <span>¿En este momento?</span>;
    };

    //Custom styles to table
    const customStyles = {
        headCells: {
            style: {
                fontWeight: "bold",
            },
        },
        rows: {
            style: {
                minHeight: "55px",
            },
        },
    };
    
    const columns = [
        {
            name: "Partido",
            selector: "partido",
            sortable: true,
        },
        {
            name: "Localidad",
            selector: "localidad",
            sortable: true,
        },
        {
            name: "Usuarios",
            selector: "usuarios",
        }
    ]

    if(!type.isBajaTension){
        columns.push(
            {
                name: "Subestación",
                selector: "subestacion_alimentador",
                sortable: true,                
            },
            {
                name: "Normalización",
                selector: "normalizacion",
                sortable: true,
                cell : row => row.normalizacion !=
                "Sin datos" ? (
                    <Countdown
                        date={
                            row.normalizacion
                        }
                    >
                        <Completionist />
                    </Countdown>
                ) : (
                    "Sin datos"
                )                
            }            
        )
    }

    if(filteredItems.length > 0){
        return (
            <Card className="my-2">
            <Card.Header
                style = {{
                    background : color,
                    color: "white"
                }}
            >{type.label}</Card.Header>
            <Card.Body>
                <DataTable
                    dense
                    className="table"
                    noHeader={true}
                    columns={columns}
                    data={filteredItems}
                    customStyles={customStyles}
                />
            </Card.Body>
        </Card>
    
        );
    }

    return (
        <div></div>
    )

}

export default DataTableComponent;