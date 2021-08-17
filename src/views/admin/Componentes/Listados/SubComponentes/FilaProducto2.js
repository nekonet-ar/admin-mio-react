import React from 'react'
import {
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media
} from "reactstrap"

const FilaProducto = ({
    id,
    item,
    listaProd,
    setListaProd,
    call3,
    setCall3
}) => {

    const EliminarOff = async (e, id) => {
        e.preventDefault()
        const listadito = listaProd
        listadito.splice(id, 1)
        await setListaProd(listadito)
        setCall3(!call3)
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
                            onClick={e => EliminarOff(e, id)}
                        >
                            <i className="fas fa-trash-alt"></i>
                            Quitar
                            </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </td>
        </tr>
    )
}

export default FilaProducto