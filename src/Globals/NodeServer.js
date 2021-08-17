require('dotenv').config()

var host = ""
if (process.env.NODE_ENV === "development") {
    host = "http://192.168.0.11:3101"
} else {
    host = "https://admin.nekonet.com.ar:3100"
}

const Admin = host + "/Admin"
const Afip = host + "/Afip"
const Facturacion = host + "/Facturacion"

const Loguin = Admin + "/adminloguin"
const NvaPass = Admin + "/nvapass"
const RecPass = Admin + "/recpass"
const Veriflog = Admin + "/veriflog"

const DatosCuit = Afip + "/DatosCuit"

const CrearFactura = Facturacion + "/CrearFactura"

const UrlNodeServer = {
    Loguin,
    NvaPass,
    RecPass,
    Veriflog,
    DatosCuit,
    CrearFactura
}

export default UrlNodeServer