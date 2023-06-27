const express = require("express")
const app = express()
const exphdb = require("express-handlebars").engine
const handlebars = require("handlebars")
const bodyParser = require("body-parser")
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')

const serviceAccount = require('./tpwm-c828e-firebase-adminsdk-rv6ax-3fee8df35f.json')

initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()

// Função auxiliar para comparar valores em um bloco {{#ifCond}}
handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

app.engine("handlebars", exphdb({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res){
    res.render("primeira_pagina")
})

app.get("/consulta", function(req, res){
    const data = [];
    db.collection('agendamentos').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            // Acessa os atributos do documento
            const id = doc.id;
            const nome = doc.data().nome;
            const telefone = doc.data().telefone;
            const origem = doc.data().origem;
            const data_contato = doc.data().data_contato;
            const observacao = doc.data().observacao;
        
            // Faça o que desejar com os dados
            data.push({
                id: id,
                nome: nome,
                telefone: telefone,
                origem: origem,
                data_contato: data_contato,
                observacao: observacao
              });
            });
        res.render('consulta', { data: data });       
        })
        .catch((error) => {
            console.log('Erro ao obter documentos:', error);
            res.send('Erro ao obter documentos');
        });
})

app.get("/editar/:id", function(req, res){
    const id = req.params.id;
    
    // Obter a referência ao documento com o ID fornecido
    const docRef = db.collection('agendamentos').doc(id);
    
    // Obter os dados desse documento
    docRef.get()
        .then((doc) => {
            if (doc.exists) {
                // O documento existe, você pode acessar os dados usando doc.data()
                const data = [{
                    id: doc.id,
                    nome: doc.data().nome,
                    telefone: doc.data().telefone,
                    origem: doc.data().origem,
                    data_contato: doc.data().data_contato,
                    observacao: doc.data().observacao
                }];
                res.render('editar', { data: data });
            } else {
                // O documento não existe
                res.send('Documento não encontrado');
            }
        })
        .catch((error) => {
            console.log('Erro ao obter documento:', error);
            res.send('Erro ao obter documento');
        });
})
app.get('/excluir/:id', (req, res) => {
    const id = req.params.id;
    
    // Exibe o alerta de confirmação no navegador
    res.send(`
      <script>
        if (confirm('Tem certeza que deseja excluir o item com o ID ${id}?')) {
          // Se confirmado, redireciona para a rota de exclusão
          window.location.href = '/excluir-item/${id}';
        } else {
          // Se cancelado, redireciona para uma rota de cancelamento ou página inicial, por exemplo
          window.location.href = '/consulta';
        }
      </script>
    `);
  });

app.get("/excluir-item/:id", function(req, res){
    const id = req.params.id;
    db.collection('agendamentos').doc(id).delete()
    .then(function(){
        console.log("documento: " + id + " excluído com sucesso.")
        res.redirect('/consulta')
    })
    .catch((error) => {
        console.log("Erro ao excluir o documento:", error);
        res.send("Erro ao excluir o documento");
    })
})

app.post("/cadastrar", function(req, res){
    db.collection('agendamentos').add({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        console.log('Added document');
        res.redirect('/')
    })
})

app.post("/atualizar/:id", function(req, res){
    const id = req.params.id; // Obtenha o ID do documento da URL
    const { nome, telefone, origem, data_contato, observacao } = req.body; // Obtenha os novos dados do formulário

    db.collection('agendamentos').doc(id)
    .update({
        nome: nome,
        telefone: telefone,
        origem: origem,
        data_contato: data_contato,
        observacao: observacao
    })
    .then(() => {
        console.log("Documento atualizado com sucesso");
        res.redirect("/consulta");
    })
    .catch((error) => {
        console.log("Erro ao atualizar o documento:", error);
        res.send("Erro ao atualizar o documento");
    });
})

app.listen(8081, function(){
    console.log("Servidor ativo!")
})