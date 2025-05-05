import express from "express";
import cors from "cors";

//importando a rota
import routerFilmes from "./hiago/rotas/rotafilmes.js";

const porta = 9000;
const app = express();
app.use(cors());

app.use(express.json());



app.use("/filmes", routerFilmes)

app.listen(porta, () => {
    const data = new Date();
    console.log(`Seridor iniciado na porta ${porta} ${data}`);
});