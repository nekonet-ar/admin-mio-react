import React, { useEffect, useState } from "react";
import { useFetch } from '../../Hooks/UseFetchPost2'
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
    Label,
    Input,
    Modal,
    Button
} from "reactstrap"
// core components
import Header from "components/Headers/Header.js";
import UrlNodeServer from '../../Globals/NodeServer'

import Paginacion from './Componentes/Paginacion/Paginacion'
import FilaProducto from './Componentes/Listados/SubComponentes/FilaPedidos'
import ListadoTable from './Componentes/Listados/ListadoTable'
import BusquedaForm from './Componentes/Productos/BusquedaForm'
import AlertaForm from './Componentes/Alertas/Alerta1'

import InfoPedidoDomi from './Componentes/GestionProd/InfoPedidoDomi'
import InfoPedidoSuc from './Componentes/GestionProd/InfoPedidoSuc'

import swal from 'sweetalert'

const titulos = ["Fecha Pedido", "Nº de Orden", "Método de Pago", "Provincia", "Ciudad", "Total", ""]

const ProductsItems = () => {
    const [alertar, setAlertar] = useState(false)
    const [msgStrongAlert, setMsgStrong] = useState("")
    const [msgGralAlert, setMsgGralAlert] = useState("")
    const [successAlert, setSuccessAlert] = useState(false)
    const [esperar2, setEsperar2] = useState(false)
    const [tipoPedidos, setTipoPedidos] = useState("pend")

    const [busquedaBool, setBusquedaBool] = useState(false)
    const [palabraBuscada, setPalabraBuscada] = useState("")
    const [plantPaginas, setPlantPaginas] = useState([])
    const [ultimaPag, setUltimaPag] = useState(0)
    const [url, setUrl] = useState("")
    const [call, setCall] = useState(false)
    const [pagina, setPagina] = useState(1)
    const [detallesBool, setDetallesBool] = useState(false)
    const [idDetalle, setIdDetalle] = useState(0)
    const [listado, setListado] = useState(<></>)

    //Datos del Detalle
    const [aDomi, setADomi] = useState("")
    const [sucCorreo, setSucCorreo] = useState("")
    const [provincia, setProvinvia] = useState("")
    const [ciudad, setCiudad] = useState("")
    const [direccion1, setDireccion1] = useState("")
    const [direccion2, setDireccion2] = useState("")
    const [codPost, setCodPost] = useState("")
    const [telefono, settelefono] = useState("")
    const [costoEnvio, setCostoEnvio] = useState("")
    const [nombre, setnombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [totalPedido, setTotalPedido] = useState("")
    const [statusPedido, setStatusPedido] = useState(1)
    const [pesoTotal, setPesoTotal] = useState("")
    const [listaProdPedido, setListaProdPedido] = useState([])
    const [codArea, setCodArea] = useState("")
    const [infoAdd, setInfoAdd] = useState("")
    const [casillaEmail, setCasillaEmail] = useState("")
    const [modalListaTags, setModalListaTags] = useState(false)
    const [plantProductos, setPlantProductos] = useState(<></>)
    const [costosTotal, setCostosTotal] = useState("")
    const [cuponName, setCuponName] = useState("")
    const [cuponTotal, setCuponTotal] = useState("")
    const [totalCliente, setTotalCliente] = useState("")

    const { data, loading, error } = useFetch(
        url,
        {
            type: tipoPedidos,
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

    useEffect(() => {
        if (!loading) {
            if (!error) {
                if (data.cantTotal) {
                    ListarOfertas()
                } else {
                    setListado(
                        <tr style={{ textAlign: "center", width: "100%" }}>
                            <td>
                                No hay productos cargados
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
        setUrl(UrlNodeServer.AdminPedidos + "/" + pagina)
        setCall(!call)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (detallesBool) {
            DetallesProducto()
        }
        // eslint-disable-next-line
    }, [detallesBool])

    useEffect(() => {
        setCall(!call)
        // eslint-disable-next-line
    }, [url, tipoPedidos])

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

                    return (
                        <FilaProducto
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

    const CancelarDet = (e) => {
        e.preventDefault()
        setDetallesBool(false)
        setCall(!call)
    }

    const DetallesProducto = async () => {
        const datos = {
            orderId: idDetalle
        }
        setEsperar2(true)
        await axios.post(UrlNodeServer.DetPedidoPendAdmin, datos, {
            headers: {
                'x-access-token': cookie
            }
        })
            .then(res => {
                setEsperar2(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const detalles = respuesta.result[0]
                    setADomi(detalles.aDomi)
                    setSucCorreo(detalles.sucursalCorreo)
                    setCodPost(detalles.codPost)
                    setProvinvia(detalles.provincia)
                    setCiudad(detalles.ciudad)
                    setDireccion1(detalles.direccion1)
                    setDireccion2(detalles.direccion2)
                    setCodArea(detalles.codArea)
                    settelefono(detalles.telefono)
                    setCostoEnvio(detalles.costoEnvio)
                    setnombre(detalles.nombre)
                    setApellido(detalles.apellido)
                    setTotalPedido(detalles.totalProd)
                    setListaProdPedido(detalles.lista)
                    console.log(`Detalles.statusEnv)`, detalles.statusEnv)
                    setStatusPedido(parseInt(detalles.statusEnv))
                    setPesoTotal(detalles.pesoTotal)
                    setInfoAdd(detalles.infoAdd)
                    setCasillaEmail(detalles.casillaEmail)
                    setCostosTotal(detalles.costosTotal)
                    setTotalCliente(detalles.total)
                    setCuponName(detalles.cupoName)
                    setCuponTotal(detalles.totalDescuento)
                } else {
                    swal({
                        title: "Error inesperado!",
                        text: "Hubo un error en el servidor. Puede que su sesión haya expirado.",
                        icon: "warning",
                        dangerMode: true,
                    })
                }
            })
    }

    const ConfirmarEnvio = (e) => {
        e.preventDefault()
        swal({
            text: 'Coloque el número de tracking de Correo Argentino:',
            content: "input",
            button: {
                text: "Continuar",
                closeModal: false,
            },
        })
            .then(async trackCorreo => {
                if (trackCorreo) {
                    if (trackCorreo.length > 4) {
                        const datos = {
                            idOrder: idDetalle,
                            codSeguimiento: trackCorreo
                        }
                        setEsperar2(true)
                        await axios.post(UrlNodeServer.ConfirmEnvio, datos, {
                            headers: {
                                "x-access-token": cookie
                            }
                        })
                            .then(res => {
                                setEsperar2(false)
                                const respuesta = res.data
                                const status = parseInt(respuesta.status)
                                if (status === 200) {
                                    setMsgStrong("Registrado con éxito! ")
                                    setMsgGralAlert("Ya se envió un email al cliente dandole el aviso del código")
                                    setSuccessAlert(true)
                                    setAlertar(!alertar)
                                    setDetallesBool(false)
                                    setCall(!call)
                                    swal.close()
                                } else {
                                    setMsgStrong("Error! ")
                                    setMsgGralAlert("No se pudo realizar el registro")
                                    setSuccessAlert(false)
                                    setAlertar(!alertar)
                                    swal.close()
                                }
                            })
                    } else {
                        swal({
                            title: "Código muy corto!",
                            text: "Verifique el código que ha colocado, es muy corto.",
                            icon: "warning",
                            dangerMode: true,
                        })
                    }
                }
            })
    }

    const ConfirmarEntrega = (e) => {
        e.preventDefault()

        swal({
            title: "Confirmar entrega Nº " + idDetalle,
            text: "¿Está seguro de confirmar la entrega? Esta desición es permanente.",
            icon: "warning",
            buttons: {
                cancel: "No",
                Si: true,
                closeModal: false
            }
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    setEsperar2(true)

                    const datos = {
                        idOrder: idDetalle
                    }

                    await axios.post(UrlNodeServer.PedidoEntregado, datos, {
                        headers: {
                            "x-access-token": cookie
                        }
                    })
                        .then(res => {
                            setEsperar2(false)
                            const respuesta = res.data
                            const status = parseInt(respuesta.status)
                            if (status === 200) {
                                setMsgStrong("Registrado con éxito! ")
                                setMsgGralAlert("Ya se envió un email al cliente dandole el aviso de entrega")
                                setSuccessAlert(true)
                                setAlertar(!alertar)
                                setDetallesBool(false)
                                setCall(!call)
                                swal.close()
                            } else {
                                setMsgStrong("Error! ")
                                setMsgGralAlert("No se pudo realizar el registro")
                                setSuccessAlert(false)
                                setAlertar(!alertar)
                                swal.close()
                            }
                        })
                }
            })
    }

    const ActionCancelPedido = async () => {

        const datos = {
            orderId: idDetalle
        }
        await axios.post(UrlNodeServer.CancelarPedidoAdmin, datos, {
            headers: {
                "x-access-token": cookie
            }
        })
            .then(async res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    setMsgStrong("Cancelado con éxito! ")
                    setMsgGralAlert("Ahora se procede a realizar la Nota de Crédito")
                    setSuccessAlert(true)
                    setAlertar(!alertar)

                    await axios.post(UrlNodeServer.CrearNotaCredAdmin, datos, {
                        headers: {
                            "x-access-token": cookie
                        }
                    })
                        .then(async res2 => {
                            const respuesta2 = res2.data
                            const status2 = parseInt(respuesta2.status)
                            if (status2 === 200) {
                                setMsgStrong("CNota de crédito realizada! ")
                                setMsgGralAlert("Ahora se procede a enviar la Nota de Crédito por email")
                                setSuccessAlert(true)
                                const datos2 = {
                                    orderId: idDetalle,
                                    notaCred: true
                                }
                                await axios.post(UrlNodeServer.GetInfoEmailPDF, datos2, {
                                    headers: {
                                        "x-access-token": cookie
                                    }
                                })
                                    .then(async res3 => {
                                        const respuest3 = res3.data
                                        const status3 = parseInt(respuest3.status)
                                        if (status3 === 200) {
                                            const datos3 = respuest3.result

                                            await axios.post(UrlNodeServer.EnvioFactura, datos3, {
                                                headers: {
                                                    "x-access-token": cookie
                                                }
                                            })
                                                .then(res4 => {
                                                    const status4 = parseInt(res4.data.status)
                                                    if (status4 === 200) {
                                                        setEsperar2(false)
                                                        setMsgStrong("Nota de crédito enviada! ")
                                                        setMsgGralAlert("La nota de credito ya fué enviada al cliente!")
                                                        setSuccessAlert(true)
                                                        setAlertar(!alertar)
                                                        setDetallesBool(false)
                                                        setCall(!call)
                                                    } else {
                                                        setEsperar2(false)
                                                        setMsgStrong("Error! ")
                                                        setMsgGralAlert("No se pudo enviar la Nota de Crédito")
                                                        setSuccessAlert(false)
                                                        setAlertar(!alertar)
                                                    }
                                                })
                                        } else {
                                            setEsperar2(false)
                                            setMsgStrong("Error! ")
                                            setMsgGralAlert("No se pudo enviar la Nota de Crédito")
                                            setSuccessAlert(false)
                                            setAlertar(!alertar)
                                        }
                                    })

                            } else {
                                setEsperar2(false)
                                setMsgStrong("Error! ")
                                setMsgGralAlert("No se pudo realizar la Nota de Crédito")
                                setSuccessAlert(false)
                                setAlertar(!alertar)
                            }
                        })
                } else {
                    setEsperar2(false)
                    setMsgStrong("Error! ")
                    setMsgGralAlert("No se pudo cancelar el pedido")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
    }

    const CancelarPedido = (e) => {
        e.preventDefault()

        swal({
            title: "Cancelar pedido Nº " + idDetalle,
            text: "¿Está seguro de cancelar este pedido? Esta desición es permanente.",
            icon: "warning",
            buttons: {
                cancel: "No",
                Si: true,
                closeModal: false
            }
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    setEsperar2(true)
                    ActionCancelPedido()
                }
            })
    }

    const ReenviarFactura = async (e) => {
        e.preventDefault()
        const datos = {
            orderId: idDetalle,
            notaCred: false
        }
        setEsperar2(true)
        await axios.post(UrlNodeServer.GetInfoEmailPDF, datos, {
            headers: {
                "x-access-token": cookie
            }
        })
            .then(async res => {
                const status = parseInt(res.data.status)
                if (status === 200) {
                    const datos2 = res.data.result
                    await axios.post(UrlNodeServer.EnvioFactura, datos2, {
                        headers: {
                            "x-access-token": cookie
                        }
                    })
                        .then(res2 => {
                            const status2 = parseInt(res2.data.status)
                            if (status2 === 200) {
                                setEsperar2(false)
                                setMsgStrong("Facturao enviada! ")
                                setMsgGralAlert("La factura ya fué enviada al cliente!")
                                setSuccessAlert(true)
                                setAlertar(!alertar)
                            } else {
                                setEsperar2(false)
                                setMsgStrong("Error! ")
                                setMsgGralAlert("No se pudo enviar la Factura. Es muy probable que nunca se haya generado")
                                setSuccessAlert(false)
                                setAlertar(!alertar)
                            }
                        })
                } else {
                    setEsperar2(false)
                    setMsgStrong("Error! ")
                    setMsgGralAlert("No se pudo enviar la Factura")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }

            })
    }

    const ReenviarNotaCred = async (e) => {
        e.preventDefault()
        const datos = {
            orderId: idDetalle,
            notaCred: true
        }
        setEsperar2(true)
        await axios.post(UrlNodeServer.GetInfoEmailPDF, datos, {
            headers: {
                "x-access-token": cookie
            }
        })
            .then(async res => {
                const status = parseInt(res.data.status)
                if (status === 200) {
                    const datos2 = res.data.result
                    await axios.post(UrlNodeServer.EnvioFactura, datos2, {
                        headers: {
                            "x-access-token": cookie
                        }
                    })
                        .then(res2 => {
                            const status2 = parseInt(res2.data.status)
                            if (status2 === 200) {
                                setEsperar2(false)
                                setMsgStrong("Facturao enviada! ")
                                setMsgGralAlert("La nota de crédito ya fué enviada al cliente!")
                                setSuccessAlert(true)
                                setAlertar(!alertar)
                            } else {
                                setEsperar2(false)
                                setMsgStrong("Error! ")
                                setMsgGralAlert("No se pudo enviar la nota de crédito. Es muy probable que nunca se haya generado y tampoco la factura")
                                setSuccessAlert(false)
                                setAlertar(!alertar)
                            }
                        })
                } else {
                    setEsperar2(false)
                    setMsgStrong("Error! ")
                    setMsgGralAlert("No se pudo enviar la nota de crédito")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
    }

    const VerProductos = (e) => {
        e.preventDefault()
        ListarProductos()
        setModalListaTags(true)
    }

    const ListarProductos = () => {
        setPlantProductos(
            listaProdPedido.map((item, key) => {
                return (
                    <Col lg="12" key={key} style={{ border: "2px solid red", marginBottom: "20px" }}>
                        <Row>
                            <Col lg="12">
                                <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-email"
                                    >
                                        Producto
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        id="input-email"
                                        type="text"
                                        value={item.productName}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        {
                            item.tipo === null ?
                                null :
                                <>
                                    <Row>
                                        <Col lg="6">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="input-email"
                                                >
                                                    {item.tipo}
                                                </label>
                                                <Input
                                                    className="form-control-alternative"
                                                    id="input-email"
                                                    type="text"
                                                    value={item.variedad}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </>
                        }
                        <Row>
                            <Col lg="12">
                                <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-email"
                                    >
                                        Cantidad
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        id="input-email"
                                        type="text"
                                        value={item.cantProd}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="12">
                                <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-email"
                                    >
                                        Precio
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        id="input-email"
                                        type="text"
                                        value={"$" + item.price}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                    </Col>
                )
            })
        )
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
                                        <h2 className="mb-0" style={{ textAlign: "center" }}>Lista de Pedidos</h2>
                                        <Row>
                                            <Col>
                                                <Col style={{ textAlign: "left", maxWidth: "250px" }}>
                                                    <FormGroup>
                                                        <Label for="exampleSelect">Estado de los pedidos</Label>
                                                        <Input type="select" onChange={e => setTipoPedidos(e.target.value)}>
                                                            <option value="pend">Pendientes de envío</option>
                                                            <option value="env">Envíados</option>
                                                            <option value="end">Entregados</option>
                                                            <option value="canc">Cancelados</option>
                                                        </Input>
                                                    </FormGroup>
                                                </Col>

                                            </Col>
                                            <Col style={{ textAlign: "right" }}>
                                                <BusquedaForm
                                                    busquedaBool={busquedaBool}
                                                    setPalabraBuscada={(palabraBuscada) => setPalabraBuscada(palabraBuscada)}
                                                    palabraBuscada={palabraBuscada}
                                                    setBusquedaBool={(busquedaBool) => setBusquedaBool(busquedaBool)}
                                                    call={call}
                                                    setCall={(call) => setCall(call)}
                                                    tittle="Buscar por cliente"
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
                                                <>
                                                    <ListadoTable
                                                        listado={listado}
                                                        titulos={titulos}
                                                    />
                                                    <CardFooter className="py-4">


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
                            detallesBool ?
                                { display: "block", marginTop: "25px" } :
                                { display: "none", marginTop: "25px" }} >
                            <Col className="order-xl-1" md="12">
                                <Card className="bg-secondary shadow">
                                    <CardHeader className="bg-white border-0">
                                        <Row className="align-items-center">
                                            <Col xs="9">

                                            </Col>
                                            <Col xs="3" style={{ textAlign: "right" }}>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={e => CancelarDet(e)}

                                                > x
                                                            </button>
                                            </Col>
                                        </Row>
                                    </CardHeader>
                                    <CardBody>
                                        <Form>

                                            {esperar2 ?
                                                null :
                                                statusPedido === 1 ?
                                                    <h2 className="heading-small text-muted mb-4" style={{ fontSize: "20px", color: "blue" }}>
                                                        Pendiente de Envio
                                                           </h2> :
                                                    statusPedido === 2 ?
                                                        <h2 className="heading-small text-muted mb-4 text-primary" style={{ fontSize: "20px" }}>
                                                            Enviado
                                                           </h2> :
                                                        statusPedido === 3 ?
                                                            <h2 className="heading-small text-muted mb-4 text-primary" style={{ fontSize: "20px" }}>
                                                                Entregado
                                                           </h2> :
                                                            <h2 className="heading-small text-muted mb-4 text-primary" style={{ fontSize: "20px" }}>
                                                                Cancelado
                                                           </h2>
                                            }

                                            {
                                                esperar2 ?
                                                    <div style={{ textAlign: "center", marginTop: "100px" }}>
                                                        <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                                                    <>

                                                        <hr className="my-4" />
                                                        <div className="pl-lg-4">
                                                            {
                                                                parseInt(aDomi) === 1 ?
                                                                    <InfoPedidoDomi
                                                                        provincia={provincia}
                                                                        ciudad={ciudad}
                                                                        direccion1={direccion1}
                                                                        direccion2={direccion2}
                                                                        codPost={codPost}
                                                                        telefono={telefono}
                                                                        nombre={nombre}
                                                                        apellido={apellido}
                                                                        codArea={codArea}
                                                                        infoAdd={infoAdd}
                                                                        casillaEmail={casillaEmail}
                                                                    />
                                                                    :
                                                                    <InfoPedidoSuc
                                                                        sucCorreo={sucCorreo}
                                                                        provincia={provincia}
                                                                        ciudad={ciudad}
                                                                        telefono={telefono}
                                                                        nombre={nombre}
                                                                        apellido={apellido}
                                                                        codArea={codArea}
                                                                        casillaEmail={casillaEmail}
                                                                    />
                                                            }


                                                        </div>
                                                        <hr className="my-4" />
                                                        <div className="pl-lg-4">
                                                            <Row>
                                                                <Col lg="3">
                                                                    <FormGroup>
                                                                        <label
                                                                            className="form-control-label"
                                                                            htmlFor="input-email"
                                                                        >
                                                                            Pego en gramos (Total)
                                                                                            </label>
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            id="input-email"
                                                                            type="text"
                                                                            value={pesoTotal + " g"}
                                                                            disabled
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col lg="3">
                                                                    <FormGroup>
                                                                        <label
                                                                            className="form-control-label"
                                                                            htmlFor="input-email"
                                                                        >
                                                                            Precio de los productos
                                                                                            </label>
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            id="input-email"
                                                                            type="text"
                                                                            value={"$ " + totalPedido}
                                                                            disabled
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col lg="3">
                                                                    <FormGroup>
                                                                        <label
                                                                            className="form-control-label"
                                                                            htmlFor="input-email"
                                                                        >
                                                                            Costo de los productos
                                                                                            </label>
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            id="input-email"
                                                                            type="text"
                                                                            value={"$ " + costosTotal}
                                                                            disabled
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col lg="3">
                                                                    <FormGroup>
                                                                        <label
                                                                            className="form-control-label"
                                                                            htmlFor="input-email"
                                                                        >
                                                                            Costo de envío calculado
                                                                                            </label>
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            id="input-email"
                                                                            type="text"
                                                                            value={"$ " + costoEnvio}
                                                                            disabled
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        <div className="pl-lg-4">
                                                            <Row>
                                                                <Col lg="4">
                                                                    <FormGroup>
                                                                        <label
                                                                            className="form-control-label"
                                                                            htmlFor="input-email"
                                                                        >
                                                                            Cupón de descuento
                                                                                            </label>
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            id="input-email"
                                                                            type="text"
                                                                            value={cuponName}
                                                                            disabled
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col lg="4">
                                                                    <FormGroup>
                                                                        <label
                                                                            className="form-control-label"
                                                                            htmlFor="input-email"
                                                                        >
                                                                            Total descuento
                                                                                            </label>
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            id="input-email"
                                                                            type="text"
                                                                            value={"$ " + cuponTotal}
                                                                            disabled
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col lg="4">
                                                                    <FormGroup>
                                                                        <label
                                                                            className="form-control-label"
                                                                            htmlFor="input-email"
                                                                        >
                                                                            Pago del cliente
                                                                                            </label>
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            id="input-email"
                                                                            type="text"
                                                                            value={"$ " + totalCliente}
                                                                            disabled
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </>
                                            }

                                            <Row style={{ marginTop: "15px" }}>
                                                <Col lg="12" style={{ textAlign: "center" }}>
                                                    <FormGroup>
                                                        <Row>
                                                            <Col lg="12" style={{ textAlign: "center" }}>
                                                                {
                                                                    tipoPedidos === "pend" ?
                                                                        <button
                                                                            className="btn btn-danger"
                                                                            onClick={e => CancelarPedido(e)}
                                                                        >
                                                                            Cancelar Pedido
                                                                            </button> :
                                                                        null
                                                                }
                                                                {
                                                                    tipoPedidos === "pend" ?
                                                                        <button
                                                                            className="btn btn-success"
                                                                            onClick={e => ConfirmarEnvio(e)}
                                                                        >
                                                                            Confirmar Envío
                                                                            </button> :
                                                                        null
                                                                }
                                                                {
                                                                    tipoPedidos === "env" ?
                                                                        <button
                                                                            className="btn btn-success"
                                                                            onClick={e => ConfirmarEntrega(e)}
                                                                        >
                                                                            Confirmar Entrega
                                                                            </button> :
                                                                        null
                                                                }

                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={e => VerProductos(e)}
                                                                >
                                                                    Ver Productos
                                                                        </button>
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ marginTop: "25px" }}>
                                                            <Col lg="12" style={{ textAlign: "center" }}>
                                                                {null}
                                                                <button
                                                                    className="btn btn-danger"
                                                                    onClick={e => ReenviarFactura(e)}
                                                                >
                                                                    Reenviar Factura
                                                                        </button>
                                                                {
                                                                    tipoPedidos === "canc" ?
                                                                        <button
                                                                            className="btn btn-warning"
                                                                            onClick={e => ReenviarNotaCred(e)}
                                                                        >
                                                                            Reenviar Nota de Crédito
                                                                            </button> :
                                                                        null
                                                                }
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                    <Modal
                                                        className="modal-dialog-centered"
                                                        isOpen={modalListaTags}
                                                        toggle={() => setModalListaTags(false)}
                                                    >
                                                        <div className="modal-header">
                                                            <h4 className="modal-title">
                                                                Productos de la orden Nº{idDetalle}
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
                                                            {plantProductos}
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
                                                </Col>
                                            </Row>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </>

                </Container>
            </>
        )
    }
}

export default ProductsItems;
