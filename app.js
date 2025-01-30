// Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    // const mongoose = require('mongoose')
    const app = express()
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

//Outros

const PORT = 8081
app.listen(PORT, () => {
    console.log('O servidor está rodando na porta http://localhost/8081')
})