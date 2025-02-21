// Rotas do admin
// Configuração
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')

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
    Categoria.find().sort({ date: 'desc' }).then((categorias) => {
        res.render('admin/categorias', { categorias: categorias })
    }).catch((e) => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias')
        res.redirect('/admin')
    })
})

//Rota que vai criar as categorias
router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

//Rota que vai receber os dados do formulario
router.post('/categorias/nova', (req, res) => {

    var erros = [];


    if (!req.body.nome || typeof req.body.nome == 'undefined' || req.body.nome == null) {
        erros.push({ texto: 'Nome inválido' })
    }

    if (!req.body.slug || typeof req.body.slug == 'undefined' || req.body.slug == null) {
        erros.push({ texto: 'Slug inválido' })
    }

    if (req.body.nome.length < 2) {
        erros.push({ texto: 'Nome da categoria é muito pequeno' })
    }

    if (erros.length > 0) {
        res.render('admin/addcategorias', { erros: erros })
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((e) => {
            req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente')
            res.redirect('/admin')
        })
    }
})

//Rota para editar a categoria
router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({ _id: req.params.id }).then((categoria) => {
        res.render('admin/editcategorias', { categoria: categoria })
    }).catch((e) => {
        req.flash('error_msg', 'Essa categoria não existe')
        res.redirect('/admin/categorias')
    })
})

// Rota que vai enviar a edição
router.post('/categorias/edit', (req, res) => {

    var erros = []

    if (typeof req.body.nome == 'undefined' || req.body.nome == null) {
        erros.push({ texto: 'Nome não pode ser assim' })
    }

    if (typeof req.body.slug == 'undefined' || req.body.slug == null) {
        erros.push({ texto: 'Slug não pode ser assim' })
    }

    if (req.body.nome.length < 2) {
        erros.push({ texto: 'Nome da categoria é muito pequeno' })
    }

    if (erros.length > 0) {
        // Buscar novamente a categoria para manter os dados preenchidos
        Categoria.findById(req.body.id).then((categoria) => {
            if (!categoria) {
                req.flash('error_msg', 'Categoria não encontrada');
                return res.redirect('/admin/categorias');
            }
            res.render('admin/editcategorias', { erros: erros, categoria: categoria });
        }).catch((e) => {
            req.flash('error_msg', 'Erro ao buscar a categoria para edição');
            res.redirect('/admin/categorias');
        });
    } else {
        Categoria.findOne({ _id: req.body.id }).then((categoria) => {

            categoria.nome = req.body.nome
            categoria.slug = req.body.slug

            categoria.save().then(() => {
                req.flash('success_msg', 'Categoria editada com sucesso')
                res.redirect('/admin/categorias')
            }).catch((e) => {
                req.flash('error_msg', 'Houve um erro interno ao editar a categoria')
                res.redirect('/admin/categorias')
            })

        }).catch((e) => {
            req.flash('error_msg', 'Houve um error ao editar a categoria')
            res.redirect('/admin/categorias')
        })
    }
})

// Rota de deletar categoria
router.post('/categorias/deletar',(req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso!')
        res.flash('/admin/categorias')
    }).catch((e) => {
        req.flash('error_msg' , 'Houve um erro ao deletar a categoria')
        res.redirect('/admin/categorias')
    })
})

// Rota que vai listar as postagens
router.get('/postagens', (req, res) => {
    Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens) => {
        res.render('admin/postagens', {postagens : postagens})
    }).catch((e) => {
        req.flash('error_msg', 'Houve um erro ao listar as postagens')
        res.redirect('/admin')
    }) 

})

//Rota que vai adicionar as postagens no banco de dados
router.get('/postagens/add', (req, res) => {
    Categoria.find().then((categorias) => {
        res.render('admin/addpostagem', {categorias : categorias})
    }).catch(() => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulario')
        res.redirect('/admin')
    }) 
})

