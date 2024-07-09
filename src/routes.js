import Dashboard from "views/Dashboard.js";
import BuscarLibro from "views/BuscarLibro";
import Icons from "views/Icons.js";
import BuscarAutor from "views/BuscarAutor.js";
import ListaAutores from "views/ListaAutores.js";
import ListaLibros from "views/ListaLibros";
import AddAutor from "views/AddAutor.js";
import AddLibro from "views/AddLibro.js";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "design_app",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "design_image",
    component: <Icons />,
    layout: "/admin",
  },
  {
    path: "/add-libro",
    name: "Agregar Libro",
    icon: "education_agenda-bookmark",
    component: <AddLibro />,
    layout: "/admin",
  },
  {
    path: "/lista-libros",
    name: "Lista de Libros",
    icon: "files_paper",
    component: <ListaLibros />,
    layout: "/admin",
  },
  {
    path: "/buscar-libro",
    name: "Buscar Libro",
    icon: "ui-1_zoom-bold",
    component: <BuscarLibro />,
    layout: "/admin",
  },
  {
    path: "/add-autor",
    name: "Agregar Autor",
    icon: "users_single-02",
    component: <AddAutor />,
    layout: "/admin",
  },
  {
    path: "/lista-autores",
    name: "Lista de Autores",
    icon: "files_paper",
    component: <ListaAutores />,
    layout: "/admin",
  },
  {
    path: "/buscar-autor",
    name: "Buscar Autor",
    icon: "ui-1_zoom-bold",
    component: <BuscarAutor />,
    layout: "/admin",
  },
];
export default dashRoutes;
