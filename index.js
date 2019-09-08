const express = require('express');

const server = express();

server.use(express.json());

//Req = Todos os dados da requisição
//Res = Todas as informação da resposta

//Query params = ?teste=1
//Route params = /users/1
//Request body = {"name": Diego, "email": diego@diego.com}

const users = ['Diego', 'Joyce', 'Ivan'];

/*
link: http://localhost:3000/?nome=Ivan
server.get('/', (req,res) => {
    const nome = req.query.nome;
    return res.json({ message: `Hello ${nome}`});
});


link: http://localhost:3000/users/100 
server.get('/users/:id', (req,res) => {
    const id = req.params.id;
    return res.json({ message: `Buscando o ID:  ${users[id]}`});
});
*/


/*
C R U D
*/

//Middleware Global
server.use((req, res, next) => {
    console.log(`Metodo: ${req.method}; URL: ${req.url}; `);

    return next();
});

//Middleware Local
function checkUserExists(req, res, next) {
    if(!req.body.name){
        return res.status(400).json({error: 'User not found on request'});
    }

    return next();
}
function checkUserInArray(req, res, next) {
    const user = users[req.params.index];
    
    if(!user){
        return res.status(400).json({error: 'User does not exists'});
    }

    req.user = user;

    return next();
}

server.get('/users/', (req,res) => {
   return  res.json(users);
});

server.get('/users/:index', checkUserInArray, (req,res) => {
    const {index} = req.params;
    //return res.json({ user: users[index]});
    return res.json(req.user);
});

server.post('/users', checkUserExists, (req, res) => {
    const {name} = req.body;

    users.push(name);

    return res.json(users);
});

server.put('/users/:index', checkUserExists, checkUserInArray, (req,res) => {
    const { index } = req.params;
    const { name } = req.body;

    users[index] = name;

    return res.json(users);
});

server.delete('/users/:index', checkUserInArray, (req,res) => {
    const { index } = req.params;

    users.splice(index,1);
    
    //return res.json(users);
    return res.send();
});

server.listen(3000);