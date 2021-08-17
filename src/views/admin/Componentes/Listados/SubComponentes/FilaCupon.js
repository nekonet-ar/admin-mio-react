import React from 'react'
import axios from 'axios'
import UrlNodeServer from '../../../../../Globals/NodeServer'
import {
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle
} from "reactstrap"
import swal from 'sweetalert'

const FilaProducto = ({
    id,
    item,
    setActividadStr,
    nvaActCall,
    setNvaActCall,
    alertar,
    setAlertar,
    setMsgStrong,
    setMsgGralAlert,
    setSuccessAlert,
    setCall,
    call,
    setEsperar,
    nvaOffer,
    primero,
    pagina,
    setPagina

}) => {

    const EliminarOff = async (e, id, name, primero, pagina) => {
        e.preventDefault()
        let cookieGet
        try {
            cookieGet = localStorage.getItem("loginInfo")
        } catch (error) {
            cookieGet = ""
        }

        swal({
            title: "Eliminar " + name + "!",
            text: "¿Está seguro de eliminar este cupón? Esta desición es permanente.",
            icon: "warning",
            buttons: {
                cancel: "No",
                Si: true
            },
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    setEsperar(true)
                    await axios.delete(UrlNodeServer.EliminarCupon + "/" + id, {
                        headers: {
                            'x-access-token': cookieGet
                        }
                    })
                        .then(res => {
                            if (primero) {
                                if (pagina > 1) {
                                    setPagina(parseInt(pagina - 1))
                                }
                            }
                            setActividadStr("El usuario ha eliminado el cupón '" + name + "'")
                            setNvaActCall(!nvaActCall)
                            setMsgStrong("Cupón eliminado con éxito!")
                            setMsgGralAlert("")
                            setSuccessAlert(true)
                            setAlertar(!alertar)
                            setCall(!call)
                            setEsperar(false)
                        })
                }
            });
    }

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {item.cuponName}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.tipo === 1 ?
                    "Porcentual (" + item.porcentaje + "%)" :
                    "Monto Fijo"}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.tipo === 1 ?
                    "$ " + item.descMaxStr :
                    "$ " + item.descCuponStr}
            </td>
            <td style={{ textAlign: "center" }}>
                {"$ " + item.montoMinStr}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.stock}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.vtoCupon}
            </td>
            {
                nvaOffer ?
                    null :
                    <td className="text-right">
                        <UncontrolledDropdown>
                            <DropdownToggle
                                className="btn-icon-only text-light"
                                href="#pablo"
                                role="button"
                                size="sm"
                                color=""
                                onClick={e => e.preventDefault()}
                            >
                                <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                                <DropdownItem
                                    href="#pablo"
                                    onClick={e => EliminarOff(e, item.id, item.cuponName, primero, pagina)}
                                >
                                    <i className="fas fa-trash-alt"></i>
                            Eliminar
                            </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </td>
            }
        </tr>
    )
}

export default FilaProducto