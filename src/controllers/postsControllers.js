import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModels.js";
// Importa as funções que contém a lógica para interagir com o banco de dados e realizar as operações de leitura e escrita de posts.
import fs from "fs"
// Importa o módulo `fs` do Node.js, que permite realizar operações no sistema de arquivos, como renomear arquivos.
import gerarDescricaoComGemini from "../services/geminiServices.js"

export async function listarPosts(req, res){
  // Chama a função para obter todos os posts
  const posts = await getTodosPosts();
  // Envia uma resposta HTTP com status 200 (OK) e os posts no formato JSON
  res.status(200).json(posts);
}
// Esta função é responsável por listar todos os posts. Ela chama a função `getTodosPosts` do modelo para buscar os dados no banco de dados e envia os resultados como uma resposta JSON.

export async function postarNovoPost(req, res) {
  const novoPost = req.body;
  // Obtém os dados do novo post enviados no corpo da requisição.

  try{
    const postCriado = await criarPost(novoPost);
    // Tenta criar um novo post no banco de dados usando a função `criarPost`.
    res.status(200).json(postCriado);
    // Se a criação for bem-sucedida, envia uma resposta com status 200 e os dados do post criado.
  } catch(erro){
    console.error(erro.message);
    // Se ocorrer algum erro, imprime a mensagem de erro no console.
    res.status(500).json({"Erro": "Falha na Requisição"});
    // Envia uma resposta com status 500 (erro interno do servidor) e uma mensagem de erro genérica.
  }
}
// Esta função cria um novo post. Ela recebe os dados do novo post no corpo da requisição, chama a função `criarPost` para inserir o post no banco de dados e retorna uma resposta indicando o sucesso ou falha da operação.

export async function uploadImagem(req, res) {
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt:""
  };
  // Cria um objeto para representar o novo post, incluindo a imagem.

  try{
    const postCriado = await criarPost(novoPost);
    // Cria um novo post no banco de dados.

    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    // Constrói o novo nome do arquivo da imagem, usando o ID do post criado.
    fs.renameSync(req.file.path, imagemAtualizada);
    // Renomeia o arquivo da imagem para o novo nome, movendo-o para a pasta "uploads".

    res.status(200).json(postCriado);
    // Envia uma resposta com status 200 e os dados do post criado.
  } catch(erro){
    console.error(erro.message);
    res.status(500).json({"Erro": "Falha na Requisição"});
  }
}
// Esta função é responsável por fazer o upload de uma imagem e criar um novo post associado a ela. Ela recebe a imagem como um arquivo e cria um novo post no banco de dados. Em seguida, renomeia o arquivo da imagem para um nome único e o move para a pasta "uploads".

export async function atualizarNovoPost(req, res) {
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`;
  try{
    const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
    const descricao = await gerarDescricaoComGemini(imgBuffer)

    const post = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt
    };

    const postCriado = await atualizarPost(id, post);
    res.status(200).json(postCriado);
  } catch(erro){
    console.error(erro.message);
    res.status(500).json({"Erro": "Falha na Requisição"});
  }
}