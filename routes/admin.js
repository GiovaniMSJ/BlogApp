// Rotas do admin
// Configuração
const express = require('express')
const router = express.Router()

//Rota principal
router.get('/', (req, res) => {
    res.send('Pagina principal')
})


// Exportando as rotas
module.exports = router