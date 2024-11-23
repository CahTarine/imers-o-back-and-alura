import 'dotenv/config';
import { ObjectId } from "mongodb"
import conectarAoBanco from "../config/dbConfig.js"
// Importa a função para conectar ao banco de dados, definida em dbConfig.js.

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO)
// Conecta ao banco de dados usando a string de conexão fornecida pela variável de ambiente STRING_CONEXAO. 
// A palavra-chave 'await' indica que essa operação é assíncrona e aguarda a conclusão da conexão antes de continuar.

// Função assíncrona para buscar todos os posts do banco de dados.
export async function getTodosPosts(){
    const db = conexao.db("imersao-instabytes")
    // Obtém o banco de dados chamado "imersao-instabytes" a partir da conexão estabelecida.
    const colecao = db.collection("posts")
    // Obtém a coleção "posts" dentro do banco de dados.
    return colecao.find().toArray()
    // Executa uma consulta para encontrar todos os documentos (posts) na coleção e retorna os resultados como um array (lista).
};

export async function criarPost(novoPost) {
    const db = conexao.db("imersao-instabytes")
    const colecao = db.collection("posts")
    return colecao.insertOne(novoPost)
};

export async function atualizarPost(id, novoPost) {
    const db = conexao.db("imersao-instabytes")
    const colecao = db.collection("posts")
    const objID = ObjectId.createFromHexString(id) 
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost})
};