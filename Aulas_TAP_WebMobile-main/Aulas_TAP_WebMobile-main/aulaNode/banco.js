const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('agendamento', "root", "", {
    host: "localhost",
    dialect: "mysql"
})

sequelize.authenticate().then(() => {
    console.log('Coneção realizada com sucesso')
}).catch((error) => {
        console.log(error)
})
const Agendamento = sequelize.define("agendamento", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bairro: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cep: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cidade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    observacao: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

// Agendamento.sync({force: true});
Agendamento.create({
    nome: "Rubens",
    endereco: "Rua 1",
    bairro: "AE CARVALHO",
    cep: 0989678,
    cidade: "São Paulo",
    estado: "SP",
    observacao: "Realizar serviços"
})