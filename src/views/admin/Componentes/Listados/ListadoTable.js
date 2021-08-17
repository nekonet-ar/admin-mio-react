import React from 'react'
import {
    Table
} from "reactstrap"

const ListadoTable = (props) => {

    return (
        <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
                <tr>
                    {
                        props.titulos.map((titulo, key) => {
                            return (
                                <th key={key} scope="col" style={{ textAlign: "center" }}>{titulo}</th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {
                    props.listado
                }
            </tbody>
        </Table>
    )
}

export default ListadoTable