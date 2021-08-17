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


const Index = () => {
    const [url, setUrl] = useState("")
    const [call, setCall] = useState(false)
    const [cookie, setCookie] = useState("")
    const [esperar, setEsperar] = useState(false)

    const { dataT, loadingT, errorT } = useToken(
        url,
        call,
        cookie
    )

    useEffect(() => {
        setCookie(localStorage.getItem("loginInfo"))
        setUrl(UrlNodeServer.Veriflog)
        setCall(!call)
        setEsperar(false)
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
                                    <h2 className="mb-0">Panel de Control</h2>
                                </Col>
                            </Row>
                        </CardHeader>
                        {
                            esperar ?
                                <div style={{ textAlign: "center", marginTop: "100px" }}>
                                    <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                                <CardBody>

                                </CardBody>
                        }
                    </Card>
                </Container>
            </>
        )
    }
}

export default Index;
