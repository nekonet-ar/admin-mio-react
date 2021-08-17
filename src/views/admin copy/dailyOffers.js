import React, { useEffect, useState } from "react";
import { useFetch } from '../../Hooks/UseFetchGet'
import { useToken } from '../../Hooks/UseFetchToken'
import { useActividad } from '../../Hooks/UseNvaActividad'
import { Redirect } from "react-router-dom"
import axios from 'axios'
// reactstrap components
import {
    Alert,
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Table,
    Container,
    Row,
    Badge,
    Spinner,
    Input,
    Col,
    FormGroup,
    CardBody,
    Form
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import UrlNodeServer from '../../Globals/NodeServer'
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

const Tables = () => {
    const [colorAlert, setColorAlert] = useState("danger")
    const [msgAlert, setMsgAlert] = useState("")
    const [msgAlertStrong, setMsgAlertStrong] = useState("")
    const [alertToggle, setAlertToggle] = useState("none")

    const [esperar, setEsperar] = useState(false)

    const [modOffer, setModOffer] = useState(false)
    const [nvaOffer, setNvaOffer] = useState(false)

    const [tipoLink, setTipoLink] = useState(0)

    const [idOfferMod, setIdOfferMod] = useState(0)
    const [tituloMod, setTituloMod] = useState("")
    const [descrMod, setDescrMod] = useState("")
    const [tagMod, setTagMod] = useState("")
    const [nvaImgMod, setNvaImgMod] = useState("")
    const [nvaImgModBool, setNvaImgModBool] = useState(false)

    const [tituloNvo, setTituloNvo] = useState("")
    const [descrNvo, setDescrNvo] = useState("")
    const [tagNvo, setTagNvo] = useState("")
    const [nvaImgNvo, setNvaImgNvo] = useState("")
    const [nvaImgNvoBool, setNvaImgNvoBool] = useState(true)

    const [listaTags, setListaTags] = useState(<></>)
    const [listaCat, setListaCat] = useState(<></>)
    const [color, setColor] = useColor("hex", "#121212")

    const [listado, setListado] = useState([])
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
        setUrl(UrlNodeServer.Herodata)
        setCall(!call)
        ListadoCategorias()
        ListadoEtiquetas()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!loading) {
            if (!error) {
                if (data.length > 0) {
                    ListarOfertas()
                }
            }
        }
        // eslint-disable-next-line
    }, [loading])

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

    useEffect(() => {
        ListarOfertas()
        // eslint-disable-next-line
    }, [data.length])

    useEffect(() => {
        if (parseInt(tipoLink) === 0) {
            ListadoEtiquetas2()
        } else if (parseInt(tipoLink) === 1) {
            ListadoCategorias2()
        }
    }, [tipoLink])

    const DesactivarOff = async (e, id, activo, title) => {
        e.preventDefault()
        let activar
        if (parseInt(activo) === 0) {
            activar = 1
        } else {
            activar = 0
        }

        const datos = {
            id: id,
            activar: activar
        }
        setEsperar(true)
        await axios.post(UrlNodeServer.HeroChangeState, datos)
            .then(res => {
                if (activar === 1) {
                    setActividadStr("El usuario ha activado la oferta '" + title + "'")
                    setMsgAlertStrong("Oferta activada con éxito!")
                } else {
                    setActividadStr("El usuario ha desactivado la oferta '" + title + "'")
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
                setEsperar(false)
            })
    }
    console.log(`colo`, color)
    const EliminarOff = async (e, id, title) => {
        e.preventDefault()
        const datos = {
            id: id
        }

        if (window.confirm("¿Está seguro de eliminar esta oferta? Esta desición es permanente.")) {
            setEsperar(true)
            await axios.post(UrlNodeServer.HeroDelete, datos)
                .then(res => {
                    const respuesta = res.data
                    const status = parseInt(respuesta.status)

                    if (status === 200) {
                        setActividadStr("El usuario ha eliminado la oferta '" + title + "'")
                        setColorAlert("success")
                        setMsgAlertStrong("Oferta eliminada con éxito!")
                        setMsgAlert("")
                        setAlertToggle("")
                        setTimeout(() => {
                            setAlertToggle("none")
                        }, 5000);
                        setNvaActCall(!nvaActCall)
                        setCall(!call)
                        setEsperar(false)
                    } else {
                        setColorAlert("danger")
                        setMsgAlertStrong("No se pudo eliminar la oferta!")
                        setMsgAlert("")
                        setAlertToggle("")
                        setTimeout(() => {
                            setAlertToggle("none")
                        }, 5000);
                    }
                })
        }
    }

    const ChangeImgMod = (e) => {
        e.preventDefault()
        setNvaImgModBool(true)
    }

    const ChangeImgScrMod = (e) => {
        setNvaImgMod(URL.createObjectURL(e.target.files[0]))
        setNvaImgModBool(false)
    }

    const CancelaModOff = (e) => {
        e.preventDefault()
        setModOffer(false)
        setNvaImgMod("")
    }

    const GuardarCambiosMod = async (e) => {
        e.preventDefault()
        if (document.getElementById("imgNvaAltmod").files[0]) {
            fetch(nvaImgMod)
                .then(res => res.blob())
                .then(blob => {
                    const filemini = new File([blob], idOfferMod + ".jpg", {
                        type: 'image/jpeg'
                    });
                    //  console.log('head', formData.getHeaders())
                    var formData = new FormData();
                    formData.append("file", filemini);
                    formData.append("otros", "oreos");

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
                    postData(UrlNodeServer.UploadImg, formData)
                        .then(async data => {
                            let respuesta = await data.json()
                            const status = parseInt(respuesta.status)
                            if (status === 200) {
                                const datos = {
                                    id: idOfferMod,
                                    title: tituloMod,
                                    subtitle: descrMod,
                                    tag: tagMod,
                                    color: color.hex
                                }

                                await axios.post(UrlNodeServer.ModHeroId, datos)
                                    .then(res => {
                                        const respuesta2 = res.data
                                        const status2 = parseInt(respuesta2.status)

                                        if (status2 === 200) {
                                            setActividadStr("El usuario ha modificado la oferta '" + tituloMod + "'")
                                            setNvaActCall(!nvaActCall)
                                            setEsperar(false)
                                            setColorAlert("success")
                                            setMsgAlertStrong("Oferta modificada con éxito!")
                                            setMsgAlert("")
                                            setAlertToggle("")
                                            setTimeout(() => {
                                                setAlertToggle("none")
                                            }, 5000);
                                            setModOffer(false)
                                            setCall(!call)
                                        } else {
                                            setEsperar(false)
                                            setColorAlert("danger")
                                            setMsgAlertStrong("Hubo un error inesperado!")
                                            setMsgAlert("No se pudieron guardar los cambios, pero la imagen si ha sido subida.")
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
                id: idOfferMod,
                title: tituloMod,
                subtitle: descrMod,
                tag: tagMod,
                tipo: tipoLink,
                color: color.hex
            }
            setEsperar(true)
            await axios.post(UrlNodeServer.ModHeroId, datos)
                .then(res => {
                    const respuesta2 = res.data
                    const status2 = parseInt(respuesta2.status)

                    if (status2 === 200) {
                        setActividadStr("El usuario ha modificado la oferta '" + tituloMod + "'")
                        setNvaActCall(!nvaActCall)
                        setEsperar(false)
                        setColorAlert("success")
                        setMsgAlertStrong("Oferta modificada con éxito!")
                        setMsgAlert("")
                        setAlertToggle("")
                        setTimeout(() => {
                            setAlertToggle("none")
                        }, 5000);
                        setModOffer(false)
                        setCall(!call)
                    } else {
                        setEsperar(false)
                        setColorAlert("danger")
                        setMsgAlertStrong("Hubo un error inesperado!")
                        setMsgAlert("No se pudieron guardar los cambios")
                        setAlertToggle("")
                        setTimeout(() => {
                            setAlertToggle("none")
                        }, 5000);
                    }
                })
        }
    }

    const DetalleOffer = async (e, id) => {
        e.preventDefault()
        setEsperar(true)
        await axios.get(UrlNodeServer.DetHero + id)
            .then(res => {
                const response = res.data
                const status = parseInt(response.status)
                if (status === 200) {
                    const detalles = response.result[0]
                    setTituloMod(detalles.title)
                    setDescrMod(detalles.subtitle)
                    setNvaImgMod(detalles.image)
                    setTagMod(detalles.tag)
                    setIdOfferMod(id)
                    setModOffer(true)
                    setEsperar(false)
                    setTipoLink(detalles.tipo)
                }
            })
    }

    const NvaOferta = (e) => {
        e.preventDefault()
        setNvaOffer(true)
    }

    const ChangeImgNvo = (e) => {
        e.preventDefault()
        setNvaImgNvoBool(true)
    }

    const ChangeImgScrNvo = (e) => {
        setNvaImgNvo(URL.createObjectURL(e.target.files[0]))
        setNvaImgNvoBool(false)
    }

    const CancelaNvoOff = (e) => {
        e.preventDefault()
        setNvaOffer(false)
        setNvaImgNvo("")
        setTituloNvo("")
        setDescrNvo("")
        setTagNvo("")
        setNvaImgNvoBool(true)
        document.getElementById("imgNvaAltNva").value = ""
    }

    const NvoRegistro = async (e) => {
        e.preventDefault()
        const datos = {
            title: tituloNvo,
            subtitle: descrNvo,
            tag: tagNvo,
            tipo: tipoLink,
            color: color.hex
        }

        await axios.post(UrlNodeServer.NvoHero, datos)
            .then(res => {
                const response = res.data
                const status = parseInt(response.status)

                if (status === 200) {
                    const idNvoInsert = response.result.insertId

                    fetch(nvaImgNvo)
                        .then(res => res.blob())
                        .then(blob => {
                            const filemini = new File([blob], idNvoInsert + ".jpg", {
                                type: 'image/jpeg'
                            });
                            //  console.log('head', formData.getHeaders())
                            var formData = new FormData();
                            formData.append("file", filemini);
                            formData.append("otros", "oreos");

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
                            postData(UrlNodeServer.UploadImg, formData)
                                .then(async data => {
                                    let respuesta = await data.json()
                                    const status = parseInt(respuesta.status)
                                    if (status === 200) {
                                        const respuesta2 = res.data
                                        const status2 = parseInt(respuesta2.status)

                                        if (status2 === 200) {

                                            await axios.post(UrlNodeServer.OpimizedImgHero, { idImg: idNvoInsert })
                                                .then(res => {

                                                })

                                            setActividadStr("El usuario ha agregado la oferta '" + tituloNvo + "'")
                                            setNvaActCall(!nvaActCall)
                                            setEsperar(false)
                                            setColorAlert("success")
                                            setMsgAlertStrong("Oferta agregada con éxito!")
                                            setMsgAlert("")
                                            setAlertToggle("")
                                            setTimeout(() => {
                                                setAlertToggle("none")
                                            }, 5000);
                                            setNvaOffer(false)
                                            setCall(!call)
                                            setNvaImgNvo("")
                                            setTituloNvo("")
                                            setDescrNvo("")
                                            setTagNvo("")
                                            setNvaImgNvoBool(true)
                                            document.getElementById("imgNvaAltNva").value = ""
                                        } else {
                                            setEsperar(false)
                                            setColorAlert("danger")
                                            setMsgAlertStrong("Hubo un error inesperado!")
                                            setMsgAlert("No se pudo subir la imagen.")
                                            setAlertToggle("")
                                            setTimeout(() => {
                                                setAlertToggle("none")
                                            }, 5000);
                                            setNvaOffer(false)
                                            setCall(!call)
                                            setNvaImgNvo("")
                                            setTituloNvo("")
                                            setDescrNvo("")
                                            setTagNvo("")
                                            setNvaImgNvoBool(true)
                                            document.getElementById("imgNvaAltNva").value = ""
                                        }


                                    } else {
                                        setEsperar(false)
                                        setColorAlert("danger")
                                        setMsgAlertStrong("Hubo un error inesperado!")
                                        setMsgAlert("No se pudo subir la imagen.")
                                        setAlertToggle("")
                                        setTimeout(() => {
                                            setAlertToggle("none")
                                        }, 5000);
                                    }
                                });

                        });

                } else {
                    setEsperar(false)
                    setColorAlert("danger")
                    setMsgAlertStrong("Hubo un error inesperado!")
                    setMsgAlert("No se pudo guardar la información")
                    setAlertToggle("")
                    setTimeout(() => {
                        setAlertToggle("none")
                    }, 5000);
                }
            })
    }

    const ListarOfertas = () => {
        const cantLista = parseInt(data.length)
        if (cantLista > 0) {
            setListado(
                data.map((item, key) => {
                    return (
                        <tr key={key}>
                            <th scope="row">
                                <Media className="align-items-center">
                                    <Media>
                                        <span className="mb-0 text-sm">
                                            {item.title}
                                        </span>
                                    </Media>
                                </Media>
                            </th>
                            <td>
                                {item.subtitle}
                            </td>
                            <td>
                                {item.url}
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <Badge color="" className="badge-dot">
                                    {
                                        item.enabled === 1 ?
                                            <>
                                                <i className="bg-success" style={{ width: "15px", height: "15px" }} />
                                            </> :
                                            <>
                                                <i className="bg-danger" style={{ width: "15px", height: "15px" }} />
                                            </>
                                    }
                                </Badge>
                            </td>
                            <td className="text-right">
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
                                            onClick={e => DesactivarOff(e, item.id, item.enabled, item.title)}
                                        >
                                            <Badge color="" className="badge-dot mr-4">
                                                {
                                                    item.enabled === 1 ?
                                                        <>
                                                            <i className="bg-danger" style={{ width: "10px", height: "10px" }} />
                                                            Desactivar
                                                        </> :
                                                        <>
                                                            <i className="bg-success" style={{ width: "10px", height: "10px" }} />
                                                            Activar
                                                        </>
                                                }

                                            </Badge>
                                        </DropdownItem>
                                        <DropdownItem
                                            href="#pablo"
                                            onClick={e => DetalleOffer(e, item.id)}
                                        >
                                            <i className="fas fa-search"></i>
                                            Ver detalles
                                        </DropdownItem>
                                        <DropdownItem
                                            href="#pablo"
                                            onClick={e => EliminarOff(e, item.id, item.title)}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                            Eliminar
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </td>
                        </tr>
                    )
                })
            )
        } else {
            setListado(
                <tr style={{ textAlign: "center", width: "100%" }}>
                    <td>
                        <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}>No hay productos cargados</span>
                    </td>
                </tr>
            )
        }
    }

    const ListadoCategorias = async () => {
        await axios.get(UrlNodeServer.GetCategories)
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const resultado = respuesta.result
                    setListaCat(
                        resultado.map((item, key) => {
                            return (
                                <option key={key} value={item.category}>{item.category}</option>
                            )
                        })
                    )
                }
            })
    }

    const ListadoEtiquetas = async () => {
        await axios.get(UrlNodeServer.GetTagList)
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const resultado = respuesta.result
                    setListaTags(
                        resultado.map((item, key) => {
                            return (
                                <option key={key} value={item.tag}>{item.tag}</option>
                            )
                        })
                    )
                }
            })
    }

    const ListadoCategorias2 = async () => {
        await axios.get(UrlNodeServer.GetCategories)
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const resultado = respuesta.result
                    setListaCat(
                        resultado.map((item, key) => {
                            if (key === 0) {
                                setTagMod(item.category)
                                setTagNvo(item.category)
                            }
                            return (
                                <option key={key} value={item.category}>{item.category}</option>
                            )
                        })
                    )
                }
            })
    }

    const ListadoEtiquetas2 = async () => {
        await axios.get(UrlNodeServer.GetTagList)
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const resultado = respuesta.result
                    setListaTags(
                        resultado.map((item, key) => {
                            if (key === 0) {
                                setTagMod(item.tag)
                                setTagNvo(item.tag)
                            }
                            return (
                                <option key={key} value={item.tag}>{item.tag}</option>
                            )
                        })
                    )
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
                <Alert color={colorAlert} style={{ transition: "0.6s ease", position: "fixed", right: 0, left: 0, top: 0, margin: "auto", marginTop: "30px", zIndex: "99999", textAlign: "center", display: `${alertToggle}` }} >
                    <strong>{msgAlertStrong}</strong> {msgAlert}
                </Alert>
                <Header />
                <Container className="mt--7" fluid>
                    {
                        esperar ?
                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                            <>
                                <Row style={modOffer ?
                                    { display: "none" } :
                                    nvaOffer ?
                                        { display: "none" } :
                                        { display: "block" }}>
                                    <Col>
                                        <Card className="shadow">
                                            <CardHeader className="border-0">
                                                <h3 className="mb-0">Lista de Ofertas</h3>
                                            </CardHeader>
                                            {
                                                loading ?
                                                    <div style={{ textAlign: "center", marginTop: "100px" }}>
                                                        <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                                                    error ?
                                                        null :
                                                        <>
                                                            <Table className="align-items-center table-flush" responsive>
                                                                <thead className="thead-light">
                                                                    <tr>
                                                                        <th scope="col">Título</th>
                                                                        <th scope="col">Descripción</th>
                                                                        <th scope="col">Link</th>
                                                                        <th scope="col" style={{ textAlign: "center" }}>Habilitado</th>
                                                                        <th scope="col" />
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {listado}
                                                                </tbody>
                                                            </Table>
                                                            <CardFooter className="py-4">
                                                                <nav aria-label="...">
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        style={nvaOffer ? { display: "none" } : { display: "block" }}
                                                                        onClick={e => NvaOferta(e)}
                                                                    >
                                                                        Nueva Oferta
                                                                    </button>
                                                                </nav>
                                                            </CardFooter>
                                                        </>
                                            }

                                        </Card>
                                    </Col>
                                </Row>

                                <Row style={!modOffer ? { display: "none", marginTop: "25px" } : { display: "block", marginTop: "25px" }} >
                                    <Col className="order-xl-1" md="12">
                                        <Card className="bg-secondary shadow">
                                            <CardHeader className="bg-white border-0">
                                                <Row className="align-items-center">
                                                    <Col xs="9">
                                                        <h3 className="mb-0">{tituloMod}</h3>
                                                    </Col>
                                                    <Col xs="3" style={{ textAlign: "right" }}>
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={e => CancelaModOff(e)}
                                                        >
                                                            x
                                                        </button>
                                                    </Col>
                                                </Row>
                                            </CardHeader>
                                            <CardBody>
                                                <Form onSubmit={e => GuardarCambiosMod(e)}>
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
                                                                        Descripción de la Oferta
                                                                    </label>
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        id="input-email"
                                                                        placeholder="Descripción..."
                                                                        type="text"
                                                                        value={descrMod}
                                                                        onChange={e => setDescrMod(e.target.value)}
                                                                        required
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg="12">
                                                                <FormGroup>
                                                                    <label
                                                                        className="form-control-label"
                                                                        htmlFor="input-first-name"
                                                                    >
                                                                        Tipo de oferta
                                                                    </label>
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        id="input-first-name"
                                                                        placeholder="Tag..."
                                                                        value={tipoLink}
                                                                        onChange={e => setTipoLink(e.target.value)}
                                                                        type="select"
                                                                    >
                                                                        <option value={0}>Etiqueta</option>
                                                                        <option value={1}>Categoria</option>
                                                                        <option value={2}>Todos los Productos</option>
                                                                    </Input>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        {
                                                            parseInt(tipoLink) === 2 ?
                                                                null :
                                                                <Row>
                                                                    <Col lg="12">
                                                                        <FormGroup>
                                                                            <label
                                                                                className="form-control-label"
                                                                                htmlFor="input-first-name"
                                                                            >
                                                                                {parseInt(tipoLink) === 0 ? "Etiqueta" : "Categoria"}
                                                                            </label>
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                id="input-first-name"
                                                                                value={tagMod}
                                                                                onChange={e => setTagMod(e.target.value)}
                                                                                type="select"
                                                                            >
                                                                                {parseInt(tipoLink) === 0 ? listaTags : listaCat}
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                        }

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
                                                    <hr />
                                                    <Col lg="12" style={!nvaImgModBool ? { display: "none", textAlign: "center" } : { display: "block", textAlign: "center" }}>
                                                        <FormGroup>

                                                            <Input
                                                                className="form-control-alternative"
                                                                id="imgNvaAltmod"
                                                                type="file"
                                                                accept=".jpg"
                                                                onChange={e => ChangeImgScrMod(e)}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Row>
                                                        <Col lg="12">
                                                            <FormGroup>
                                                                <label
                                                                    className="form-control-label"
                                                                    htmlFor="input-email"
                                                                    style={{ fontSize: "18px" }}
                                                                >
                                                                    Color del texto
                                                                </label>
                                                                <ColorPicker width={456} height={228} color={color} onChange={setColor} hideRGB hideHEX hideHSV dark />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row >
                                                        <Col >
                                                            <FormGroup>
                                                                <label
                                                                    className="form-control-label"
                                                                    htmlFor="input-email"
                                                                    style={{ fontSize: "20px" }}
                                                                >
                                                                    Vista previa
                                                                </label>
                                                                <Col lg="12" style={{
                                                                    backgroundImage: `url(${nvaImgMod})`, height: "300px", backgroundSize: 'cover', overflow: 'hidden', backgroundRepeat: 'no-repeat'
                                                                }}>
                                                                    <Col lg="12" style={{ paddingTop: "70px" }}>
                                                                        <h3 style={{ textAlign: "center", color: `${color.hex}` }}>{tituloMod}</h3>
                                                                        <h1 style={{ textAlign: "center", color: `${color.hex}` }}>{descrMod}</h1>
                                                                    </Col>
                                                                </Col>

                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: "15px" }}>
                                                        <Col lg="12" style={{ textAlign: "center" }}>
                                                            <FormGroup>

                                                                <button
                                                                    className="btn btn-warning"
                                                                    type="submit"
                                                                >
                                                                    Guardar Cambios
                                                                </button>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row style={!nvaOffer ? { display: "none", marginTop: "25px" } : { display: "block", marginTop: "25px" }} >
                                    <Col className="order-xl-1" md="12">
                                        <Card className="bg-secondary shadow">
                                            <CardHeader className="bg-white border-0">
                                                <Row className="align-items-center">
                                                    <Col xs="9">
                                                        <h3 className="mb-0">Nueva Oferta Diaria</h3>
                                                    </Col>
                                                    <Col xs="3" style={{ textAlign: "right" }}>
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={e => CancelaNvoOff(e)}
                                                        >
                                                            x
                                                        </button>
                                                    </Col>
                                                </Row>
                                            </CardHeader>
                                            <CardBody>
                                                <Form onSubmit={e => NvoRegistro(e)}>
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
                                                                        value={tituloNvo}
                                                                        onChange={e => setTituloNvo(e.target.value)}
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
                                                                        Descripción de la Oferta
                                                                    </label>
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        id="input-email"
                                                                        placeholder="Descripción..."
                                                                        type="text"
                                                                        value={descrNvo}
                                                                        onChange={e => setDescrNvo(e.target.value)}
                                                                        required
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg="12">
                                                                <FormGroup>
                                                                    <label
                                                                        className="form-control-label"
                                                                        htmlFor="input-first-name"
                                                                    >
                                                                        Tipo de oferta
                                                                    </label>
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        id="input-first-name"
                                                                        placeholder="Tag..."
                                                                        value={tipoLink}
                                                                        onChange={e => setTipoLink(e.target.value)}
                                                                        type="select"
                                                                    >
                                                                        <option value={0}>Etiqueta</option>
                                                                        <option value={1}>Categoria</option>
                                                                        <option value={2}>Todos los Productos</option>
                                                                    </Input>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        {
                                                            parseInt(tipoLink) === 2 ?
                                                                null :
                                                                <Row>
                                                                    <Col lg="12">
                                                                        <FormGroup>
                                                                            <label
                                                                                className="form-control-label"
                                                                                htmlFor="input-first-name"
                                                                            >
                                                                                {parseInt(tipoLink) === 0 ? "Etiqueta" : "Categoria"}
                                                                            </label>
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                id="input-first-name"
                                                                                value={tagNvo}
                                                                                onChange={e => setTagNvo(e.target.value)}
                                                                                type="select"
                                                                            >
                                                                                {parseInt(tipoLink) === 0 ? listaTags : listaCat}
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                        }
                                                    </div>
                                                    <hr className="my-4" />
                                                    {/* Address */}
                                                    <h6 className="heading-small text-muted mb-4">
                                                        Imagen de Fondo
                                                    </h6>
                                                    <div className="pl-lg-4" style={nvaImgNvoBool ? { display: "none" } : { display: "block" }}>
                                                        <Row>
                                                            <Col md="12">
                                                                <img
                                                                    src={nvaImgNvo}
                                                                    style={{ width: "100%" }}
                                                                    alt="nvaImgMod"
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg="4">
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={e => ChangeImgNvo(e)}
                                                                >
                                                                    Cambiar Imagen
                                                                </button>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <hr />
                                                    <Col lg="12" style={!nvaImgNvoBool ? { display: "none", textAlign: "center" } : { display: "block", textAlign: "center" }}>
                                                        <FormGroup>

                                                            <Input
                                                                className="form-control-alternative"
                                                                id="imgNvaAltNva"
                                                                type="file"
                                                                accept=".jpg"
                                                                onChange={e => ChangeImgScrNvo(e)}
                                                                required
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Row>
                                                        <Col lg="12">
                                                            <FormGroup>
                                                                <label
                                                                    className="form-control-label"
                                                                    htmlFor="input-email"
                                                                    style={{ fontSize: "18px" }}
                                                                >
                                                                    Color del texto
                                                                </label>
                                                                <ColorPicker width={456} height={228} color={color} onChange={setColor} hideRGB hideHEX hideHSV dark />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row >
                                                        <Col >
                                                            <FormGroup>
                                                                <label
                                                                    className="form-control-label"
                                                                    htmlFor="input-email"
                                                                    style={{ fontSize: "20px" }}
                                                                >
                                                                    Vista previa
                                                                </label>
                                                                <Col lg="12" style={{
                                                                    backgroundImage: `url(${nvaImgNvo})`, height: "300px", backgroundSize: 'cover', overflow: 'hidden', backgroundRepeat: 'no-repeat'
                                                                }}>
                                                                    <Col lg="12" style={{ paddingTop: "70px" }}>
                                                                        <h3 style={{ textAlign: "center", color: `${color.hex}` }}>{tituloNvo}</h3>
                                                                        <h1 style={{ textAlign: "center", color: `${color.hex}` }}>{descrNvo}</h1>
                                                                    </Col>
                                                                </Col>

                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row style={{ marginTop: "15px" }}>
                                                        <Col lg="12" style={{ textAlign: "center" }}>
                                                            <FormGroup>

                                                                <button
                                                                    className="btn btn-warning"
                                                                    type="submit"
                                                                >
                                                                    Agregar Nueva Oferta
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

export default Tables;
