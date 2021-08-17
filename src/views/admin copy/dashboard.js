import React, { useState, useEffect } from "react"
import { useToken } from '../../Hooks/UseFetchToken'
import UrlNodeServer from '../../Globals/NodeServer'
import Header from "components/Headers/Header.js"
import {
    Spinner,
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardHeader
} from "reactstrap";
import { Redirect } from "react-router-dom"
import VisitMap from './Componentes/Maps/VisitMAp'
import './styleMap.css'
import BarrasVert from './Componentes/Graficos/BarrasVertical'
import GrafCurva from './Componentes/Graficos/Curva'
import { Doughnut, Bar } from 'react-chartjs-2';
import axios from 'axios'

const Index = () => {
    const [url, setUrl] = useState("")
    const [call, setCall] = useState(false)
    const [cookie, setCookie] = useState("")
    const [esperar, setEsperar] = useState(false)
    const [data1, setData1] = useState([])
    const [data2, setData2] = useState([])
    const [data3, setData3] = useState([])
    const [data4, setData4] = useState([])
    const [data5, setData5] = useState([])
    const [data6, setData6] = useState([])
    const [data7, setData7] = useState([])
    const { dataT, loadingT, errorT } = useToken(
        url,
        call,
        cookie
    )

    useEffect(() => {
        setCookie(localStorage.getItem("loginInfo"))
        setUrl(UrlNodeServer.Veriflog)
        setCall(!call)
        GetData()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!loadingT) {
            if (!errorT) {
                if (dataT.nombre) {
                    localStorage.setItem("Nombre", dataT.nombre)
                    localStorage.setItem("Apellido", dataT.apellido)
                }
            }
        }
        // eslint-disable-next-line
    }, [loadingT])

    const GetData = async () => {
        setEsperar(true)
        await axios.get(UrlNodeServer.ResVisitas, {
            headers: {
                'x-access-token': localStorage.getItem("loginInfo")
            }
        })
            .then(res => {
                const resultado = res.data.result
                const status = parseInt(res.data.status)
                if (status === 200) {
                    setData1(resultado.arrayVisitasMeses)
                    setData2(resultado.arrayVisitasSemana)
                    setData3(resultado.accionUsuarios)
                    setData4(resultado.visitasProvincias)
                    setData5(resultado.visitNav)
                    setData6(resultado.visitDisp)
                    setData7(resultado.visitMarcas)
                }
                setEsperar(false)
            })
    }

    if (loadingT) {
        return (
            <div style={{ textAlign: "center" }}>
                <Spinner type="grow" color="light" /> </div>
        )
    } else if (errorT) {
        return (
            <Redirect
                className="text-light"
                to={process.env.PUBLIC_URL + "/"}
            />
        )
    } else {
        return (
            <>
                <Header />
                <Container className="mt--7" fluid>
                    <Card className="shadow">
                        <CardHeader className="bg-transparent">
                            <Row className="align-items-center">
                                <Col>
                                    <h2 className="mb-0">Últimas visitas</h2>
                                </Col>
                            </Row>
                        </CardHeader>
                        {
                            esperar ?
                                <div style={{ textAlign: "center", marginTop: "100px" }}>
                                    <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                                <CardBody>
                                    <Row>
                                        <Col md="8" style={{ marginTop: "20px" }}>
                                            {
                                                data1.arrayVisitas ?
                                                    <GrafCurva
                                                        labels1={data1.arrayPeriodos}
                                                        data1={data1.arrayVisitas}
                                                        longLabBool1={false}
                                                        longLabels1={[]}
                                                        labels2={data2.arrayPeriodos}
                                                        data2={data2.arrayVisitas}
                                                        longLabBool2={false}
                                                        longLabels2={[]}
                                                        titulo={"Últimas visitas"}
                                                        tipoRes1={["6 Meses", "6M"]}
                                                        tipoRes2={["Semana", "7D"]}
                                                    /> :
                                                    null
                                            }

                                            <br ></br>
                                            {
                                                data3.indexArray ?
                                                    <BarrasVert
                                                        labels={data3.indexArray}
                                                        data={data3.visitasArray}
                                                        longLabBool={true}
                                                        longLabels={data3.tiposArray}
                                                        titulo={"Acción de los usuarios (Últimos seis meses)"}
                                                    /> :
                                                    null
                                            }
                                        </Col>

                                        <Col md="4" style={{ marginTop: "20px" }}>
                                            <Card className="bg-gradient-default shadow mapa" >
                                                <CardHeader className="bg-transparent" style={{ paddingBottom: 0 }}>
                                                    <Row className="align-items-center">
                                                        <div className="col">
                                                            <h2 className="text-white mb-0">Visitas por Provincia</h2>
                                                        </div>
                                                    </Row>
                                                </CardHeader>
                                                <CardBody className="mapa">
                                                    {
                                                        parseInt(data4.length) > 0 ?
                                                            <VisitMap
                                                                visitArray={data4}
                                                                tipoRes={"Visitas"}
                                                            /> :
                                                            null
                                                    }
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col md="6" style={{ marginTop: "20px" }}>
                                            <Card className="bg-gradient-default shadow">
                                                <CardHeader className="bg-transparent">
                                                    <Row className="align-items-center">
                                                        <div className="col">
                                                            <div className="col">
                                                                <h2 className="text-white mb-0">Navegadores</h2>
                                                            </div>
                                                        </div>
                                                    </Row>
                                                    <Row style={{ color: "white", marginTop: "20px" }}>
                                                        {
                                                            data5.resultados ?
                                                                data5.lblDet.map((item, key) => {
                                                                    return (
                                                                        <Col md="3" key={key}>
                                                                            <i class="fa fa-circle" style={{ color: item.bg, border: `1px solid ${item.bord}` }}></i>{item.nav}
                                                                        </Col>
                                                                    )
                                                                }) : null
                                                        }
                                                    </Row>
                                                </CardHeader>
                                                <CardBody>
                                                    {/* Chart */}
                                                    <div className="chart">
                                                        {
                                                            data5.resultados ?
                                                                <Doughnut data={data5.resultados} /> :
                                                                null
                                                        }
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                        <Col md="6" style={{ marginTop: "20px" }}>
                                            <Card className="bg-gradient-default shadow">
                                                <CardHeader className="bg-transparent">
                                                    <Row className="align-items-center">
                                                        <div className="col">
                                                            <div className="col">
                                                                <h2 className="text-white mb-0">Celulares vs Escritorio</h2>
                                                            </div>
                                                        </div>
                                                    </Row>
                                                    <Row style={{ color: "white", marginTop: "20px" }}>
                                                        {
                                                            data6.resultados ?
                                                                data6.lblDet.map((item, key) => {
                                                                    return (
                                                                        <Col md="3" key={key}>
                                                                            <i class="fa fa-circle" style={{ color: item.bg, border: `1px solid ${item.bord}` }}></i>{item.nav}
                                                                        </Col>
                                                                    )
                                                                }) : null
                                                        }
                                                    </Row>
                                                </CardHeader>
                                                <CardBody>
                                                    {/* Chart */}
                                                    <div className="chart">
                                                        {
                                                            data6.resultados ?
                                                                <Doughnut data={data6.resultados} /> :
                                                                null
                                                        }
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: "20px" }}>
                                        <Col md="12">
                                            <Card className="bg-gradient-default shadow">
                                                <CardHeader className="bg-transparent">
                                                    <Row className="align-items-center">
                                                        <div className="col">
                                                            <div className="col">
                                                                <h2 className="text-white mb-0">Marcas de Celulares</h2>
                                                            </div>
                                                        </div>
                                                    </Row>
                                                    <Row>
                                                    </Row>
                                                </CardHeader>
                                                <CardBody>
                                                    {/* Chart */}
                                                    <div className="chart">
                                                        {
                                                            data7.resultados ?
                                                                <Bar options={data7.options} data={data7.resultados} /> :
                                                                null
                                                        }
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </CardBody>
                        }
                    </Card>
                </Container>
            </>
        )
    }
}

export default Index;
