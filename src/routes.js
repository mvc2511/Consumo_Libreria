import Dashboard from "views/Dashboard.js";
//import Icons from "views/Icons.js";
import AddLibro from "views/AddLibro.js";
import ListaLibros from "views/ListaLibros";
import BuscarLibro from "views/BuscarLibro";
import AddAutor from "views/AddAutor.js";
import ListaAutores from "views/ListaAutores.js";
import BuscarAutor from "views/BuscarAutor.js";
import Cupones from "views/ListaCupones";
import AddCupon from "views/AddCupon"; 
import EditCupon from "views/EditCupon"; 

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "design_app",
    component: <Dashboard />,
    layout: "/admin",
    sidebar: true,
  },/*
  {
    path: "/icons",
    name: "Icons",
    icon: "design_image",
    component: <Icons />,
    layout: "/admin",
  },
  */
  {
    path: "/add-libro",
    name: "Agregar Libro",
    icon: "education_agenda-bookmark",
    component: <AddLibro />,
    layout: "/admin",
    sidebar: true,
  },
  {
    path: "/lista-libros",
    name: "Lista de Libros",
    icon: "files_paper",
    component: <ListaLibros />,
    layout: "/admin",
    sidebar: true,
  },
  {
    path: "/buscar-libro",
    name: "Buscar Libro",
    icon: "ui-1_zoom-bold",
    component: <BuscarLibro />,
    layout: "/admin",
    sidebar: true,
  },
  {
    path: "/add-autor",
    name: "Agregar Autor",
    icon: "users_single-02",
    component: <AddAutor />,
    layout: "/admin",
    sidebar: true,
  },
  {
    path: "/lista-autores",
    name: "Lista de Autores",
    icon: "files_paper",
    component: <ListaAutores />,
    layout: "/admin",
    sidebar: true,
  },
  {
    path: "/buscar-autor",
    name: "Buscar Autor",
    icon: "ui-1_zoom-bold",
    component: <BuscarAutor />,
    layout: "/admin",
    sidebar: true,
  },
  {
    path: "/lista-cupones",
    name: "Cupones",
    icon: "design_bullet-list-67",
    component: <Cupones />,
    layout: "/admin",
    sidebar: false,
  },
  {
    path: "/add-cupon",
    name: "Agregar Cupon",
    icon: "design_bullet-list-67",
    component: <AddCupon />,
    layout: "/admin",
    sidebar: false,
  },
  {
    path: "/edit-cupon/:id", // Cambia la ruta para incluir el parámetro dinámico :id
    name: "Editar Cupon",
    icon: "design_bullet-list-67",
    component: <EditCupon />,
    layout: "/admin",
    sidebar: false,
  },
];
export default dashRoutes;
