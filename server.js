// Importa o módulo Express, que é a base para criar aplicações web Node.js.
import express from "express";
import routes from "./src/routes/postRouts.js";

// Cria uma instância do Express, que será o objeto principal da nossa aplicação.
const app = express();
app.use(express.static("uploads"))
routes(app)

// Habilita o middleware (intermediário entre duas coisas, ex: aplicativo e banco de dados) para converter o corpo das requisições em formato JSON (que é uma forma simples de organizar os daods para as máquinas entenderem). 
app.use(express.json());

// Inicia o servidor Express na porta 3000 e exibe uma mensagem no console quando o servidor estiver pronto.
app.listen(3000, () => {
    console.log("Servidor escutando...");
});



