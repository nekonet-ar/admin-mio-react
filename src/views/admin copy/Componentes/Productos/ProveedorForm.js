import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
    FormGroup,
    Input,
    Modal,
    Button,
    UncontrolledTooltip
} from "reactstrap"

const ProveedorForm = ({ proveedor, setProveedor, listaProveedores, setListaProveedores }) => {
    const [plantProv, setPlantProv] = useState(<></>)
    const [modalListaTags, setModalListaTags] = useState(false)
    const [relistar, setRelistar] = useState(false)

    useEffect(() => {
        ListarProv()
        // eslint-disable-next-line
    }, [listaProveedores.length, relistar])

    const AbrirModal = (e) => {
        e.preventDefault()
        setModalListaTags(true)
    }

    const ListarProv = () => {
        const cant = parseInt(listaProveedores.length)
        if (cant > 0) {
            setPlantProv(
                listaProveedores.map((prov, key) => {

                    const SelectProv = (e, proveedor) => {
                        e.preventDefault()
                        setProveedor(proveedor)
                        setModalListaTags(false)
                        setRelistar(!relistar)
                    }

                    return (
                        <Col md="12" key={key}>
                            <button
                                className="btn-icon-clipboard"
                                id={"tagList" + key}
                                style={proveedor !== prov ? { padding: "15px", transition: "0.6s ease" } : { padding: "15px", transition: "0.6s ease", background: "#db2929" }}
                                onClick={proveedor !== prov ? e => SelectProv(e, prov) : e => e.preventDefault()}
                            >
                                <Row>
                                    <Col>
                                        <span style={proveedor !== prov ? { fontWeight: "bold", transition: "0.6s ease" } : { fontWeight: "bold", transition: "0.6s ease", color: "white" }}>{prov}</span>

                                    </Col>
                                    <Col style={{ textAlign: "right" }}>
                                        <i style={proveedor !== prov ? { transition: "0.6s ease" } : { transition: "0.6s ease", color: "white" }} className="fas fa-copy"></i>
                                    </Col>
                                </Row>

                            </button>
                            <UncontrolledTooltip
                                delay={0}
                                trigger="hover focus"
                                target={"tagList" + key}
                                placement="top"
                            >
                                {
                                    proveedor !== prov ?
                                        "Copiar proveedor" :
                                        "Proveedor copiado"
                                }

                            </UncontrolledTooltip>
                        </Col>
                    )
                })
            )
        } else {
            setPlantProv(<></>)
        }
    }
    return (
        <>
            <Row>
                <Col md="9">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                            Proveedor
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-proveedor"
                            placeholder="Proveedor..."
                            type="text"
                            value={proveedor}
                            onChange={e => setProveedor(e.target.value)}
                            required
                        />
                    </FormGroup>
                </Col>
                <Col md="3" style={{ marginTop: "33px" }}>
                    <Row>
                        <button
                            className="btn btn-primary"
                            onClick={e => AbrirModal(e)}
                        >
                            Proveedores
                        </button>

                    </Row>
                </Col>
            </Row>
            <Modal
                className="modal-dialog-centered"
                isOpen={modalListaTags}
                toggle={() => setModalListaTags(false)}
            >
                <div className="modal-header">
                    <h4 className="modal-title">
                        Listado de Proveedores
            </h4>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setModalListaTags(false)}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    {plantProv}
                </div>
                <div className="modal-footer">
                    <Button
                        color="warning"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setModalListaTags(false)}
                    >
                        Cerrar
            </Button>
                </div>
            </Modal>
        </>
    )
}

export default ProveedorForm