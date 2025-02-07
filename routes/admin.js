// Rotas do admin
// Configuração
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

//Rota principal
router.get('/', (req, res) => {
    res.render('admin/index')
})

//Rota que vai listar posts
router.get('/posts', (req, res) => {
    res.send('Página de posts')
})

//Rota de categorias
router.get('/categorias', (req, res) => {
    res.render('admin/categorias')
})

//Rota que vai criar as categorias
router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

//Rota que vai receber os dados do formulario
router.post('/categorias/nova', (req, res) => {
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
        console.log('Categoria salva com sucesso')
    }).catch((e) => {
        console.log('Deu erro ao salvar a categoria ' + e)
    })
})

// Exportando as rotas
module.exports = router