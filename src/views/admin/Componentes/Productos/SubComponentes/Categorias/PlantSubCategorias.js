import React from 'react'
import {
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap"

const PlantSubCategorias = ({ id, categoria, subCatNvo, setSubCatNvo }) => {

    const SelectSubCategoria = (e, subCategoria) => {
        e.preventDefault()
        setSubCatNvo(subCategoria)
    }

    return (
        <Col md="6" key={id}>
            <button
                className="btn-icon-clipboard"
                id={"Subcat" + id}
                type="button"
                style={subCatNvo !== categoria.subCategory ? { padding: "15px", transition: "0.6s ease" } : { padding: "15px", transition: "0.6s ease", background: "#db2929" }}
                onClick={e => SelectSubCategoria(e, categoria.subCategory)}
            >
                <Row>
                    <Col>
                        <span style={subCatNvo !== categoria.subCategory ? { fontWeight: "bold", transition: "0.6s ease" } : { fontWeight: "bold", transition: "0.6s ease", color: "white" }}>{categoria.subCategory}</span>

                    </Col>
                    <Col style={{ textAlign: "right" }}>
                        <i style={subCatNvo !== categoria.subCategory ? { transition: "0.6s ease" } : { transition: "0.6s ease", color: "white" }} className="fas fa-copy"></i>
                    </Col>
                </Row>

            </button>
            <UncontrolledTooltip
                delay={0}
                trigger="hover focus"
                target={"Subcat" + id}
                placement="top"
            >
                {
                    subCatNvo !== categoria.subCategory ?
                        "Copiar subcategoria" :
                        "Subcategoria copiada"
                }
            </UncontrolledTooltip>
        </Col>
    )
}

export default PlantSubCategorias