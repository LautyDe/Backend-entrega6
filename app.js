/* Importacion de librerias internas y externas */
const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const bp = require("body-parser");
const routers = require("./routers");
const handlebars = require("express-handlebars");
const Contenedor = require("./controllers/productsController");
const productos = new Contenedor("./controllers/productos.json");

/* Inicializacion de la configuracion */
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;

/* middlewares incorporados */
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.engine(
    "hbs",
    handlebars.engine({
        extname: "hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views",
    })
);

app.set("views", "./views");
app.set("view engine", "hbs");

app.use("/", routers);
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("formulario", {
        style: "formulario.css",
        title: "Formulario Handlebars",
    });
});

app.post("/", async (req, res) => {
    console.log(`post req recibida con exito`);
    const data = req.body;
    console.log(data);
    const nuevoProducto = await productos.save(data);
    !data && res.status(204).json(notFound);
    res.status(201).render("formulario", {});
});

httpServer.listen(PORT, () => {
    console.log(
        `Servidor http escuchando en el puerto ${httpServer.address().port}`
    );
    console.log(`http://localhost:${httpServer.address().port}`);
});
httpServer.on("error", error => console.log(`Error en servidor: ${error}`));
