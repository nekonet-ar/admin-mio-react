import React, { useEffect, useState } from "react";
import { useFetch } from '../../Hooks/UseFetchPost2'
import { useActividad } from '../../Hooks/UseNvaActividad'
import axios from 'axios'
import { useToken } from '../../Hooks/UseFetchToken'
import { Redirect } from "react-router-dom"
// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Container,
    Row,
    Spinner,
    Col,
    FormGroup,
    Input
} from "reactstrap"
// core components
import Header from "components/Headers/Header.js";
import UrlNodeServer from '../../Globals/NodeServer'

import FilaVisitas from './Componentes/Listados/SubComponentes/FilaVisita'
import ListadoTable from './Componentes/Listados/ListadoTable'
import BusquedaForm from './Componentes/Productos/BusquedaForm'
import AlertaForm from './Componentes/Alertas/Alerta1'
import LocationUsuMap from './Componentes/Maps/LocationUsu'

import formatDate from '../../Function/FormatDate'

const titulos = ["Id Visita", "Horario", "Acción", "IP", "Ubicación", ""]

const ProductsItems = () => {
    const [alertar, setAlertar] = useState(false)
    const [msgStrongAlert, setMsgStrong] = useState("")
    const [msgGralAlert, setMsgGralAlert] = useState("")
    const [successAlert, setSuccessAlert] = useState(false)
    const [esperar2, setEsperar2] = useState(false)
    const [espera3, setEsperar3] = useState(false)

    const [busquedaBool, setBusquedaBool] = useState(false)
    const [palabraBuscada, setPalabraBuscada] = useState("")
    const [url, setUrl] = useState("")
    const [call, setCall] = useState(false)
    const [listado, setListado] = useState(<></>)
    const [detallesBool, setDetallesBool] = useState(false)
    const [idDetalle, setIdDetalle] = useState(0)

    const [directBool, setDirectBool] = useState(true)
    const [usuBool, setUsuBool] = useState(true)
    const [coord, setCoord] = useState({ lat: -31.399289, long: -64.1642636 })
    const [horario, sethorario] = useState("")
    const [accionUsu, setAccionUsu] = useState("")
    const [nombreCompl, setNombreCompl] = useState("")
    const [email, setEmail] = useState("")
    const [navegador, setNavegador] = useState("")
    const [dispositivo, setDispositivo] = useState("")
    const [direccion, setDireccion] = useState("")

    const { data, loading, error } = useFetch(
        url,
        {
            palabra: palabraBuscada,
            busquedaBool: busquedaBool
        },
        call,
        localStorage.getItem("loginInfo")
    )
    const [url2, setUrl2] = useState("")
    const [call2, setCall2] = useState(false)
    const [cookie, setCookie] = useState("")
    const { errorT } = useToken(
        url2,
        call2,
        cookie
    )

    const [nvaActCall, setNvaActCall] = useState(false)
    const [actividadStr, setActividadStr] = useState("")
    useActividad(
        nvaActCall,
        actividadStr
    )

    useEffect(() => {
        if (!loading) {
            if (!error) {
                if (data.length > 0) {
                    ListarOfertas()
                } else {
                    setListado(
                        <tr style={{ textAlign: "center", width: "100%" }}>
                            <td>
                                No hay visitas cargadas
                            </td>
                        </tr>
                    )
                }
            }
        }
        // eslint-disable-next-line
    }, [loading])

    useEffect(() => {
        setCookie(localStorage.getItem("loginInfo"))
        setUrl2(UrlNodeServer.Veriflog)
        setCall2(!call2)
        setUrl(UrlNodeServer.UltVisitas)
        setCall(!call)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setCall(!call)
        // eslint-disable-next-line
    }, [url])

    useEffect(() => {
        Detalles()
        // eslint-disable-next-line
    }, [idDetalle])

    useEffect(() => {
        GetDirecc()
        // eslint-disable-next-line
    }, [coord])

    const ListarOfertas = () => {
        let totallista
        try {
            totallista = parseInt(data.length)
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
                data.map((item, key) => {
                    return (
                        <FilaVisitas
                            key={key}
                            id={key}
                            item={item}
                            setIdDetalle={setIdDetalle}
                            setDetallesBool={setDetallesBool}
                        />
                    )
                })
            )
        }
    }

    const CancelarNvo = (e) => {
        e.preventDefault()
        setDetallesBool(false)
    }

    const EliminarVencidos = async (e) => {
        e.preventDefault()
        setEsperar2(true)
        await axios.delete(UrlNodeServer.DeleteOldVisit, {
            headers: {
                'x-access-token': cookie
            }
        })
            .then(res => {
                setEsperar2(false)
                const status = parseInt(res.data.status)
                if (status === 200) {
                    setMsgStrong("Visitas antiguas eliminadas! ")
                    setMsgGralAlert("")
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                    setCall(!call)
                    setActividadStr("El usuario ha eliminado visitas antiguas")
                    setNvaActCall(!nvaActCall)
                } else {
                    setMsgStrong("No hay visitas antiguas! ")
                    setMsgGralAlert("")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
    }

    const Detalles = async () => {
        setEsperar2(true)
        await axios.get(UrlNodeServer.ConsultaIP + "/" + idDetalle, {
            headers: {
                'x-access-token': cookie
            }
        })
            .then(async (res) => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const resultado = respuesta.result
                    console.log(`resultado`, resultado)
                    sethorario(formatDate(new Date(resultado.horario), "dd/mm/yyyy hor:min:seg") + " hs")
                    setAccionUsu(resultado.accion)
                    setNavegador(resultado.navegador)
                    setDispositivo(resultado.dispCompl)
                    setEmail(resultado.email)
                    setNombreCompl(resultado.nombreCompl)
                    setUsuBool(resultado.usuBool)
                    setDirectBool(resultado.directBool)
                    console.log(`object`, { lat: resultado.latitud, long: resultado.longitud })
                    setCoord({ lat: parseFloat(resultado.latitud), long: parseFloat(resultado.longitud) })
                    setEsperar2(false)
                } else {
                    setDetallesBool(false)
                    setEsperar2(false)
                }
            })
    }

    const GetDirecc = async () => {
        setEsperar3(true)
        const datos = {
            latitud: coord.lat,
            longitud: coord.long
        }
        console.log(`datos`, datos)
        await axios.post(UrlNodeServer.GetLocation2, datos, {
            headers: {
                'x-access-token': cookie
            }
        })
            .then(res => {
                setEsperar3(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const resultado = respuesta.result.direccionComp


                    let prov = ""
                    let ciudad = ""
                    let calle = ""
                    let alt = ""

                    resultado.forEach(element => {
                        const type = element.types[0]
                        if (type === "route") {
                            calle = element.short_name
                        } else if (type === "street_number") {
                            alt = element.short_name
                        } else if (type === "administrative_area_level_2") {
                            ciudad = element.short_name
                        } else if (type === "administrative_area_level_1") {
                            prov = element.short_name
                        }
                    });
                    setDireccion(calle + " " + alt + ", " + ciudad + ", " + prov)
                } else {
                    setDirectBool(false)
                }
            })
    }

    if (errorT) {
        return (
            <Redirect
                className="text-light"
                to={process.env.PUBLIC_URL + "/"}
            />
        )
    } else {

        return (
            <>
                <AlertaForm
                    success={successAlert}
                    msgStrong={msgStrongAlert}
                    msgGral={msgGralAlert}
                    alertar={alertar}
                />
                <Header />
                <Container className="mt--7" fluid>
                    <>
                        <Row style={
                            detallesBool ?
                                { display: "none" } :
                                { display: "block" }}>
                            <Col>
                                <Card className="shadow">
                                    <CardHeader className="border-0">
                                        <h2 className="mb-0" style={{ textAlign: "center" }}>Últimas Visitas</h2>
                                        <Row>
                                            <Col style={{ textAlign: "right" }}>
                                                <BusquedaForm
                                                    busquedaBool={busquedaBool}
                                                    setPalabraBuscada={(palabraBuscada) => setPalabraBuscada(palabraBuscada)}
                                                    palabraBuscada={palabraBuscada}
                                                    setBusquedaBool={(busquedaBool) => setBusquedaBool(busquedaBool)}
                                                    call={call}
                                                    setCall={(call) => setCall(call)}
                                                    tittle="Buscar IP"
                                                />

                                            </Col>

                                        </Row>

                                    </CardHeader>
                                    {
                                        loading ?
                                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                                            error ?
                                                null :
                                                esperar2 ?
                                                    <div style={{ textAlign: "center", marginTop: "100px" }}>
                                                        <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                                                    <>
                                                        <ListadoTable
                                                            listado={listado}
                                                            titulos={titulos}
                                                        />
                                                        <CardFooter className="py-4">
                                                            <nav aria-label="..." style={{ marginBottom: "20px" }}>
                                                                <Col md="4" style={{ marginTop: "30px" }}>
                                                                    <Row>
                                                                        <Col md="6" style={{ marginTop: "20px" }}>
                                                                            <button
                                                                                className="btn btn-danger"
                                                                                style={detallesBool ? { display: "none" } : { display: "block" }}
                                                                                onClick={e => EliminarVencidos(e)}
                                                                            >
                                                                                Limpiar visitas antiguas (6 meses)
                                                                         </button>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </nav>
                                                        </CardFooter>
                                                    </>
                                    }
                                </Card>
                            </Col>
                        </Row>

                        <Row style={
                            detallesBool ?
                                { display: "block", marginTop: "25px" } :
                                { display: "none", marginTop: "25px" }} >
                            {
                                esperar2 ?
                                    <div style={{ textAlign: "center", marginTop: "100px" }}>
                                        <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                                    <>
                                        <Col className="order-xl-1" md="12">
                                            <Card className="bg-secondary shadow">
                                                <CardHeader className="bg-white border-0">
                                                    <Row className="align-items-center">
                                                        <Col xs="9">
                                                            <h2>Detalles de la visita:</h2>
                                                        </Col>
                                                        <Col xs="3" style={{ textAlign: "right" }}>
                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={e => CancelarNvo(e)}
                                                            > x </button>
                                                        </Col>
                                                    </Row>
                                                </CardHeader>
                                                <CardBody>
                                                    <Row >
                                                        <Col md={directBool ? "8" : "12"}>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <label
                                                                            className="form-control-label"
                                                                            htmlFor="input-email"
                                                                        >
                                                                            Horario visita
                                                                    </label>
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            type="text"
                                                                            value={horario}
                                                                            disabled
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <label
                                                                            className="form-control-label"
                                                                            htmlFor="input-email"
                                                                        >
                                                                            Acción del usuario
                                                                    </label>
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            type="text"
                                                                            value={accionUsu}
                                                                            disabled
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            {
                                                                usuBool ?
                                                                    <Row>
                                                                        <Col md="6">
                                                                            <FormGroup>
                                                                                <label
                                                                                    className="form-control-label"
                                                                                    htmlFor="input-email"
                                                                                >
                                                                                    Nombre completo
                                                                                </label>
                                                                                <Input
                                                                                    className="form-control-alternative"
                                                                                    type="text"
                                                                                    value={nombreCompl}
                                                                                    disabled
                                                                                />
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md="6">
                                                                            <FormGroup>
                                                                                <label
                                                                                    className="form-control-label"
                                                                                    htmlFor="input-email"
                                                                                >
                                                                                    Email
                                                                                </label>
                                                                                <Input
                                                                                    className="form-control-alternative"
                                                                                    type="text"
                                                                                    value={email}
                                                                                    disabled
                                                                                />
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row> :
                                                                    null
                                                            }
                                                            <Row>
                                                                <Col md="4">
                                                                    <FormGroup>
                                                                        <label
                                                                            className="form-control-label"
                                                                            htmlFor="input-email"
                                                                        >
                                                                            Navegador
                                                                                </label>
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            type="text"
                                                                            value={navegador}
                                                                            disabled
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="8">
                                                                    <FormGroup>
                                                                        <label
                                                                            className="form-control-label"
                                                                            htmlFor="input-email"
                                                                        >
                                                                            Dispositivo
                                                                                </label>
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            type="text"
                                                                            value={dispositivo}
                                                                            disabled
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            {
                                                                espera3 ?
                                                                    <div style={{ textAlign: "center", marginTop: "50px" }}>
                                                                        <Spinner type="grow" color="primary" style={{ width: "50px", height: "50px" }} /> </div> :
                                                                    directBool ?
                                                                        <Row>
                                                                            <Col md="12">
                                                                                <FormGroup>
                                                                                    <label
                                                                                        className="form-control-label"
                                                                                        htmlFor="input-email"
                                                                                    >
                                                                                        Dirección
                                                                                </label>
                                                                                    <Input
                                                                                        className="form-control-alternative"
                                                                                        type="text"
                                                                                        value={direccion}
                                                                                        disabled
                                                                                    />
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row> :
                                                                        null
                                                            }
                                                        </Col>
                                                        {
                                                            espera3 ?
                                                                <div style={{ textAlign: "center", marginTop: "50px" }}>
                                                                    <Spinner type="grow" color="primary" style={{ width: "50px", height: "50px" }} /> </div> :
                                                                directBool ?
                                                                    <Col md="4">
                                                                        <Card className="shadow mapa2" >
                                                                            <CardHeader style={{ paddingBottom: 0 }}>
                                                                                <Row className="align-items-center">
                                                                                    <div className="col">
                                                                                        <h2 className="mb-0">Ubicación del visitante</h2>
                                                                                    </div>
                                                                                </Row>
                                                                            </CardHeader>
                                                                            <CardBody>
                                                                                <LocationUsuMap
                                                                                    lat={coord.lat}
                                                                                    lng={coord.long}
                                                                                />
                                                                            </CardBody>
                                                                        </Card>
                                                                    </Col> :
                                                                    null
                                                        }
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </>
                            }
                        </Row>
                    </>
                </Container>
            </>
        )
    }
}

export default ProductsItems;
