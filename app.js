// Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const router = require('./routes/admin')
    // const mongoose = require('mongoose')
//Configurações
    //body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    //HandleBars
    app.engine('handlebars', handlebars.engine({
        defaultLayout: 'main',
        runtimeOptions: {
            allowProtoMethodsByDefault: true,
            allowProtoPropertiesByDefault: true
        }
    }));
    app.set('view engine', 'handlebars');
    // Mongoose
        // Em Breve
// Rotas
    app.use('/admin', router)
//Outros

const PORT = 8081
app.listen(PORT, function() {
    console.log(`O servidor está rodando na porta http://localhost:${PORT}`)
})