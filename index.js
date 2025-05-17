import express from "express";
import cors from "cors";

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig.js';

//importando a rota
import routerFilmes from "./hiago/rotas/rotafilmes.js";
import routerAvaliacaoFilmes from "./mariana/rotas/rotaAvaliaFilmes.js"
import routerProdutor from "./isa/rotas/rotaProdutor.js";
import routerAtores from "./corso/rotas/rotaAtores.js";
import routerAtoresFilmes from "./corso/rotas/rotaAtoresFilmes.js";
import routerAvaliacaoComentarios from "./mariana/rotas/rotaAvaliaComen.js";
import routerAvaliacaoAtores from "./mariana/rotas/rotaAvaliaAtores.js";
import routerProdutorFilmes from "./corso/rotas/rotaProdutorFilmes.js";


import { verifyToken, isAdmin } from "./middlewares/verifyToken.js";
import cookieParser from "cookie-parser";
import authRoutes from "./auth.js"
import routerSugestaoAtores from "./isa/rotas/rotaSugsAtores.js";
const porta = 9000;
const app = express();
app.use(cors());

app.use(cookieParser());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        docExpansion: "none",              
        defaultModelsExpandDepth: -1      
    }
}));

app.use("/auth", authRoutes);

app.get("/user", verifyToken, (req, res) => {
  res.json({ msg: "Olá usuário!", user: req.user });
});

app.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.json({ msg: "Olá admin!", user: req.user });
});

app.use("/filmes", routerFilmes)
app.use("/avaliacaoFilmes", routerAvaliacaoFilmes)
app.use("/produtor", routerProdutor)
app.use("/atores", routerAtores)
app.use("/atoresFilmes", routerAtoresFilmes)
app.use("/avaliacaoComentarios", routerAvaliacaoComentarios)
app.use("/avaliacaoAtores", routerAvaliacaoAtores)
app.use("/produtorFilmes", routerProdutorFilmes)
app.use("/sugestaoAtores", routerSugestaoAtores)
app.listen(porta, () => {
    const data = new Date();
    console.log(`Seridor iniciado na porta ${porta} ${data}`);
});