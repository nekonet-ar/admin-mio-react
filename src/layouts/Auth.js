import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { Container, Row, Col, Alert } from "reactstrap";

import AuthFooter from "components/Footers/AuthFooter.js";

import routes from "routes.js";

const Auth = () => {
  const [colorAlert, setColorAlert] = useState("danger")
  const [msgAlert, setMsgAlert] = useState("")
  const [msgAlertStrong, setMsgAlertStrong] = useState("")
  const [alertToggle, setAlertToggle] = useState("none")

  useEffect(() => {
    document.body.classList.add("bg-default")
    return () => {
      document.body.classList.remove("bg-default")
    }
  }, [])

  const getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === process.env.PUBLIC_URL + "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={() => <prop.component
              setColorAlert={(colorAlert) => setColorAlert(colorAlert)}
              setMsgAlert={(msgAlert) => setMsgAlert(msgAlert)}
              setMsgAlertStrong={(msgAlertStrong) => setMsgAlertStrong(msgAlertStrong)}
              setAlertToggle={(alertToggle) => setAlertToggle(alertToggle)}
            />}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <Alert color={colorAlert} style={{ transition: "0.6s ease", position: "fixed", right: 0, left: 0, top: 0, margin: "auto", marginTop: "30px", zIndex: "99999", textAlign: "center", display: `${alertToggle}` }} >
        <strong>{msgAlertStrong}</strong> {msgAlert}
      </Alert>
      <div className="main-content">
        <div className="header bg-gradient-default2" style={{ paddingTop: "60px", paddingBottom: "50px", background: "rgba(0, 0, 0, 0) linear-gradient(87deg, rgb(204, 192, 6) 0px, rgb(147, 147, 147) 100%) repeat scroll 0% 0%" }}>
          <Container>
            <div className="header-body text-center mb-7">
              <Row className="justify-content-center">
                <Col lg="5" md="6">
                  <img src="https://nekonet.com.ar/images/logo.png" alt="Osecac" style={{ width: "250px" }} />
                  <h1>Herramientas de Empresa</h1>
                  <h1>NEKONET</h1>
                </Col>
              </Row>
            </div>
          </Container>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="fill-default"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </div>
        {/* Page content */}
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Switch>
              {getRoutes(routes)}
              <Redirect from="*" to={process.env.PUBLIC_URL + "/auth/login"} />
            </Switch>
          </Row>
        </Container>
      </div>
      <AuthFooter />
    </>
  );
}

export default Auth;
