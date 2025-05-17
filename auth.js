import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "./config.js";

const authRoutes = express.Router();

authRoutes.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Consulta usando await
    const [results] = await pool.query("SELECT * FROM perfil WHERE email = ?", [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Usuário ou senha incorretos." });
    }

    const usuario = results[0];

    const senhaValida = await senha === usuario.senha ? true : false;
    if (!senhaValida) {
      return res.status(401).json({ error: "Usuário ou senha incorretos." });
    }

    const token = jwt.sign(
      { id: usuario.idperfil, email: usuario.email, adm: !!usuario.adm },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Envia o token como cookie HTTP only, para maior segurança
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // só em HTTPS produção
      maxAge: 3600000, // 1 hora em ms
      sameSite: "lax"
    });

    // Também pode enviar no json se quiser
    res.json({ message: "Login realizado com sucesso" });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

export default authRoutes