const express = require("express")
const app = express()
const handlebars = require("express-handlebars")

app.engine("handlebars", handlebars.engine({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(express.static("img"));

app.get("/", function(req, res){
    res.render("home")
})

app.get("/cadastro", function(req, res){
    res.render("cadastro")
})

app.listen(8081, function(){
    console.log("Servidor ativo!")
})

