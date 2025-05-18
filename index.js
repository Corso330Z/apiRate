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
import routerAvaliacaoSugsAtores from "./hiago/rotas/rotaAvaliaSugsAtor.js"

import { verifyToken, isAdmin } from "./middlewares/verifyToken.js";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/rotas/auth.js"
import routerSugestaoAtores from "./isa/rotas/rotaSugsAtores.js";
import routerSugestaoFilmes from "./isa/rotas/rotaSugsFilmes.js";
import routerAvaliacaoSugsFilmes from "./hiago/rotas/rotaAvaliaSugsFilme.js";
import routerPerfil from "./lavinia/rotas/rotaPerfil.js";
import routerFavoritosFilmes from "./lavinia/rotas/rotaFavsFilmes.js";
import routerFavoritosAtores from "./lavinia/rotas/rotaFavsAtores.js";
import routerDiretor from "./livia/rotas/rotaDiretor.js";
import routerDiretoresFilmes from "./livia/rotas/rotaDiretoresFilmes.js";
import routerGenero from "./max/rotas/rotaGeneros.js";
import routerGenerosFilmes from "./max/rotas/rotaGenerosFilmes.js";
import routerComentariosFilmes from "./livia/rotas/rotaComentarios.js";
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
app.use("/sugestaoFilmes", routerSugestaoFilmes)
app.use("/avaliacaoSugestaoAtores", routerAvaliacaoSugsAtores)
app.use("/avaliacaoSugestaoFilmes", routerAvaliacaoSugsFilmes)
app.use("/perfil", routerPerfil)
app.use("/favoritosFilmes", routerFavoritosFilmes)
app.use("/favoritosAtores", routerFavoritosAtores)
app.use("/diretor", routerDiretor)
app.use("/diretoresFilmes", routerDiretoresFilmes)
app.use("/generos", routerGenero)
app.use("/generosFilmes", routerGenerosFilmes)
app.use("/comentarios", routerComentariosFilmes)

app.listen(porta, () => {
    const data = new Date();
    console.log(`Seridor iniciado na porta ${porta} ${data}`);
});