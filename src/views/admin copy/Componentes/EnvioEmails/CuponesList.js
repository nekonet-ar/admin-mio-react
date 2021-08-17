import React, { useEffect, useState } from 'react'
import UrlNodeServer from '../../../../Globals/NodeServer'
import { useFetch } from '../../../../Hooks/UseFetchPost2'
import BusquedaForm from '../../Componentes/Productos/BusquedaForm'
import {
    Row,
    Col,
    Button,
    Modal,
    UncontrolledTooltip,
    Spinner
} from "reactstrap"

const CuponesList = ({
    cuponSelect,
    setCuponSelect,
    modalTog,
    setModalTog
}) => {
    const [busquedaBool, setBusquedaBool] = useState(false)
    const [palabraBuscada, setPalabraBuscada] = useState("")
    const [url, setUrl] = useState("")
    const [call, setCall] = useState(false)
    const [listado, setListado] = useState(<></>)
    const { data, loading, error } = useFetch(
        url,
        {
            palabra: palabraBuscada,
            busquedaBool: busquedaBool
        },
        call,
        localStorage.getItem("loginInfo")
    )

    useEffect(() => {
        setUrl(UrlNodeServer.ListaCupones + "/" + 1)
        setCall(!call)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!loading) {
            if (!error) {
                if (data.cantTotal) {
                    ListarOfertas()
                } else {
                    setListado(
                        <tr style={{ textAlign: "center", width: "100%" }}>
                            <td>
                                No hay cupones cargados
                            </td>
                        </tr>
                    )
                }
            }
        }
        // eslint-disable-next-line
    }, [loading])

    useEffect(() => {
        setCall(!call)
        // eslint-disable-next-line
    }, [url])

    const ListarOfertas = () => {
        let totallista
        try {
            totallista = parseInt(data.totalPag)
        } catch (error) {
            totallista = 0
        }
        if (totallista === 0) {
            setListado(
                <tr style={{ textAlign: "center", width: "100%" }}>
                    <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}>No hay pedidos listados</span>
                </tr>
            )
        } else {
            setListado(
                // eslint-disable-next-line
                data.listado.map((item, key) => {
                    if (key < 5) {
                        return (
                            <Col lg="12" key={key}>
                                <button
                                    className="btn-icon-clipboard"
                                    type="button"
                                    id={"cupon" + item.id}
                                    style={cuponSelect !== item.cuponName ? { padding: "15px", transition: "0.6s ease" } : { padding: "15px", transition: "0.6s ease", background: "#db2929" }}
                                    onClick={e => {
                                        e.preventDefault()
                                        setCuponSelect(item.cuponName)
                                        setModalTog(false)
                                    }}
                                >
                                    <Row>
                                        <Col>
                                            <span style={cuponSelect !== item.cuponName ? { fontWeight: "bold", transition: "0.6s ease" } : { fontWeight: "bold", transition: "0.6s ease", color: "white" }}>{item.cuponName}</span>

                                        </Col>
                                    </Row>
                                </button>
                                <UncontrolledTooltip
                                    delay={0}
                                    trigger="hover focus"
                                    target={"cupon" + item.id}
                                    placement="right"
                                >
                                    Seleccionar
                                </UncontrolledTooltip>
                            </Col>
                        )
                    }
                })
            )
        }
    }

    return (
        <>
            <Modal
                className="modal-dialog-centered"
                isOpen={modalTog}
                toggle={() => setModalTog(false)}
            >
                <div className="modal-header">
                    <h4 className="modal-title">
                        Cupones:
                    </h4>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setModalTog(false)}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <Row>
                    <Col style={{ textAlign: "right" }}>
                        <BusquedaForm
                            busquedaBool={busquedaBool}
                            setPalabraBuscada={(palabraBuscada) => setPalabraBuscada(palabraBuscada)}
                            palabraBuscada={palabraBuscada}
                            setBusquedaBool={(busquedaBool) => setBusquedaBool(busquedaBool)}
                            call={call}
                            setCall={(call) => setCall(call)}
                            tittle="Buscar cupón"
                        />

                    </Col>

                </Row>
                <div className="modal-body">
                    {
                        loading ?
                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                            listado
                    }
                </div>
                <div className="modal-footer">
                    <Button
                        color="warning"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setModalTog(false)}
                    >
                        Cerrar
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default CuponesList