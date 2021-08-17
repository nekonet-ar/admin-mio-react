import Index from "views/admin/dashboard"
import UltimasVisit from 'views/admin/ultVisitas'

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-blue",
    component: Index,
    layout: process.env.PUBLIC_URL + "/admin"
  }, {
    path: "/facturar",
    name: "Facturar a Clientes",
    icon: "ni ni-single-copy-04 text-red",
    component: UltimasVisit,
    layout: process.env.PUBLIC_URL + "/admin"
  }
];
export default routes;
