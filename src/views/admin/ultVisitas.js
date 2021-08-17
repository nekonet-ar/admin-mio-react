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
    CardFooter,
    Container,
    Row,
    Spinner,
    Col,
    Input,
    Form,
    FormGroup,
    CardBody,
    Label
} from "reactstrap"
// core components
import Header from "components/Headers/Header.js";
import UrlNodeServer from '../../Globals/NodeServer'
import AlertaForm from './Componentes/Alertas/Alerta1'
import FileSaver from 'file-saver'

const titulos = ["Fecha", "Saldo Inicial", "Mov. del Día", "Saldo Final", ""]

const ProductsItems = () => {
    const [alertar, setAlertar] = useState(false)
    const [msgStrongAlert, setMsgStrong] = useState("")
    const [msgGralAlert, setMsgGralAlert] = useState("")
    const [successAlert, setSuccessAlert] = useState(false)
    const [esperar2, setEsperar2] = useState(false)
    const [esperar3, setEsperar3] = useState(false)

    const [busquedaBool, setBusquedaBool] = useState(false)
    const [url, setUrl] = useState("")
    const [call, setCall] = useState(false)
    const [listado, setListado] = useState(<></>)
    const [detallesBool, setDetallesBool] = useState(false)
    const [idDetalle, setIdDetalle] = useState(0)

    const [empresa, setEmpresa] = useState(0)
    const [cuit, setCuit] = useState("")
    const [razSoc, setRazSoc] = useState("")
    const [condIva, setCondIva] = useState(0)
    const [verif, setVerif] = useState(false)
    const [fechaFact, setFechaFact] = useState("")
    const [descr, setDescr] = useState("")
    const [total, setTotal] = useState("")

    const [desde, setDesde] = useState("")
    const [hasta, setHasta] = useState("")
    const [pagina, setPagina] = useState(1)
    const [plantPaginas, setPlantPaginas] = useState([])
    const [ultimaPag, setUltimaPag] = useState(0)

    const { data, loading, error } = useFetch(
        url,
        {
            busqueda: busquedaBool,
            desde: desde,
            hasta: hasta,
            pageAct: pagina

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
                if (data.totalPag > 0) {
                } else {
                    setListado(
                        <tr style={{ textAlign: "center", width: "100%" }}>
                            <td>
                                No hay extractos cargados
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
        setUrl(UrlNodeServer.ListadoExtractos)
        setCall(!call)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setCall(!call)
        // eslint-disable-next-line
    }, [url])

    const DatosAfip = async (e) => {
        e.preventDefault()
        setEsperar3(true)
        const datos = {
            cuit: cuit
        }
        console.log(`datos`, datos)
        await axios.post(UrlNodeServer.DatosCuit, datos, {
            headers: {
                "x-access-token": localStorage.getItem("loginInfo")
            }
        })
            .then(res => {
                setEsperar3(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    console.log(`respuesta.result`, respuesta.result)
                    const resultado = respuesta.result
                    setCondIva(parseInt(resultado.impuestoId))
                    setRazSoc(resultado.razSocial)
                    setVerif(true)
                } else {
                    setMsgStrong("No es un CUIT valido! ")
                    setMsgGralAlert("")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
    }

    const CancelarCuit = (e) => {
        e.preventDefault()
        setVerif(false)
    }

    const CrearFactura = async (e) => {
        e.preventDefault()
        const datos = {
            tCliente: empresa,
            cuit: cuit,
            razSoc: razSoc,
            condIva: condIva,
            fecha: fechaFact,
            descr: descr,
            total: total
        }
        setEsperar2(true)
        await axios.post(UrlNodeServer.CrearFactura, datos, {
            responseType: 'arraybuffer',
            headers: {
                "x-access-token": localStorage.getItem("loginInfo"),
                Accept: 'application/pdf',
            }
        })
            .then(res => {
                let headerLine = res.headers['content-disposition'];
                const largo = parseInt(headerLine.length)
                let filename = headerLine.substring(9, largo);
                var blob = new Blob([res.data], { type: "application/pdf" });
                FileSaver.saveAs(blob, filename);

                setEsperar2(false)
                setMsgStrong("Factura creada con éxito! ")
                setMsgGralAlert("")
                setSuccessAlert(true)
                setAlertar(!alertar)
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
                        <Row>
                            <Col>
                                <Card className="shadow">
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
                                                        <CardHeader className="border-0">
                                                            <h1 className="mb-0" style={{ textAlign: "center" }}>Nueva Factura</h1>
                                                        </CardHeader>
                                                        <CardBody>
                                                            <Form onSubmit={e => CrearFactura(e)}>
                                                                <Col style={{ border: "2px solid red", paddingTop: "20px", paddingBottom: "20px", marginBottom: "35px" }}>
                                                                    <h2>Cliente</h2>
                                                                    <Row>
                                                                        <Col md="4">
                                                                            <FormGroup>
                                                                                <Label for="exampleSelect">Tipo de Cliente</Label>
                                                                                <Input type="select" value={empresa} onChange={e => setEmpresa(e.target.value)}>
                                                                                    <option value={0}>Consumidor Final</option>
                                                                                    <option value={1}>Empresa</option>
                                                                                </Input>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        {
                                                                            parseInt(empresa) === 1 ?
                                                                                <>
                                                                                    <Col md="8">
                                                                                        <FormGroup>
                                                                                            <Label for="cuittxt">CUIT</Label>
                                                                                            <Row>
                                                                                                <Col md="6">
                                                                                                    {
                                                                                                        esperar3 ?
                                                                                                            <Input
                                                                                                                value={cuit}
                                                                                                                onChange={e => setCuit(e.target.value)}
                                                                                                                type="number"
                                                                                                                id="cuittxt"
                                                                                                                placeholder="Coloque el CUIT..."
                                                                                                                disabled={true}
                                                                                                                required
                                                                                                            /> :
                                                                                                            <Input
                                                                                                                value={cuit}
                                                                                                                onChange={e => setCuit(e.target.value)}
                                                                                                                type="number"
                                                                                                                id="cuittxt"
                                                                                                                placeholder="Coloque el CUIT..."
                                                                                                                disabled={verif}
                                                                                                                required
                                                                                                            />
                                                                                                    }

                                                                                                </Col>
                                                                                                <Col md="3">
                                                                                                    {
                                                                                                        verif ?
                                                                                                            <button onClick={e => CancelarCuit(e)} className="btn btn-danger">
                                                                                                                Volver
                                                                                                            </button> :
                                                                                                            esperar3 ?
                                                                                                                <div style={{ textAlign: "left" }}>
                                                                                                                    <Spinner type="grow" color="primary" style={{ width: "30px", height: "30px" }} /> </div> :
                                                                                                                <button onClick={e => DatosAfip(e)} className="btn btn-primary">
                                                                                                                    Verificar CUIT
                                                                                                                </button>
                                                                                                    }
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </FormGroup>
                                                                                    </Col>
                                                                                </> :
                                                                                null
                                                                        }
                                                                    </Row>
                                                                    {
                                                                        parseInt(empresa) === 1 ?
                                                                            !verif ?
                                                                                null :
                                                                                <Row>
                                                                                    <Col md="8">
                                                                                        <FormGroup>
                                                                                            <Label for="raztxt">Razón Social</Label>
                                                                                            <Input type="text" id="raztxt" placeholder="Razón Social..." value={razSoc} onChange={e => setRazSoc(e.target.value)} required />
                                                                                        </FormGroup>
                                                                                    </Col>
                                                                                    <Col md="4">
                                                                                        <FormGroup>
                                                                                            <Label for="exampleSelect">Condición de IVA</Label>
                                                                                            <Input type="select" value={condIva} onChange={e => setCondIva(e.target.value)}>
                                                                                                <option value={0}>Responsable Inscripto</option>
                                                                                                <option value={1}>Monotributista</option>
                                                                                                <option value={2}>Exento</option>
                                                                                            </Input>
                                                                                        </FormGroup>
                                                                                    </Col>
                                                                                </Row> :
                                                                            null
                                                                    }
                                                                </Col>
                                                                <Col style={{ border: "2px solid red", paddingTop: "20px", paddingBottom: "20px", marginBottom: 0 }}>
                                                                    <h2>Detalles</h2>
                                                                    <Row>
                                                                        <Col md="4">
                                                                            <FormGroup>
                                                                                <Label for="fechatxt">Fecha de Facturación</Label>
                                                                                <Input type="date" name="fechatxt" id="fechatxt" value={fechaFact} onChange={e => setFechaFact(e.target.value)} required />
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col md="8">
                                                                            <FormGroup>
                                                                                <Label for="descrTxt">Descripción</Label>
                                                                                <Input type="textarea" name="descrTxt" id="descrTxt" style={{ height: "150px" }} value={descr} onChange={e => setDescr(e.target.value)} required />
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md="4">
                                                                            <FormGroup>
                                                                                <Label for="totalImp">Total</Label>
                                                                                <Input type="number" name="totalImp" id="totalImp" placeholder="Total..." value={total} onChange={e => setTotal(e.target.value)} required />
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Row>
                                                                    <Col md="12" style={{ textAlign: "center", marginTop: "40px" }}>
                                                                        <button className="btn btn-danger" type="submit">
                                                                            Generar Factura
                                                                        </button>
                                                                    </Col>
                                                                </Row>
                                                            </Form>
                                                        </CardBody>

                                                        <CardFooter className="py-4">

                                                        </CardFooter>
                                                    </>
                                    }
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
