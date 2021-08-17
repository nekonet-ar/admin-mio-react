import React, { useEffect, useState } from "react";
import { useFetch } from '../../Hooks/UseFetchGet'
import axios from 'axios'
import { useActividad } from '../../Hooks/UseNvaActividad'
import { useToken } from '../../Hooks/UseFetchToken'
import { Redirect } from "react-router-dom"
// reactstrap components
import {
    Alert,
    Card,
    CardHeader,
    Container,
    Row,
    Spinner,
    Input,
    Col,
    FormGroup,
    CardBody,
    Form,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Badge
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import UrlNodeServer from '../../Globals/NodeServer'

const CountDown = () => {
    const [colorAlert, setColorAlert] = useState("danger")
    const [msgAlert, setMsgAlert] = useState("")
    const [msgAlertStrong, setMsgAlertStrong] = useState("")
    const [alertToggle, setAlertToggle] = useState("none")

    const [esperar, setEsperar] = useState(false)

    const [tituloMod, setTituloMod] = useState("")
    const [fechaLimite, setFechaLimite] = useState("")
    const [nvaImgMod, setNvaImgMod] = useState("")
    const [nvaImgModBool, setNvaImgModBool] = useState(false)
    const [enabled, setEnabled] = useState(0)

    const [url, setUrl] = useState("")
    const [call, setCall] = useState(false)
    const { data, loading, error } = useFetch(
        url,
        call
    )

    const [url2, setUrl2] = useState("")
    const [call2, setCall2] = useState(false)
    const [cookie, setCookie] = useState("")
    const { dataT, loadingT, errorT } = useToken(
        url2,
        call2,
        cookie
    )

    const [nvaActCall, setNvaActCall] = useState(false)
    const [actividadStr, setActividadStr] = useState("")
    const { data2, loading2, error2 } = useActividad(
        nvaActCall,
        actividadStr
    )

    useEffect(() => {
        setCookie(localStorage.getItem("loginInfo"))
        setUrl2(UrlNodeServer.Veriflog)
        setCall2(!call2)
        setUrl(UrlNodeServer.CountDownGet)
        setCall(!call)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!loading) {
            if (!error) {
                GetCountDown()
            }
        }
        // eslint-disable-next-line
    }, [loading])

    useEffect(() => {
        GetCountDown()
        // eslint-disable-next-line
    }, [call])

    useEffect(() => {
        if (!loading2) {
            if (!error2) {
                if (data2) {
                }
            }
        }
        // eslint-disable-next-line
    }, [loading2])

    useEffect(() => {
        if (!loadingT) {
            if (!errorT) {
                if (dataT) {

                }
            }
        }
        // eslint-disable-next-line
    }, [loadingT])

    const ChangeImgMod = (e) => {
        e.preventDefault()
        setNvaImgModBool(true)
    }

    const ChangeImgScrMod = (e) => {
        setNvaImgMod(URL.createObjectURL(e.target.files[0]))
        setNvaImgModBool(false)
    }

    const GetCountDown = () => {
        setEsperar(true)
        if (data[0]) {
            if (error) {
                setEsperar(false)
                setTituloMod("")
                setFechaLimite("")
                setNvaImgMod("")
            } else {
                setTituloMod(data[0].titleText)
                const fechaCompleta = new Date(data[0].dateTime)

                let dia = String(fechaCompleta.getDate())
                let mes = String(fechaCompleta.getMonth() + 1)

                if (dia.length === 1) {
                    dia = "0" + dia
                }

                if (mes.length === 1) {
                    mes = "0" + mes
                }

                const anio = fechaCompleta.getFullYear()

                setEsperar(false)
                setFechaLimite(anio + "-" + mes + "-" + dia)
                setNvaImgMod(data[0].image)
                setEnabled(data[0].enabled)
            }
        }
    }

    const CancelarMod = (e) => {
        e.preventDefault()
        setCall(!call)
        setNvaImgModBool(false)
    }

    const ActivarCountDown = async (e) => {
        e.preventDefault()

        let activar

        if (parseInt(enabled) === 0) {
            activar = 1
        } else {
            activar = 0
        }

        const datos = {
            activar: activar
        }

        await axios.post(UrlNodeServer.CountDownActivar, datos)
            .then(res => {
                if (activar === 1) {
                    setActividadStr("El usuario ha activado la cuenta regresiva'")
                    setMsgAlertStrong("Oferta activada con éxito!")
                } else {
                    setActividadStr("El usuario ha desactivado la cuenta regresiva'")
                    setMsgAlertStrong("Oferta desactivada con éxito!")
                }
                setNvaActCall(!nvaActCall)
                setColorAlert("success")
                setMsgAlert("")
                setAlertToggle("")
                setTimeout(() => {
                    setAlertToggle("none")
                }, 5000);
                setCall(!call)
            })
    }

    const ModificarCountDown = async () => {
        setEsperar(true)
        if (document.getElementById("imgNvaAltmod").files[0]) {
            fetch(nvaImgMod)
                .then(res => res.blob())
                .then(blob => {
                    const filemini = new File([blob], "1.png", {
                        type: 'image/png'
                    });
                    //  console.log('head', formData.getHeaders())
                    var formData = new FormData();
                    formData.append("file", filemini);
                    formData.append("otros", "oreos");
                    console.log('fd', formData)

                    // Example POST method implementation:
                    async function postData(url = '', data = {}) {
                        // Default options are marked with *
                        const response = await fetch(url, {
                            method: 'POST',
                            body: data
                        });
                        return response;
                    }
                    setEsperar(true)
                    postData(UrlNodeServer.CountDownUpl, formData)
                        .then(async data => {
                            let respuesta = await data.json()
                            const status = parseInt(respuesta.status)
                            if (status === 200) {
                                const datos = {
                                    date: fechaLimite,
                                    title: tituloMod
                                }

                                await axios.post(UrlNodeServer.CountDownMod, datos)
                                    .then(res => {
                                        const response = res.data
                                        const status = parseInt(response.status)

                                        if (status === 200) {
                                            setActividadStr("El usuario ha modificado la cuenta regresiva'")
                                            setNvaActCall(!nvaActCall)
                                            setEsperar(false)
                                            setColorAlert("success")
                                            setMsgAlertStrong("Oferta modificada con éxito!")
                                            setMsgAlert("")
                                            setAlertToggle("")
                                            setTimeout(() => {
                                                setAlertToggle("none")
                                            }, 5000);
                                            setCall(!call)
                                        } else {
                                            setEsperar(false)
                                            setColorAlert("danger")
                                            setMsgAlertStrong("Hubo un error inesperado!")
                                            setMsgAlert("No se pudieron guardar los cambios. Pero si se modificó la imagen.")
                                            setAlertToggle("")
                                            setTimeout(() => {
                                                setAlertToggle("none")
                                            }, 5000);
                                        }
                                    })
                            } else {
                                setEsperar(false)
                                setColorAlert("danger")
                                setMsgAlertStrong("Hubo un error inesperado!")
                                setMsgAlert("No se pudo subir la imagen. Revisela!")
                                setAlertToggle("")
                                setTimeout(() => {
                                    setAlertToggle("none")
                                }, 5000);
                            }
                        });
                });
        } else {
            const datos = {
                date: fechaLimite,
                title: tituloMod
            }

            await axios.post(UrlNodeServer.CountDownMod, datos)
                .then(res => {
                    const response = res.data
                    const status = parseInt(response.status)

                    if (status === 200) {
                        setEsperar(false)
                        setColorAlert("success")
                        setMsgAlertStrong("Oferta modificada con éxito!")
                        setMsgAlert("")
                        setAlertToggle("")
                        setTimeout(() => {
                            setAlertToggle("none")
                        }, 5000);
                        setCall(!call)
                    } else {
                        setEsperar(false)
                        setColorAlert("danger")
                        setMsgAlertStrong("Hubo un error inesperado!")
                        setMsgAlert("No se pudieron guardar los cambios.")
                        setAlertToggle("")
                        setTimeout(() => {
                            setAlertToggle("none")
                        }, 5000);
                    }
                })
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
                <Alert color={colorAlert} style={{ transition: "0.6s ease", position: "fixed", right: 0, left: 0, top: 0, margin: "auto", marginTop: "30px", zIndex: "99999", textAlign: "center", display: `${alertToggle}` }} >
                    <strong>{msgAlertStrong}</strong> {msgAlert}
                </Alert>
                <Header />
                <Container className="mt--7" fluid>
                    {
                        esperar ?
                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                            loading ?
                                <div style={{ textAlign: "center", marginTop: "100px" }}>
                                    <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                                <>
                                    <Row >
                                        <Col className="order-xl-1" md="12">
                                            <Card className="bg-secondary shadow">
                                                <CardHeader className="bg-white border-0">
                                                    <Row className="align-items-center">
                                                        <Col xs="9">
                                                            <h3 className="mb-0">Oferta en cuenta regresiva
                                                            <Badge color="" className="badge-dot mr-4" style={{ marginLeft: "10px" }}>
                                                                    {
                                                                        enabled ?
                                                                            <i style={{ width: "0.8rem", height: "0.8rem" }} className="bg-success" /> :
                                                                            <i style={{ width: "0.8rem", height: "0.8rem" }} className="bg-danger" />
                                                                    }

                                                                </Badge>
                                                            </h3>

                                                        </Col>
                                                        <Col xs="3" style={{ textAlign: "right" }}>
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
                                                                        onClick={e => ActivarCountDown(e)}
                                                                    >
                                                                        <Badge color="" className="badge-dot mr-4">
                                                                            {
                                                                                enabled ?
                                                                                    <>
                                                                                        <i className="bg-danger" />
                                                                                    Desactivar
                                                                                </> :
                                                                                    <>
                                                                                        <i className="bg-success" />
                                                                                    Activar
                                                                                </>
                                                                            }


                                                                        </Badge>
                                                                    </DropdownItem>
                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>
                                                        </Col>
                                                    </Row>
                                                </CardHeader>
                                                <CardBody>
                                                    <Form onSubmit={e => ModificarCountDown(e)}>
                                                        <h6 className="heading-small text-muted mb-4">
                                                            Información de la Oferta
                                                    </h6>
                                                        <div className="pl-lg-4">
                                                            <Row>
                                                                <Col lg="12">
                                                                    <FormGroup>
                                                                        <label
                                                                            className="form-control-label"
                                                                            htmlFor="input-username"
                                                                        >
                                                                            Título
                                                                    </label>
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            id="input-username"
                                                                            placeholder="Título..."
                                                                            type="text"
                                                                            value={tituloMod}
                                                                            onChange={e => setTituloMod(e.target.value)}
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col lg="12">
                                                                    <FormGroup>
                                                                        <label
                                                                            className="form-control-label"
                                                                            htmlFor="input-email"
                                                                        >
                                                                            Fecha Límite
                                                                    </label>
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            type="date"
                                                                            value={fechaLimite}
                                                                            onChange={e => setFechaLimite(e.target.value)}
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        <hr className="my-4" />
                                                        {/* Address */}
                                                        <h6 className="heading-small text-muted mb-4">
                                                            Imagen de Fondo
                                                    </h6>
                                                        <div className="pl-lg-4" style={nvaImgModBool ? { display: "none" } : { display: "block" }}>
                                                            <Row>
                                                                <Col md="12">
                                                                    <img
                                                                        src={nvaImgMod}
                                                                        style={{ width: "100%" }}
                                                                        alt="nvaImgMod"
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col lg="4">
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        onClick={e => ChangeImgMod(e)}
                                                                    >
                                                                        Cambiar Imagen
                                                                </button>
                                                                </Col>
                                                            </Row>
                                                        </div>

                                                        <Col lg="12" style={!nvaImgModBool ? { display: "none", textAlign: "center" } : { display: "block", textAlign: "center" }}>
                                                            <FormGroup>

                                                                <Input
                                                                    className="form-control-alternative"
                                                                    id="imgNvaAltmod"
                                                                    type="file"
                                                                    accept=".png"
                                                                    onChange={e => ChangeImgScrMod(e)}
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Row style={{ marginTop: "15px" }}>
                                                            <Col lg="12" style={{ textAlign: "center" }}>
                                                                <FormGroup>

                                                                    <button
                                                                        className="btn btn-warning"
                                                                        type="submit"
                                                                    >
                                                                        Guardar Cambios
                                                                </button>
                                                                    <button
                                                                        className="btn btn-danger"
                                                                        onClick={e => CancelarMod(e)}
                                                                    >
                                                                        Cancelar
                                                                </button>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                    </Form>
                                                </CardBody>
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

export default CountDown;
