// Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const router = require('./routes/admin')
    const usuario = require('./routes/usuario')
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')
    require('./models/Postagem')
    const Postagens = mongoose.model('postagens')
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')
    const passport = require('passport')
    require('./config/auth')(passport)
//Configurações
    // Sessão
        app.use(session({
            secret: 'blogapp',
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    //Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
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
    //Rota principal
    app.get('/', (req, res) => {
        Postagens.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens) => {
            res.render('index', {postagens : postagens})
        }) .catch((e) => {
            req.flash('error_msg', 'Houve um erro ao carregar as postagens')
            res.redirect('/404')
        })

    })

    //Rota para mostrar mais sobre a postagem
    app.get('/postagem/:slug', (req , res) => {
        Postagens.findOne({slug: req.params.slug}).then((postagem) => {
            if(postagem) {
                res.render('postagem/index', {postagem : postagem})
            }else {
                req.flash('error_msg', 'Essa postagem não existe')
                res.redirect('/')
            }
        }).catch((e) => {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    })

    //Rota de listagem de categorias
    app.get('/categorias', (req, res) => {
        Categoria.find().then((categorias) => {
            res.render('categorias/index', {categorias : categorias})
        }).catch((e) => {
            req.flash('error_msg', 'Houve um erro interno ao listar as categorias')
            res.redirect('/')
        })
    })

    //Rota das postagem que tem uma categoria especifica
    app.get('/categorias/:slug', (req, res) => {
        Categoria.findOne({slug: req.params.slug}).then((categoria) => {
            if(categoria) {
                Postagens.find({categoria : categoria._id}).then((postagem) => {
                    res.render('categorias/postagem', {postagem : postagem, categoria: categoria})
                }).catch((e) => {
                    req.flash('error_msg', 'Houve um erro ao listar os posts')
                    res.redirect('/')
                })

            } else {
                req.flash('error_msg', 'Está categoria não existe')
                res.redirect('/')
            }
        }).catch((e) => {
            req.flash('error_msg', 'Houve um erro ao carregar a pagina dessa categoria')
            res.redirect('/')
        })
    })

    //Rota de erro 404
    app.get('/404', (req, res) => {
        res.send('Erro  404!')
    })

    //Rota do Usuario
    app.use('/usuarios', usuario)

    //Rota das categorias e postagens
    app.use('/admin', router)
//Outros

const PORT = 8081
app.listen(PORT, function() {
    console.log(`O servidor está rodando na porta http://localhost:${PORT}`)
})