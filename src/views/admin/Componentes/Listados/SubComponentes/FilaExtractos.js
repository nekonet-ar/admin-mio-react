import React from 'react'
import {
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle
} from "reactstrap"
import formatDate from '../../../../../Function/FormatDate'
import NumberFormat from '../../../../../Function/NumberFormat'
import swal from 'sweetalert'
import axios from 'axios'
import UrlNodeServer from '../../../../../Globals/NodeServer'
import FileSaver from 'file-saver'

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
    primero,
    pagina,
    setPagina
}) => {

    const DescargarExtr = async (e, fecha) => {
        e.preventDefault()
        const datos = {
            desde: fecha,
            hasta: fecha
        }
        setEsperar(true)
        await axios.post(UrlNodeServer.DescargarPDF, datos, {
            responseType: 'arraybuffer',
            headers: {
                'x-access-token': localStorage.getItem("loginInfo"),
                Accept: 'application/pdf',
            }
        })
            .then(res => {
                FileSaver.saveAs(
                    new Blob([res.data], { type: 'application/pdf' })
                );

                setEsperar(false)
                setMsgStrong("Extracto descargado con éxito! ")
                setMsgGralAlert("")
                setSuccessAlert(true)
                setAlertar(!alertar)
            })
    }
    const EliminarExtracto = (e, fecha) => {
        e.preventDefault()
        const datos = {
            fecha: formatDate(new Date(fecha), "yyyy-mm-dd")
        }
        swal({
            title: "Eliminar Extracto!",
            text: "¿Está seguro de eliminar el extracto del " + formatDate(new Date(fecha), "dd/mm/yyyy") + "? Esta operación no se puede revertir.",
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
                    await axios.post(UrlNodeServer.DeleteExtrcto, datos, {
                        headers: {
                            'x-access-token': localStorage.getItem("loginInfo")
                        }
                    })
                        .then(res => {
                            const respuesta = res.data
                            const status = parseInt(respuesta.status)

                            if (status === 200) {
                                if (primero) {
                                    if (pagina > 1) {
                                        setPagina(parseInt(pagina - 1))
                                    }
                                }
                                setActividadStr("El usuario ha eliminado el extracto del día " + formatDate(new Date(fecha), "dd/mm/yyyy"))
                                setNvaActCall(!nvaActCall)
                                setMsgStrong("Producto eliminado con éxito!")
                                setMsgGralAlert("")
                                setSuccessAlert(true)
                                setAlertar(!alertar)
                                setCall(!call)
                                setEsperar(false)
                            } else {
                                setMsgStrong("Hubo un error al querer eliminar el Extracto")
                                setMsgGralAlert("")
                                setSuccessAlert(false)
                                setAlertar(!alertar)
                                setEsperar(false)
                            }
                        })
                }
            });
    }

    return (
        <tr key={id}>
            <td style={{ textAlign: "center", fontWeight: "bold" }}>
                {formatDate(new Date(item.fecha1), "dd/mm/yyyy")}
            </td>
            <td style={{ textAlign: "center" }}>
                ${" "}{NumberFormat(item.saldoIni)}
            </td>
            <td style={parseInt(item.movDia) > 0 ? { textAlign: "center", color: "green", fontWeight: "bold" } : { textAlign: "center", color: "red", fontWeight: "bold" }}>
                ${" "}{NumberFormat(item.movDia)}
            </td>
            <td style={{ textAlign: "center" }}>
                ${" "}{NumberFormat(item.saldoFinal)}
            </td>
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
                            onClick={e => DescargarExtr(e, formatDate(new Date(item.fecha1), "yyyy-mm-dd"))}
                        >
                            <i className="fas fa-download"></i>
                            Descargar
                        </DropdownItem>
                        <DropdownItem
                            href="#pablo"
                            onClick={e => EliminarExtracto(e, item.fecha1)}
                        >
                            <i className="fas fa-trash"></i>
                            Eliminar Extracto
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </td>
        </tr>
    )
}

export default FilaProducto