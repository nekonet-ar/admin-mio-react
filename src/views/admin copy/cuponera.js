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
    Form,
    FormGroup,
    Input
} from "reactstrap"
// core components
import Header from "components/Headers/Header.js";
import UrlNodeServer from '../../Globals/NodeServer'

import Paginacion from './Componentes/Paginacion/Paginacion'
import FilaCupon from './Componentes/Listados/SubComponentes/FilaCupon'
import ListadoTable from './Componentes/Listados/ListadoTable'
import BusquedaForm from './Componentes/Productos/BusquedaForm'
import AlertaForm from './Componentes/Alertas/Alerta1'

const titulos = ["Cupón", "Tipo de Cupón", "Descuento Máximo", "Monto Mínimo", "Stock", "Vencimiento Cupón", ""]

const ProductsItems = () => {
    const [alertar, setAlertar] = useState(false)
    const [msgStrongAlert, setMsgStrong] = useState("")
    const [msgGralAlert, setMsgGralAlert] = useState("")
    const [successAlert, setSuccessAlert] = useState(false)
    const [esperar2, setEsperar2] = useState(false)

    const [busquedaBool, setBusquedaBool] = useState(false)
    const [palabraBuscada, setPalabraBuscada] = useState("")
    const [plantPaginas, setPlantPaginas] = useState([])
    const [ultimaPag, setUltimaPag] = useState(0)
    const [url, setUrl] = useState("")
    const [call, setCall] = useState(false)
    const [pagina, setPagina] = useState(1)
    const [listado, setListado] = useState(<></>)
    const [nvoCupon, setNvoCupon] = useState(false)

    //Datos del Cupón
    const [nombre, setNombre] = useState("")
    const [tipo, setTipo] = useState(0)
    const [montoMin, setmontoMin] = useState("")
    const [vtoCupon, setVtoCupon] = useState("")
    const [porc, setPorc] = useState("")
    const [montoDesc, setMontoDesc] = useState("")
    const [descMax, setDescMax] = useState("")
    const [stock, setStock] = useState("")

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
        setCookie(localStorage.getItem("loginInfo"))
        setUrl2(UrlNodeServer.Veriflog)
        setCall2(!call2)
        setUrl(UrlNodeServer.ListaCupones + "/" + pagina)
        setCall(!call)
        // eslint-disable-next-line
    }, [])

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
            setUltimaPag(data.totalPag)
            setListado(
                data.listado.map((item, key) => {
                    let primero
                    if (key === 0) {
                        primero = true
                    } else {
                        primero = false
                    }
                    return (
                        <FilaCupon
                            id={key}
                            key={key}
                            item={item}
                            setActividadStr={() => setActividadStr()}
                            nvaActCall={nvaActCall}
                            setNvaActCall={(nvaActCall) => setNvaActCall(nvaActCall)}
                            alertar={alertar}
                            setAlertar={(alertar) => setAlertar(alertar)}
                            setMsgStrong={(msgStrong) => setMsgStrong(msgStrong)}
                            setMsgGralAlert={(msgGralAlert) => setMsgGralAlert(msgGralAlert)}
                            setSuccessAlert={(successAlert) => setSuccessAlert(successAlert)}
                            setCall={(call) => setCall(call)}
                            call={call}
                            setEsperar={() => setEsperar2()}
                            primero={primero}
                            pagina={pagina}
                            setPagina={setPagina}
                        />
                    )
                })
            )
        }
    }

    const NvaOferta = (e) => {
        e.preventDefault()
        setNvoCupon(true)
    }

    const CancelarNvo = (e) => {
        e.preventDefault()
        setNvoCupon(false)
    }

    const EliminarVencidos = async (e) => {
        e.preventDefault()
        setEsperar2(true)
        await axios.delete(UrlNodeServer.EliminarVencidos, {
            headers: {
                'x-access-token': cookie
            }
        })
            .then(res => {
                setEsperar2(false)
                const status = parseInt(res.data.status)
                if (status === 200) {
                    setMsgStrong("Cupones vencido o sin stock eliminados con éxito!")
                    setMsgGralAlert("")
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                    ResetForm()
                    setNvoCupon(false)
                    setCall(!call)
                } else if (status === 500) {
                    setMsgStrong("No hay cupones vencidos o sin stock! ")
                    setMsgGralAlert("")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                } else {
                    setMsgStrong("Hubo un error! ")
                    setMsgGralAlert("Probablemente la sesión esté caducada.")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                    setTimeout(() => {
                        setCall2(!call2)
                    }, 1000);
                }
            })
    }

    const NuevoCupon = async (e) => {
        e.preventDefault()
        setEsperar2(true)
        const datos = {
            nombre,
            tipo,
            montoMin,
            vtoCupon,
            porc,
            montoDesc,
            descMax,
            stock
        }
        await axios.post(UrlNodeServer.NvoCupon, datos, {
            headers: {
                'x-access-token': cookie
            }
        })
            .then(res => {
                setEsperar2(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    setMsgStrong("Cupón agregado con éxito! ")
                    setMsgGralAlert("")
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                    ResetForm()
                    setNvoCupon(false)
                    setCall(!call)
                } else {
                    setMsgStrong("Hubo un error! ")
                    setMsgGralAlert("Controle el nombre del cupón! no puede haber cupones repetidos.")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                    setCall(!call)
                }
            })
    }

    const ResetForm = () => {
        setNombre("")
        setTipo(0)
        setmontoMin("")
        setVtoCupon("")
        setPorc("")
        setMontoDesc("")
        setDescMax("")
        setStock("")
    }

    const OnekeyDown = (e) => {
        if (e.keyCode === 32) {
            e.preventDefault()
        }
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
                            nvoCupon ?
                                { display: "none" } :
                                { display: "block" }}>
                            <Col>
                                <Card className="shadow">
                                    <CardHeader className="border-0">
                                        <h2 className="mb-0" style={{ textAlign: "center" }}>Lista de Cupones</h2>
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
                                                                                className="btn btn-primary"
                                                                                style={nvoCupon ? { display: "none", width: "200px" } : { display: "block", width: "200px" }}
                                                                                onClick={e => NvaOferta(e)}
                                                                            >
                                                                                Nuevo Cupón
                                                                         </button>
                                                                        </Col>
                                                                        <Col md="6" style={{ marginTop: "20px" }}>
                                                                            <button
                                                                                className="btn btn-danger"
                                                                                style={nvoCupon ? { display: "none" } : { display: "block" }}
                                                                                onClick={e => EliminarVencidos(e)}
                                                                            >
                                                                                Eliminar Cupones Vencidos
                                                                         </button>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </nav>

                                                            <Paginacion
                                                                setPagina={(pagina) => setPagina(pagina)}
                                                                setCall={(call) => setCall(call)}
                                                                pagina={pagina}
                                                                call={call}
                                                                plantPaginas={plantPaginas}
                                                                ultimaPag={ultimaPag}
                                                                data={data}
                                                                setPlantPaginas={(plantPaginas) => setPlantPaginas(plantPaginas)}
                                                                setUltimaPag={(ultimaPag) => setUltimaPag(ultimaPag)}
                                                            />
                                                        </CardFooter>
                                                    </>
                                    }
                                </Card>
                            </Col>
                        </Row>

                        <Row style={
                            nvoCupon ?
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
                                                    <Form onSubmit={e => NuevoCupon(e)}>
                                                        <h2 className="heading-small text-muted mb-4" style={{ fontSize: "20px", color: "blue" }}>
                                                            Nuevo Cupón
                                                        </h2>
                                                        <Row>
                                                            <Col lg="4">
                                                                <FormGroup>
                                                                    <label
                                                                        className="form-control-label"
                                                                        htmlFor="input-email"
                                                                    >
                                                                        Nombre de Cupón
                                                                    </label>
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        id="input-email"
                                                                        type="text"
                                                                        value={nombre}
                                                                        onChange={e => setNombre(e.target.value)}
                                                                        placeholder="Nombre..."
                                                                        onKeyDown={e => OnekeyDown(e)}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg="4">
                                                                <FormGroup>
                                                                    <label
                                                                        className="form-control-label"
                                                                        htmlFor="input-email"
                                                                    >
                                                                        Compra Mínimo
                                                                    </label>
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        id="input-email"
                                                                        type="number"
                                                                        min={0}
                                                                        step={0.01}
                                                                        value={montoMin}
                                                                        onChange={e => setmontoMin(e.target.value)}
                                                                        placeholder="Compra mínimo..."
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg="4">
                                                                <FormGroup>
                                                                    <label
                                                                        className="form-control-label"
                                                                        htmlFor="input-email"
                                                                    >
                                                                        Vto. Cupón
                                                                    </label>
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        id="input-email"
                                                                        type="date"
                                                                        value={vtoCupon}
                                                                        onChange={e => setVtoCupon(e.target.value)}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ textAlign: "center" }}>
                                                            <Col lg={
                                                                parseInt(tipo) === 0 ?
                                                                    "4" : "3"
                                                            }>
                                                                <FormGroup>
                                                                    <label
                                                                        className="form-control-label"
                                                                        htmlFor="input-email"
                                                                    >
                                                                        Tipo de Cupón
                                                                    </label>
                                                                    <Input type="select" value={tipo} onChange={e => setTipo(e.target.value)}>
                                                                        <option value={0}>Monto Fijo</option>
                                                                        <option value={1}>Porcentual</option>
                                                                    </Input>
                                                                </FormGroup>
                                                            </Col>
                                                            {
                                                                parseInt(tipo) === 0 ?
                                                                    <Col lg="4">
                                                                        <FormGroup>
                                                                            <label
                                                                                className="form-control-label"
                                                                                htmlFor="input-email"
                                                                            >
                                                                                Monto del Descuento
                                                                            </label>
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                id="input-email"
                                                                                type="number"
                                                                                min={0.01}
                                                                                step={0.01}
                                                                                value={montoDesc}
                                                                                onChange={e => setMontoDesc(e.target.value)}
                                                                                placeholder="Monto de descuento..."
                                                                            />
                                                                        </FormGroup>
                                                                    </Col> :
                                                                    <>
                                                                        <Col lg="3">
                                                                            <FormGroup>
                                                                                <label
                                                                                    className="form-control-label"
                                                                                    htmlFor="input-email"
                                                                                >
                                                                                    Porcentaje
                                                                                </label>
                                                                                <Input
                                                                                    className="form-control-alternative"
                                                                                    id="input-email"
                                                                                    type="number"
                                                                                    min={1}
                                                                                    step={1}
                                                                                    max={100}
                                                                                    value={porc}
                                                                                    onChange={e => setPorc(e.target.value)}
                                                                                    placeholder="Porcentaje..."
                                                                                />
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col lg="3">
                                                                            <FormGroup>
                                                                                <label
                                                                                    className="form-control-label"
                                                                                    htmlFor="input-email"
                                                                                >
                                                                                    Descuento Máximo
                                                                                </label>
                                                                                <Input
                                                                                    className="form-control-alternative"
                                                                                    id="input-email"
                                                                                    type="number"
                                                                                    min={0.01}
                                                                                    step={0.01}
                                                                                    value={descMax}
                                                                                    onChange={e => setDescMax(e.target.value)}
                                                                                    placeholder="Monto máximo..."
                                                                                />
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </>
                                                            }

                                                            <Col lg={
                                                                parseInt(tipo) === 0 ?
                                                                    "4" : "3"
                                                            }>
                                                                <FormGroup>
                                                                    <label
                                                                        className="form-control-label"
                                                                        htmlFor="input-email"
                                                                    >
                                                                        Cantidad de cupones
                                                                    </label>
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        id="input-email"
                                                                        type="number"
                                                                        min={1}
                                                                        step={1}
                                                                        value={stock}
                                                                        onChange={e => setStock(e.target.value)}
                                                                        placeholder="Cant. de cupones..."
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md="12" style={{ marginTop: "40px", textAlign: "center" }}>
                                                                <button
                                                                    className="btn btn-primary"
                                                                    style={{ width: "200px" }}
                                                                    type="submit"
                                                                >
                                                                    Agregar Cupón
                                                                </button>
                                                            </Col>
                                                        </Row>
                                                    </Form>
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
