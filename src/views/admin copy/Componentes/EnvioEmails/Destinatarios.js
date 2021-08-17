import React, { useState, useEffect } from 'react'
import { useFetch } from '../../../../Hooks/UseFetchPost2'
import {
    Row,
    Spinner,
    Col,
    UncontrolledTooltip
} from "reactstrap"

import axios from 'axios'
import UrlNodeServer from '../../../../Globals/NodeServer'

import Paginacion from '../../Componentes/Paginacion/Paginacion2'
import ListadoTable from '../../Componentes/Listados/ListadoTable2'

import ModalProv from './SubComponentes/ModalLocation'
import ModalCiudades from './SubComponentes/ModalLocation'
import ModalNewEmail from './SubComponentes/ModalNewEmail'

const titulos = ["Casillas de Email"]

const Destinatarios = ({
    listaEmails,
    setListaEmails,
    setAlertar,
    setMsgStrong,
    setMsgGralAlert,
    setSuccessAlert,
    alertar
}) => {
    const [modalProv, setModalProv] = useState(false)
    const [modalCiudad, setModalCiudad] = useState(false)
    const [nvoEmailModal, setNvoEmailModal] = useState(false)
    const [plantCiudad, setPlantCiudad] = useState(<></>)
    const [plantProv, setPlantProv] = useState(<></>)
    const [pagina, setPagina] = useState(1)
    const [listado, setListado] = useState(<></>)
    const [paginasArray, setPaginasArray] = useState([1])
    const [call3, setCall3] = useState(false)
    const [plantPaginas, setPlantPaginas] = useState([])
    const [ultimaPag, setUltimaPag] = useState(0)
    const [provSelect, setProvSelect] = useState("")
    const [ciudadSelect, setCiuadadSelect] = useState("")
    const [tipoFiltro, setTipoFiltro] = useState(1)

    const [url, setUrl] = useState("")
    const [call, setCall] = useState(false)

    const { data, loading, error } = useFetch(
        url,
        {
            filtro: tipoFiltro,
            prov: provSelect,
            ciudad: ciudadSelect
        },
        call,
        localStorage.getItem("loginInfo")
    )
    useEffect(() => {
        setUrl(UrlNodeServer.ListaEmails)
        setCall(!call)
        ListarProvincias()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!loading) {
            if (!error) {
                const list = data
                setListaEmails(list)
            }
        }
        // eslint-disable-next-line
    }, [loading])

    useEffect(() => {
        setCall(!call)
        // eslint-disable-next-line
    }, [url])

    useEffect(() => {
        setCall(!call)
        // eslint-disable-next-line
    }, [tipoFiltro])

    useEffect(() => {
        RellenarEmails()
        // eslint-disable-next-line
    }, [pagina, listaEmails.length, call3])

    const SelectFiltro = (e, filtro) => {
        e.preventDefault()
        setTipoFiltro(filtro)
        setProvSelect("")
        setCiuadadSelect("")
    }

    const SelectProv = async (e, provincia) => {
        e.preventDefault()
        setTipoFiltro(0)
        setProvSelect(provincia)
        ListarCiuadades(provincia)
        setModalProv(false)
        setCall(!call)
    }

    const SelectCiudad = async (e, provincia) => {
        e.preventDefault()
        setTipoFiltro(5)
        setCiuadadSelect(provincia)
        setModalCiudad(false)
        setCall(!call)
    }


    const ListarProvincias = async () => {
        await axios.get(UrlNodeServer.ProvHab, {
            headers: {
                'x-access-token': localStorage.getItem("loginInfo")
            }
        })
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    setPlantProv(
                        respuesta.result.map((item, key) => {
                            return (
                                <Col lg="12" key={key}>
                                    <button
                                        className="btn-icon-clipboard"
                                        type="button"
                                        style={provSelect !== item.provincia ? { padding: "15px", transition: "0.6s ease" } : { padding: "15px", transition: "0.6s ease", background: "#db2929" }}
                                        onClick={e => SelectProv(e, item.provincia)}
                                    >
                                        <Row>
                                            <Col>
                                                <span style={provSelect !== item.provincia ? { fontWeight: "bold", transition: "0.6s ease" } : { fontWeight: "bold", transition: "0.6s ease", color: "white" }}>{item.provincia}</span>

                                            </Col>
                                        </Row>

                                    </button>
                                </Col>
                            )
                        })
                    )
                } else {
                    setPlantProv(
                        <h3>No hay clientes registrados en ninguna provincia</h3>
                    )
                }
            })
    }

    const ListarCiuadades = async (provincia) => {
        const datos = {
            prov: provincia
        }
        await axios.post(UrlNodeServer.CiudadesHab, datos, {
            headers: {
                'x-access-token': localStorage.getItem("loginInfo")
            }
        })
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    setPlantCiudad(
                        respuesta.result.map((item, key) => {
                            return (
                                <Col lg="12" key={key}>
                                    <button
                                        className="btn-icon-clipboard"
                                        type="button"
                                        style={provSelect !== item.ciudad ? { padding: "15px", transition: "0.6s ease" } : { padding: "15px", transition: "0.6s ease", background: "#db2929" }}
                                        onClick={e => SelectCiudad(e, item.ciudad)}
                                    >
                                        <Row>
                                            <Col>
                                                <span style={provSelect !== item.ciudad ? { fontWeight: "bold", transition: "0.6s ease" } : { fontWeight: "bold", transition: "0.6s ease", color: "white" }}>{item.ciudad}</span>

                                            </Col>
                                        </Row>

                                    </button>
                                </Col>
                            )
                        })
                    )
                } else {
                    setPlantCiudad(
                        <h3>No hay clientes registrados en ninguna provincia</h3>
                    )
                }
            })
    }

    const RellenarEmails = () => {
        const desde = parseInt(((pagina - 1) * 5))
        const hasta = parseInt(desde + 5)
        const totalLista = parseInt(listaEmails.length)
        if (totalLista > 0) {
            const paginasFloat = parseFloat(totalLista / 5)
            const paginasInt = parseInt(totalLista / 5)
            let totalPaginas
            let listPaginas = []

            if (paginasFloat > paginasInt) {
                totalPaginas = paginasInt + 1
            } else {
                totalPaginas = paginasInt
            }
            setUltimaPag(totalPaginas)
            for (let i = 0; i < totalPaginas; i++) {
                listPaginas.push(i + 1)
            }
            setPaginasArray(listPaginas)
            setListado(
                // eslint-disable-next-line
                listaEmails.map((item, key) => {
                    if (key >= desde && key < hasta) {
                        return (
                            <tr key={key} style={{ padding: 0, margin: 0 }}>
                                <td style={{ padding: 0, margin: 0 }}>
                                    <Row key={key}>
                                        <Col key={key}>
                                            <button
                                                className="btn-icon-clipboard"
                                                type="button"
                                                style={{ padding: "15px", transition: "0.6s ease" }}
                                                onClick={e => DeleteEmail(e, key)}
                                                id={"email" + key}
                                            >
                                                <Row>
                                                    <Col>
                                                        <span style={provSelect !== item.provincia ? { fontWeight: "bold", transition: "0.6s ease" } : { fontWeight: "bold", transition: "0.6s ease", color: "white" }}>{item.email}</span>
                                                    </Col>
                                                    <Col style={{ textAlign: "right" }}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </Col>
                                                </Row>

                                            </button>
                                            <UncontrolledTooltip
                                                delay={0}
                                                trigger="hover focus"
                                                target={"email" + key}
                                                placement="right"
                                            >
                                                Eliminar
                                            </UncontrolledTooltip>
                                        </Col>
                                    </Row>
                                </td>
                            </tr>
                        )
                    }
                })
            )
        } else {
            setListado(
                <tr>
                    <td>No hay casillas en la lista</td>
                </tr>
            )
        }
    }

    const DeleteEmail = async (e, id) => {
        e.preventDefault()
        let listadito = listaEmails
        listadito.splice(id, 1)
        await setListaEmails(listadito)
        setCall3(!call3)
    }

    return (
        <>
            <ModalProv
                modalTog={modalProv}
                setModalTog={setModalProv}
                plantLocation={plantProv}
            />
            <ModalCiudades
                modalTog={modalCiudad}
                setModalTog={setModalCiudad}
                plantLocation={plantCiudad}
            />

            <ModalNewEmail
                modalTog={nvoEmailModal}
                setModalTog={setNvoEmailModal}
                listaEmails={listaEmails}
                setListaEmails={setListaEmails}
                setAlertar={setAlertar}
                setMsgStrong={setMsgStrong}
                setMsgGralAlert={setMsgGralAlert}
                setSuccessAlert={setSuccessAlert}
                alertar={alertar}
            />
            <Row style={{ padding: "15px", paddingTop: 0 }}>
                <Col lg="12">
                    <h2 style={{ textAlign: "center" }}>Casillas de emails</h2>
                </Col>
            </Row>
            <Row style={{ padding: "15px", margin: "15px", marginTop: 0 }}>
                <Col lg="4" style={{ border: "2px solid red", padding: "15px", margin: "10px" }}>
                    <Col lg="12">
                        <h3>Filtros:</h3>
                    </Col>
                    <Col lg="12">
                        <button
                            className="btn-icon-clipboard"
                            id={"filtro1"}
                            type="button"
                            style={tipoFiltro !== 1 ? { padding: "15px", transition: "0.6s ease" } : { padding: "15px", transition: "0.6s ease", background: "#db2929" }}
                            onClick={e => SelectFiltro(e, 1)}
                        >
                            <Row>
                                <Col>
                                    <span style={tipoFiltro !== 1 ? { fontWeight: "bold", transition: "0.6s ease" } : { fontWeight: "bold", transition: "0.6s ease", color: "white" }}>Todos</span>

                                </Col>
                            </Row>

                        </button>
                        <UncontrolledTooltip
                            delay={0}
                            trigger="hover focus"
                            target={"filtro1"}
                            placement="right"
                        >
                            Todos los contactos
                                            </UncontrolledTooltip>
                    </Col>
                    <Col lg="12">
                        <button
                            className="btn-icon-clipboard"
                            id={"filtro2"}
                            type="button"
                            style={tipoFiltro !== 2 ? { padding: "15px", transition: "0.6s ease" } : { padding: "15px", transition: "0.6s ease", background: "#db2929" }}
                            onClick={e => SelectFiltro(e, 2)}
                        >
                            <Row>
                                <Col>
                                    <span style={tipoFiltro !== 2 ? { fontWeight: "bold", transition: "0.6s ease" } : { fontWeight: "bold", transition: "0.6s ease", color: "white" }}>Clientes</span>

                                </Col>
                            </Row>

                        </button>
                        <UncontrolledTooltip
                            delay={0}
                            trigger="hover focus"
                            target={"filtro2"}
                            placement="right"
                        >
                            Todos los clientes registrados en la plataforma
                                            </UncontrolledTooltip>
                    </Col>
                    <Col lg="12">
                        <button
                            className="btn-icon-clipboard"
                            id={"filtro3"}
                            type="button"
                            style={tipoFiltro !== 3 ? { padding: "15px", transition: "0.6s ease" } : { padding: "15px", transition: "0.6s ease", background: "#db2929" }}
                            onClick={e => SelectFiltro(e, 3)}
                        >
                            <Row>
                                <Col>
                                    <span style={tipoFiltro !== 3 ? { fontWeight: "bold", transition: "0.6s ease" } : { fontWeight: "bold", transition: "0.6s ease", color: "white" }}>Nesletter</span>

                                </Col>
                            </Row>

                        </button>
                        <UncontrolledTooltip
                            delay={0}
                            trigger="hover focus"
                            target={"filtro3"}
                            placement="right"
                        >
                            Todos los contactos inscriptos en el newsletter
                                            </UncontrolledTooltip>
                    </Col>
                    <Col lg="12">
                        <button
                            className="btn-icon-clipboard"
                            id={"filtro4"}
                            type="button"
                            style={provSelect === "" ? { padding: "15px", transition: "0.6s ease" } : { padding: "15px", transition: "0.6s ease", background: "#db2929" }}
                            onClick={e => setModalProv(true)}
                        >
                            <Row>
                                <Col>
                                    <span style={provSelect === "" ? { fontWeight: "bold", transition: "0.6s ease" } : { fontWeight: "bold", transition: "0.6s ease", color: "white" }}>{
                                        provSelect === "" ?
                                            "Por Provincia" :
                                            provSelect
                                    }</span>

                                </Col>
                            </Row>

                        </button>
                        <UncontrolledTooltip
                            delay={0}
                            trigger="hover focus"
                            target={"filtro4"}
                            placement="right"
                        >
                            Elija los contactos por provincia
                                            </UncontrolledTooltip>
                    </Col>
                    {
                        provSelect !== "" ?
                            <Col lg="12">
                                <button
                                    className="btn-icon-clipboard"
                                    id={"filtro5"}
                                    type="button"
                                    style={ciudadSelect === "" ? { padding: "15px", transition: "0.6s ease" } : { padding: "15px", transition: "0.6s ease", background: "#db2929" }}
                                    onClick={e => setModalCiudad(true)}
                                >
                                    <Row>
                                        <Col>
                                            <span style={ciudadSelect === "" ? { fontWeight: "bold", transition: "0.6s ease" } : { fontWeight: "bold", transition: "0.6s ease", color: "white" }}>{
                                                ciudadSelect === "" ?
                                                    "Por Ciudad" :
                                                    ciudadSelect
                                            }</span>

                                        </Col>
                                    </Row>

                                </button>
                                <UncontrolledTooltip
                                    delay={0}
                                    trigger="hover focus"
                                    target={"filtro5"}
                                    placement="right"
                                >
                                    Elija los contactos por ciudad
                                            </UncontrolledTooltip>
                            </Col> : null
                    }
                </Col>

                <Col style={{ border: "2px solid red", margin: "10px", padding: "15px", paddingTop: 0 }}>
                    <div style={{ marginBottom: "50px" }}>
                        {
                            loading ?
                                <div style={{ textAlign: "center", marginTop: "100px" }}>
                                    <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                                <ListadoTable
                                    listado={listado}
                                    titulos={titulos}
                                />
                        }
                    </div>
                    <Row>
                        <Col lg="6" style={{ textAlign: "center", padding: "10px", paddingTop: 0 }}>
                            <button
                                className="btn btn-primary"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setNvoEmailModal(true)
                                }}
                            >
                                Agregar
                            </button>
                        </Col>
                        <Col lg="6" style={{ textAlign: "center", padding: "10px", paddingTop: 0 }}>
                            <Paginacion
                                setPagina={(pagina) => setPagina(pagina)}
                                pagina={pagina}
                                plantPaginas={plantPaginas}
                                ultimaPag={ultimaPag}
                                setPlantPaginas={(plantPaginas) => setPlantPaginas(plantPaginas)}
                                setUltimaPag={(ultimaPag) => setUltimaPag(ultimaPag)}
                                totalPag={paginasArray.length}
                                cantTotal={paginasArray}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default Destinatarios