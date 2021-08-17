import React from 'react'
import {
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle
} from "reactstrap"

const FilaPedidos = ({
    id,
    item,
    setIdDetalle,
    setDetallesBool
}) => {

    const VerDetalles = (e, orderId) => {
        e.preventDefault()
        setIdDetalle(orderId)
        setDetallesBool(true)
    }

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {item.fechaPago}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.idOrden}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.tipoPago === "credit_card" ?
                    "Tarjeta de crédito" :
                    item.tipoPago === "debit_card" ?
                        "Tarjeta de débito" :
                        item.tipoPago === "ticket" ?
                            "Pago Fácil/Rapipago" :
                            item.tipoPago === "atm" ?
                                "Cajero Automático" :
                                "MercadoPago"
                }
            </td>
            <td style={{ textAlign: "center" }}>
                {item.provincia}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.ciudad}
            </td>
            <td style={{ textAlign: "center" }}>
                {"$ " + item.totaPrice}
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
                            onClick={e => VerDetalles(e, item.idOrden)}
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

export default FilaPedidos