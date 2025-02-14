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

// Exportando as rotas
module.exports = router