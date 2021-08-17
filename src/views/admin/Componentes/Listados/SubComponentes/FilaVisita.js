import React from 'react'
import {
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle
} from "reactstrap"
import formatDate from '../../../../../Function/FormatDate'

const FilaProducto = ({
    id,
    item,
    setIdDetalle,
    setDetallesBool
}) => {

    const VerDetalles = (e, id) => {
        e.preventDefault()
        setIdDetalle(id)
        setDetallesBool(true)
    }

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {item.id}
            </td>
            <td style={{ textAlign: "center" }}>
                {formatDate(new Date(item.momento), "dd/mm/yyyy hor:min:seg") + " hs"}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.descr_tipo}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.ip_usu}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.provincia + ", " + item.ciudad}
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
                            onClick={e => VerDetalles(e, item.id)}
                        >
                            <i className="fas fa-search"></i>
                            Ver detalles
                            </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </td>
        </tr>
    )
}

export default FilaProducto