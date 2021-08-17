import React, { useEffect, useState } from "react"
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
    CardBody,
    Table,
    Form
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import UrlNodeServer from '../../Globals/NodeServer'

const CountDown = () => {
    const [colorAlert, setColorAlert] = useState("danger")
    const [msgAlert, setMsgAlert] = useState("")
    const [msgAlertStrong, setMsgAlertStrong] = useState("")
    const [alertToggle, setAlertToggle] = useState("none")

    const [preciosDom, setPreciosDom] = useState(
        [[15, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4]]
    )

    const [preciosRet, setPreciosRet] = useState(
        [[1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4]]
    )

    const [esperar, setEsperar] = useState(false)

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
        GetPrices()
        // eslint-disable-next-line
    }, [])

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

    const ModificarPreciosDom = (e, x, y) => {
        let arrayPreciosDom = [...preciosDom]
        let firstArray = arrayPreciosDom[x]
        firstArray.splice(y, 1, e)
        arrayPreciosDom.splice(x, 1, firstArray)
        setPreciosDom(arrayPreciosDom)
    }

    const ModificarPreciosLocal = (e, x, y) => {
        let arrayPreciosDom = [...preciosRet]
        let firstArray = arrayPreciosDom[x]
        firstArray.splice(y, 1, e)
        arrayPreciosDom.splice(x, 1, firstArray)
        setPreciosRet(arrayPreciosDom)
    }

    const GetPrices = async () => {
        setEsperar(true)
        await axios.get(UrlNodeServer.PreciosCorreo)
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const resultado = respuesta.result
                    const PreciosRetiros = resultado.Retiro
                    const PreciosDomicilio = resultado.Domicilio

                    let ArrayPreciosDom = []
                    let SubArrayPreciosDom = []
                    let ArrayPreciosRet = []
                    let SubArrayPreciosRet = []

                    let zonaAnt = 0
                    let zonaAnt2 = 0

                    // eslint-disable-next-line 
                    PreciosRetiros.map((item, key) => {
                        const precio = item.precio
                        const zona = parseFloat(item.peso)

                        if (zonaAnt === 0) {
                            zonaAnt = zona
                            SubArrayPreciosRet.push(precio)
                        } else {
                            if (zonaAnt !== zona) {
                                zonaAnt = zona
                                ArrayPreciosRet.push(SubArrayPreciosRet)
                                SubArrayPreciosRet = []
                                SubArrayPreciosRet.push(precio)
                            } else {
                                zonaAnt = zona
                                SubArrayPreciosRet.push(precio)
                            }
                        }

                        if (key === (parseInt(PreciosRetiros.length) - 1)) {
                            ArrayPreciosRet.push(SubArrayPreciosRet)
                            setPreciosRet(ArrayPreciosRet)
                        }
                    })

                    // eslint-disable-next-line 
                    PreciosDomicilio.map((item, key) => {
                        const precio = item.precio
                        const zona = parseFloat(item.peso)

                        if (zonaAnt2 === 0) {
                            zonaAnt2 = zona
                            SubArrayPreciosDom.push(precio)
                        } else {
                            if (zonaAnt2 !== zona) {
                                zonaAnt2 = zona
                                ArrayPreciosDom.push(SubArrayPreciosDom)
                                SubArrayPreciosDom = []
                                SubArrayPreciosDom.push(precio)
                            } else {
                                zonaAnt2 = zona
                                SubArrayPreciosDom.push(precio)
                            }
                        }

                        if (key === (parseInt(PreciosDomicilio.length) - 1)) {
                            ArrayPreciosDom.push(SubArrayPreciosDom)
                            setPreciosDom(ArrayPreciosDom)
                            console.log(`ArrayPreciosDom`, ArrayPreciosDom)
                            setEsperar(false)
                        }
                    })
                }
            })
    }

    const NewPrices = async (e) => {
        e.preventDefault()
        setEsperar(true)
        const datos = {
            preciosDom,
            preciosRet
        }

        await axios.post(UrlNodeServer.UpdatePricesCourier, datos, {
            headers: {
                'x-access-token': localStorage.getItem("loginInfo")
            }
        })
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                setEsperar(false)
                if (status === 200) {
                    setActividadStr("El usuario ha modificado los precios del correo")
                    setNvaActCall(!nvaActCall)
                    setColorAlert("success")
                    setMsgAlertStrong("Precios modificados con éxito!")
                    setMsgAlert("")
                    setAlertToggle("")
                    setTimeout(() => {
                        setAlertToggle("none")
                    }, 5000);
                    GetPrices()
                } else {
                    setColorAlert("danger")
                    setMsgAlertStrong("Hubo un error inesperado!")
                    setMsgAlert(" Vuelva a iniciar sesión")
                    setAlertToggle("")
                    setTimeout(() => {
                        setAlertToggle("none")
                    }, 5000);
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
                                <Form onSubmit={e => NewPrices(e)}>
                                    <Row >
                                        <Col className="order-xl-1" md="12">
                                            <Card className="bg-secondary shadow">
                                                <CardHeader className="bg-white border-0">
                                                    <Row className="align-items-center">
                                                        <Col lg="12">
                                                            <h3 className="mb-0">Precios de Correo Argentino</h3>
                                                        </Col>
                                                    </Row>
                                                </CardHeader>
                                                <CardBody>
                                                    <Row>
                                                        <Col md="3">
                                                            <h2 style={{ textAlign: "center" }}>Envios a Domicilio</h2>
                                                        </Col>
                                                        <Col md="9" >
                                                            <h3 style={{ textAlign: "center", fontWeight: "bold" }}>ZONAS</h3>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col style={{ paddingTop: "26%", with: "100%" }}>
                                                            <h3 style={{ textAlign: "right", fontSize: "1.0625rem", fontWeight: "bold" }}>PESOS</h3>
                                                        </Col>
                                                        <Col md="9  ">
                                                            <Table bordered>
                                                                <thead>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td></td>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>1</td>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>2</td>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>3</td>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>4</td>

                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>0,5</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[0][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 0, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[0][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 0, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[0][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 0, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[0][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 0, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>1</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[1][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 1, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[1][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 1, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[1][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 1, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[1][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 1, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>2</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[2][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 2, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[2][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 2, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[2][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 2, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[2][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 2, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>3</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[3][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 3, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[3][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 3, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[3][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 3, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[3][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 3, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>5</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[4][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 4, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[4][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 4, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[4][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 4, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[4][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 4, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>10</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[5][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 5, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[5][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 5, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[5][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 5, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[5][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 5, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>15</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[6][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 6, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[6][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 6, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[6][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 6, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[6][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 6, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>20</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[7][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 7, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[7][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 7, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[7][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 7, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[7][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 7, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>25</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[8][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 8, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[8][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 8, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[8][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 8, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosDom[8][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosDom(e.target.value, 8, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="12" style={{ marginTop: "50px", borderTop: "2px solid black", marginBottom: "50px" }}></Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="3">
                                                            <h2 style={{ textAlign: "center" }}>Retiros en Sucursal</h2>
                                                        </Col>
                                                        <Col md="9" >
                                                            <h3 style={{ textAlign: "center", fontWeight: "bold" }}>ZONAS</h3>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col style={{ paddingTop: "26%", with: "100%" }}>
                                                            <h3 style={{ textAlign: "right", fontSize: "1.0625rem", fontWeight: "bold" }}>PESOS</h3>
                                                        </Col>
                                                        <Col md="9  ">
                                                            <Table bordered>
                                                                <thead>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td></td>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>1</td>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>2</td>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>3</td>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>4</td>

                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>0,5</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[0][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 0, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[0][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 0, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[0][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 0, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[0][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 0, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>1</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[1][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 1, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[1][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 1, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[1][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 1, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[1][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 1, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>2</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[2][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 2, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[2][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 2, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[2][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 2, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[2][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 2, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>3</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[3][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 3, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[3][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 3, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[3][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 3, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[3][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 3, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>5</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[4][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 4, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[4][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 4, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[4][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 4, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[4][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 4, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>10</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[5][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 5, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[5][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 5, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[5][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 5, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[5][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 5, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>15</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[6][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 6, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[6][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 6, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[6][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 6, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[6][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 6, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>20</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[7][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 7, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[7][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 7, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[7][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 7, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[7][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 7, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ width: "100px", textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>25</td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[8][0]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 8, 0)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[8][1]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 8, 1)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[8][2]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 8, 2)}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "180px" }}>
                                                                            <Input
                                                                                required
                                                                                className="form-control-alternative"
                                                                                type="number"
                                                                                value={preciosRet[8][3]}
                                                                                step={0.01}
                                                                                min={0.00}
                                                                                onChange={e => ModificarPreciosLocal(e.target.value, 8, 3)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="12" style={{ marginTop: "50px", borderTop: "2px solid black", marginBottom: "50px" }}></Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="4">
                                                            <button
                                                                className="btn btn-primary"
                                                                type="submit"
                                                            >Actualizar Precios</button>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Form>
                            </>
                    }
                </Container>
            </>
        )
    }
}

export default CountDown;
