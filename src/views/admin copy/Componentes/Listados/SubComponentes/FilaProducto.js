import React from 'react'
import axios from 'axios'
import UrlNodeServer from '../../../../../Globals/NodeServer'
import {
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Badge
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
    setDetallesBool,
    setIdDetalle,
    setCopiarDet,
    primero,
    pagina,
    setPagina

}) => {

    const EliminarOff = async (e, id, name, primero, pagina) => {
        e.preventDefault()
        const datos = {
            id: id
        }

        swal({
            title: "Eliminar " + name + "!",
            text: "¿Está seguro de eliminar este producto? Esta desición es permanente.",
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
                    await axios.post(UrlNodeServer.ProductDelete, datos)
                        .then(res => {
                            if (primero) {
                                if (pagina > 1) {
                                    setPagina(parseInt(pagina - 1))
                                }
                            }
                            setActividadStr("El usuario ha eliminado el producto '" + name + "'")
                            setNvaActCall(!nvaActCall)
                            setMsgStrong("Producto eliminado con éxito!")
                            setMsgGralAlert("")
                            setSuccessAlert(true)
                            setAlertar(!alertar)
                            setCall(!call)
                            setEsperar(false)
                        })
                }
            });
    }

    const copiarDetalle = (e, id) => {
        e.preventDefault()
        setIdDetalle(id)
        setCopiarDet(true)
    }

    const DesactivarOff = async (e, id, activo, name) => {
        e.preventDefault()
        let activar
        if (parseInt(activo) === 0) {
            activar = 1
        } else {
            activar = 0
        }

        const datos = {
            id: id,
            activar: activar
        }
        setEsperar(true)
        await axios.post(UrlNodeServer.ProductChangeEstate, datos)
            .then(res => {

                if (activar === 1) {
                    setNvaActCall("El usuario ha activado el producto '" + name + "'")
                    setMsgStrong("Producto activado con éxito!")
                } else {
                    setNvaActCall("El usuario ha desactivado el producto '" + name + "'")
                    setMsgStrong("Producto desactivado con éxito!")
                }
                setNvaActCall(!nvaActCall)
                setSuccessAlert(true)
                setAlertar(!alertar)
                setCall(!call)
                setEsperar(false)
            })
    }

    const VerDetalles = (e, id) => {
        e.preventDefault()
        setIdDetalle(id)
        setDetallesBool(true)
    }

    return (
        <tr key={id}>
            <th scope="row">
                <Media className="align-items-center">
                    <Media>
                        <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                        >
                            <img
                                alt="..."
                                src={item.image[0]}
                            />
                        </a>
                        <span className="mb-0 text-sm" style={{ marginLeft: "10px" }}>
                            {item.name}
                        </span>
                    </Media>
                </Media>
            </th>
            <td style={{ textAlign: "center" }}>
                {item.categoria}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.subCategoria}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.proveedor}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.price}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.discount}
            </td>
            <td style={{ textAlign: "center" }}>
                <Badge color="" className="badge-dot">
                    {
                        item.enabled === 1 ?
                            <>
                                <i className="bg-success" style={{ width: "15px", height: "15px" }} />
                            </> :
                            <>
                                <i className="bg-danger" style={{ width: "15px", height: "15px" }} />
                            </>
                    }
                </Badge>
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
                                    onClick={e => DesactivarOff(e, item.id, item.enabled, item.name)}
                                >
                                    <Badge color="" className="badge-dot mr-4">
                                        {
                                            item.enabled === 1 ?
                                                <>
                                                    <i className="bg-danger" style={{ width: "10px", height: "10px" }} />
                                        Desactivar
                                    </> :
                                                <>
                                                    <i className="bg-success" style={{ width: "10px", height: "10px" }} />
                                        Activar
                                    </>
                                        }

                                    </Badge>
                                </DropdownItem>
                                <DropdownItem
                                    href="#pablo"
                                    onClick={e => VerDetalles(e, item.id)}
                                >
                                    <i className="fas fa-search"></i>
                            Ver detalles
                            </DropdownItem>
                                <DropdownItem
                                    href="#pablo"
                                    onClick={e => copiarDetalle(e, item.id)}
                                >
                                    <i className="fas fa-copy"></i>
                           Copiar Producto
                            </DropdownItem>
                                <DropdownItem
                                    href="#pablo"
                                    onClick={e => EliminarOff(e, item.id, item.name, primero, pagina)}
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