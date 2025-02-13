// Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const router = require('./routes/admin')
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')
//Configurações
    // Sessão
        app.use(session({
            secret: 'blogapp',
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    //Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            next()
        })
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
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://127.0.0.1:27017/blogapp').then(() => {
            console.log('Conectado ao mongo')
        }).catch((e) => { 
            console.log('Deu erro ao se conectar ao mongo ' + e)
        })
    // Public / Arquivos estáticos
    app.use(express.static(path.join(__dirname, 'public')))
// Rotas
    app.use('/admin', router)
//Outros

const PORT = 8081
app.listen(PORT, function() {
    console.log(`O servidor está rodando na porta http://localhost:${PORT}`)
})