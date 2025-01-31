// Rotas do admin
// Configuração
const express = require('express')
const router = express.Router()

//Rota principal
router.get('/', (req, res) => {
    res.send('Pagina principal')
})

//Rota que vai listar posts
router.get('/posts', (req, res) => {
    res.send('Página de posts')
})

//Rota de categorias
router.get('/categoria', (req, res) => {
    res.send('Página de categorias')
})

// Exportando as rotas
module.exports = router