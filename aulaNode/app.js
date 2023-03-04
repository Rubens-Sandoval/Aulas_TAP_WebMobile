const express = require("express")
const app = express()

// Req: Recebe informações.
// Res: Envia informações.
app.get("/", function(req, res){
    res.sendFile(__dirname + "/html/index.html")
})

app.get("/produtos/:modelo/:item", function(req, res){
    res.send(req.params) //req.params -> Lê todas as variáves passadas por URL.
})

app.get("/empresa/:setor", function(req, res){
    res.send("Setor: " + req.params.setor)
})

app.get("/teste", function(req, res){
    res.send("Setor: " + req.params.tester)
})

app.listen(8081, function(){
    console.log("Servidor ativo!")
})

