import express from "express";
// Importa o framework Express, que será a base da nossa aplicação web. Ele fornece as funcionalidades básicas para criar servidores HTTP e definir rotas.

import multer from "multer";
// Importa o módulo Multer, que é especializado em lidar com o upload de arquivos. Ele será usado para gerenciar o envio de imagens para o servidor.

import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsControllers.js";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
};

// Configura o armazenamento de arquivos usando o Multer
const storage = multer.diskStorage({
  // Define o diretório de destino para os arquivos
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Substitua por seu caminho de upload desejado
    // Indica para o Multer salvar os arquivos no diretório 'uploads/'. 
    // Você pode personalizar esse caminho para definir onde as imagens serão armazenadas no seu servidor.
  },
  // Define o nome do arquivo salvo
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Considere usar uma estratégia de geração de nomes únicos para produção
    // Define o nome do arquivo salvo como o nome original do arquivo enviado pelo usuário. 
    // **Importante:** Para evitar conflitos de nomes, é recomendado gerar nomes únicos para os arquivos, por exemplo, usando timestamps ou UUIDs.
  }
});

const upload = multer({ storage });
// Cria uma instância do Multer com a configuração de armazenamento definida anteriormente. Essa instância será usada para configurar as rotas de upload.

const routes = (app) => {
  // Habilita o middleware para analisar corpos de requisições JSON
  app.use(express.json());
  // Permite que a aplicação entenda as requisições que enviam dados no formato JSON. 
  app.use(cors(corsOptions)),

  // Define uma rota GET para obter todos os posts
  app.get("/posts", listarPosts);
  // Quando uma requisição GET for feita para a URL `/posts`, a função `listarPosts` será chamada. 
  // Essa função provavelmente irá buscar os posts no banco de dados e enviar a resposta para o cliente.

  // Define uma rota POST para criar um novo post
  app.post("/posts", postarNovoPost);
  // Quando uma requisição POST for feita para a URL `/posts`, a função `postarNovoPost` será chamada. 
  // Essa função irá criar um novo post no banco de dados com as informações enviadas no corpo da requisição.

  // Define uma rota POST para fazer upload de uma imagem
  app.post("/upload", upload.single("imagem"), uploadImagem);
  // Quando uma requisição POST for feita para a URL `/upload`, o Multer irá extrair o arquivo enviado com o nome "imagem" e salvá-lo no diretório configurado.
  // Em seguida, a função `uploadImagem` será chamada para realizar qualquer processamento adicional necessário.

  app.put("/upload/:id", atualizarNovoPost)
};

export default routes;
// Exporta a função `routes` para que ela possa ser utilizada em outros módulos da aplicação.
// Essa função é responsável por configurar as rotas da aplicação.