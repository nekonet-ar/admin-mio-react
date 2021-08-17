import React, { useEffect, useState } from "react"
import { useActividad } from '../../Hooks/UseNvaActividad'
import axios from 'axios'
import { useToken } from '../../Hooks/UseFetchToken'
import { Redirect } from "react-router-dom"
// reactstrap components
import {
    Card,
    CardFooter,
    Container,
    Row,
    Col,
    FormGroup,
    Input,
    Spinner,
    Form
} from "reactstrap"
// core components
import Header from "components/Headers/Header.js";
import UrlNodeServer from '../../Globals/NodeServer'

import AlertaForm from './Componentes/Alertas/Alerta1'
import TextAreaMod from './Componentes/Productos/ExtraInfoForm3'

import Destinatarios from './Componentes/EnvioEmails/Destinatarios'
import Previsualizar from './Componentes/EnvioEmails/Previsualizar'

import './Componentes/custom.css'

const ProductsItems = () => {
    const [alertar, setAlertar] = useState(false)
    const [msgStrongAlert, setMsgStrong] = useState("")
    const [msgGralAlert, setMsgGralAlert] = useState("")
    const [successAlert, setSuccessAlert] = useState(false)
    const [esperar2, setEsperar2] = useState(false)

    const [textAreaComp, setTextAreaComp] = useState("")
    const [asunto, setAsunto] = useState("")
    const [listaEmails, setListaEmails] = useState([])
    const [prevModal, setPrevModal] = useState(false)
    const [htmlPrev, setHtmlPrev] = useState("")
    const [tituloEmail, setTituloEmail] = useState("")

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
        setCookie(localStorage.getItem("loginInfo"))
        setUrl2(UrlNodeServer.Veriflog)
        setCall2(!call2)
        // eslint-disable-next-line
    }, [])

    const Previzualizar = async (e) => {
        e.preventDefault()
        setEsperar2(true)
        const datos = {
            prevText: textAreaComp,
            titulo: tituloEmail
        }
        await axios.post(UrlNodeServer.PrevEmailLibre, datos, {
            headers: {
                'x-access-token': localStorage.getItem("loginInfo")
            }
        })
            .then(res => {
                setEsperar2(false)
                setHtmlPrev(res.data)
                setPrevModal(true)
            })
    }

    const EnviarEmails = async (e) => {
        e.preventDefault()
        setEsperar2(true)
        const datos = {
            titulo: tituloEmail,
            asunto: asunto,
            listaEmails: listaEmails,
            prevText: textAreaComp
        }
        await axios.post(UrlNodeServer.EnviarEmailLibre, datos, {
            headers: {
                'x-access-token': localStorage.getItem("loginInfo")
            }
        })
            .then(() => {
                setEsperar2(false)
                setActividadStr("El usuario envío un email a los clientes")
                setNvaActCall(!nvaActCall)
                setMsgStrong("Proceso de envio iniciado!")
                setMsgGralAlert(" Una vez que termine el proceso se le enviará un email a usted")
                setSuccessAlert(true)
                setAlertar(!alertar)
                ResetForm()
            })
    }

    const ResetForm = () => {
        setAsunto("")
        setTituloEmail("")
        setTextAreaComp("")
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
                    {
                        esperar2 ?
                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                            <>
                                <Previsualizar
                                    prevModal={prevModal}
                                    setPrevModal={setPrevModal}
                                    htmlPrev={htmlPrev}
                                />
                                <Row>
                                    <Col>
                                        <Card className="shadow">
                                            <Form >
                                                <Row style={{ padding: "15px" }}>

                                                    <Col lg="6">
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-email"
                                                        >
                                                            Asunto del email:
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-email"
                                                            type="text"
                                                            placeholder="Asunto..."
                                                            value={asunto}
                                                            onChange={e => setAsunto(e.target.value)}
                                                        />

                                                    </Col>
                                                    <Col lg="6">
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-email"
                                                        >
                                                            Título:
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-email"
                                                            type="text"
                                                            placeholder="Título..."
                                                            value={tituloEmail}
                                                            onChange={e => setTituloEmail(e.target.value)}
                                                        />

                                                    </Col>
                                                </Row>
                                                <Row style={{ padding: "15px", paddingBottom: 0 }}>
                                                    <Col lg="12">
                                                        <FormGroup>
                                                            <TextAreaMod
                                                                model={textAreaComp}
                                                                setModel={setTextAreaComp}
                                                                titulo="Cuerpo del email:"
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>

                                                <Destinatarios
                                                    listaEmails={listaEmails}
                                                    setListaEmails={setListaEmails}
                                                    setAlertar={setAlertar}
                                                    setMsgStrong={setMsgStrong}
                                                    setMsgGralAlert={setMsgGralAlert}
                                                    setSuccessAlert={setSuccessAlert}
                                                    alertar={alertar}
                                                />

                                                <CardFooter className="py-4" style={{ textAlign: "center" }}>
                                                    <Row>
                                                        <Col lg="6" style={{ textAlign: "center" }}>
                                                            <button
                                                                className="btn btn-danger"
                                                                style={{ width: "200px", margin: "20px" }}
                                                                onSubmit={e => EnviarEmails(e)}
                                                            >
                                                                Envíar emails
                                                        </button>
                                                        </Col>
                                                        <Col lg="6" style={{ textAlign: "center" }}>
                                                            <button
                                                                className="btn btn-info"
                                                                style={{ width: "200px", margin: "20px" }}
                                                                onClick={e => Previzualizar(e)}
                                                            >
                                                                Previsualizar
                                                        </button>
                                                        </Col>
                                                    </Row>
                                                </CardFooter>
                                            </Form>
                                        </Card>
                                    </Col>
                                </Row>
                            </>
                    }
                </Container>
            </>
        )
    }
}

export default ProductsItems;
