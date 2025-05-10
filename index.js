import express from "express";
import cors from "cors";

//importando a rota
import routerFilmes from "./hiago/rotas/rotafilmes.js";
import routerAvaliacaoFilmes from "./mariana/rotas/rotaAvaliaFilmes.js"
import routerProdutor from "./isa/rotas/rotaProdutor.js";
import routerAtores from "./corso/rotas/rotaAtores.js";
import routerAtoresFilmes from "./corso/rotas/rotaAtoresFilmes.js";

const porta = 9000;
const app = express();
app.use(cors());

app.use(express.json());



app.use("/filmes", routerFilmes)
app.use("/avaliacaoFilmes", routerAvaliacaoFilmes)
app.use("/produtor", routerProdutor)
app.use("/atores", routerAtores)
app.use("/atoresFilmes", routerAtoresFilmes)

app.listen(porta, () => {
    const data = new Date();
    console.log(`Seridor iniciado na porta ${porta} ${data}`);
});