import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  UncontrolledTooltip,
  NavLink,
  Spinner
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import { useFetch } from '../../Hooks/UseFetchPost'
import UrlNodeServer from '../../Globals/NodeServer'

const Login = ({ setColorAlert, setMsgAlert, setMsgAlertStrong, setAlertToggle }) => {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [verPassToggle, setVerPassToggle] = useState(false)
  const [typeInpPass, setTypeInpPass] = useState("password")
  const [rememberCred, setRememberCred] = useState(false)
  const [savedEmail, setSavedEmail] = useState(false)
  const [isLog, setIsLog] = useState(false)
  const [url, setUrl] = useState("")
  const [call, setCall] = useState(false)
  const [nvaPass, setNvaPass] = useState(false)
  const { data, loading, error } = useFetch(
    url,
    {
      user: user,
      pass: pass
    },
    call
  )
  useEffect(() => {
    localStorage.removeItem("loginInfo")
    localStorage.removeItem("Nombre")
    localStorage.removeItem("Apellido")
    if (!isLog) {
      const emailGuardado = localStorage.getItem("savedEmail")
      if (emailGuardado) {
        setUser(emailGuardado)
        setRememberCred(true)
        setSavedEmail(true)
        try {
          document.getElementById("passInp").select()
          document.getElementById("passInp").focus()
        } catch (error) {
        }

      } else {
        setSavedEmail(false)
        try {
          document.getElementById("userInp").select()
          document.getElementById("userInp").focus()
        } catch (error) {
        }
      }
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!loading) {
      if (!error) {
        if (data.cookie) {
          const provisoria = parseInt(data.provisoria)
          const cookie = data.cookie
          if (provisoria === 1) {
            if (rememberCred) {
              localStorage.setItem("savedEmail", user)
            } else {
              localStorage.removeItem("savedEmail")
            }
            localStorage.setItem("loginInfo", cookie)
            setNvaPass(true)
          } else {
            localStorage.setItem("loginInfo", cookie)
            if (rememberCred) {
              localStorage.setItem("savedEmail", user)
            } else {
              localStorage.removeItem("savedEmail")
            }
            setIsLog(true)
          }
        }
      } else {
        setColorAlert("danger")
        setMsgAlertStrong("Error de ingreso!")
        setMsgAlert(error)
        setAlertToggle("")
        setTimeout(() => {
          setAlertToggle("none")
        }, 5000);
      }
    }
    // eslint-disable-next-line
  }, [loading])

  const ingresar = (e) => {
    e.preventDefault()
    setUrl(UrlNodeServer.Loguin)
    setCall(!call)
  }

  const togglePass = (e) => {
    e.preventDefault()
    if (verPassToggle) {
      setTypeInpPass("password")
    } else {
      setTypeInpPass("text")
    }
    setVerPassToggle(!verPassToggle)
  }

  const changeUser = (e) => {
    e.preventDefault()
    localStorage.removeItem("savedEmail")
    setSavedEmail(false)
    document.getElementById("userInp").select()
    document.getElementById("userInp").focus()
  }

  if (isLog) {
    return (
      <Redirect
        className="text-light"
        to={process.env.PUBLIC_URL + "/admin/index"}
      />
    )
  } else if (nvaPass) {
    return (
      <Redirect
        className="text-light"
        to={process.env.PUBLIC_URL + "/auth/nvapass"}
      />
    )
  } else {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5">
              <div className="text-center text-muted mb-4">
                <span style={{ fontWeight: "bold" }}>Ingrese con su credenciales:</span>
              </div>
              <Form role="form" onSubmit={e => ingresar(e)}>
                {
                  loading ?
                    <div style={{ textAlign: "center" }}>
                      <Spinner type="grow" color="light" /> </div> :
                    <>
                      {
                        savedEmail ?
                          <>
                            <FormGroup className="mb-3">
                              <InputGroup className="input-group-alternative">
                                <Input placeholder="Usuario" type="email" value={user} onChange={e => setUser(e.target.value)} autoComplete="new-user" id="userInp" required disabled />
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText style={{ padding: 0, }}>
                                    <Button id="btn_change_user" onClick={e => changeUser(e)}>
                                      <i className="fas fa-exchange-alt"></i>
                                    </Button>
                                  </InputGroupText>
                                </InputGroupAddon>
                              </InputGroup>
                            </FormGroup>
                            <UncontrolledTooltip
                              delay={0}
                              placement="top"
                              target="btn_change_user"
                            >Cambiar de usuario
                            </UncontrolledTooltip>
                          </>
                          :
                          <FormGroup className="mb-3">
                            <InputGroup className="input-group-alternative">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="ni ni-circle-08" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input placeholder="Usuario" type="text" value={user} onChange={e => setUser(e.target.value)} autoComplete="new-user" id="userInp" required />
                            </InputGroup>
                          </FormGroup>
                      }
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input placeholder="Contraseña" type={typeInpPass} autoComplete="new-password" value={pass} onChange={e => setPass(e.target.value)} id="passInp" required />
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <a href="/xa" id="verPass" onClick={e => togglePass(e)}> <i className="fas fa-eye" style={verPassToggle ? { color: "red" } : { color: "gray" }}></i></a>
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormGroup>
                      <div className="custom-control custom-control-alternative custom-checkbox">
                        <input
                          className="custom-control-input"
                          id=" customCheckLogin"
                          type="checkbox"
                          checked={rememberCred}
                          onChange={e => setRememberCred(e.target.checked)}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor=" customCheckLogin"
                        >
                          <span className="text-muted">Recordar mis credenciales</span>
                        </label>
                      </div>
                      <div className="text-center">
                        <Button style={{ marginTop: "3em" }} color="primary" type="submit">
                          Ingresar
                        </Button>
                      </div>
                    </>
                }
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
              <NavLink
                className="text-light"
                to={process.env.PUBLIC_URL + "/auth/forgotpass"}
                tag={Link}
              >
                <small>Olvidé mi contraseña</small>
              </NavLink>
            </Col>
            <Col className="text-right" xs="6">

            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

export default Login;