router.post('/postagens/nova', (req, res) => {

    let erros = []

    if(!req.body.titulo || typeof req.body.titulo == 'undefined' || req.body.titulo == null) {
        erros.push({texto: 'Titulo inválido'})
    }

    if(!req.body.slug || typeof req.body.slug == 'undefined' || req.body.slug == null) {
        erros.push({texto: 'Slug inválido'})
    }

    if(!req.body.descricao || typeof req.body.descricao == 'undefined' || req.body.descricao == null) {
        erros.push({texto: 'Descrição é inválida'})
    }

    if(!req.body.conteudo || typeof req.body.conteudo == 'undefined' || req.body.conteudo == null) {
        erros.push({texto: 'Conteudo é inválido'})
    }

    if(req.body.categoria == '0') {
        erros.push({texto: 'Categoria inválida, registre uma categoria'})
    }

    if(erros.length > 0) {
        res.render('admin/addpostagem', { erros: erros })
    }else {
        const novaPostagem = {
            titulo : req.body.titulo,
            slug : req.body.slug,
            descricao : req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch((e) => {
            req.flash('error_msg', 'Houve um erro durante o salvamento da postagem')
            res.redirect('/admin/postagens')
        }) 
    }

} )

//Rota para editar as postagens
router.get('/postagem/edit/:id', (req, res) => {

    Postagem.findOne({_id : req.params.id}).then((postagens) => {
        Categoria.find().then((categorias) => {
            res.render('admin/editpostagens', {categorias : categorias, postagens : postagens})
        }).catch((e) => {
            req.flash('error_msg', 'Houve um erro ao listar as categorias')
            res.redirect('/admin/postagens')
        })

    }).catch((e) => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulario de edição')
        res.redirect('/admin/postagens')
    })
})

router.post('/postagens/edit', (req, res) => {

    let erros = []

    if(!req.body.titulo || typeof req.body.titulo == 'undefined' || req.body.titulo == null) {
        erros.push({texto: 'Titulo inválido'})
    }

    if(!req.body.slug || typeof req.body.slug == 'undefined' || req.body.slug == null) {
        erros.push({texto: 'Slug inválido'})
    }

    if(!req.body.descricao || typeof req.body.descricao == 'undefined' || req.body.descricao == null) {
        erros.push({texto: 'Descrição é inválida'})
    }

    if(!req.body.conteudo || typeof req.body.conteudo == 'undefined' || req.body.conteudo == null) {
        erros.push({texto: 'Conteudo é inválido'})
    }

    if(req.body.categoria == '0') {
        erros.push({texto: 'Categoria inválida, registre uma categoria'})
    }

    if(erros.length > 0) {
        Postagem.findById(req.body.id).then((postagem) => {
            if (!postagem) {
                req.flash('error_msg', 'Postagem não encontrada');
                return res.redirect('/admin/postagens');
            }
            res.render('admin/editpostagens', { erros: erros, postagem: postagem });
        }).catch((e) => {
            req.flash('error_msg', 'Erro ao buscar a postagem para edição');
            res.redirect('/admin/postagens');
        });
    }else {
        Postagem.findOne({_id : req.body.id}).then((postagem) => {

            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria

            postagem.save().then(() => {
                req.flash('success_msg', 'Postagem editada com successo')
                res.redirect('/admin/postagens')
            }).catch((e) => {
                req.flash('error_msg' , 'Erro interno ao editar a postagem')
                res.flash('/admin/postagens')
            })
        }).catch((e) => {
            req.flash('error_msg', 'Erro ao editar a postagem')
            res.redirect('/admin/postagens')
        })
    }

})

//Rota de deletar postagens
router.get('/postagem/delete/:id' , (req, res) => {
    Postagem.deleteOne({_id : req.params.id}).then((postagens) => {
        req.flash('success_msg', 'Postagem deletar com sucesso!')
        res.redirect('/admin/postagens')
    }).catch((e) => {
        req.flash('error_msg', 'Houve um erro ao deletar a postagem')
        res.redirect('/admin/postagens')
    })
})

// Exportando as rotas
module.exports = router