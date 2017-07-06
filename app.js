const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const models = require('./models/index');
const express = require('express');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/static', express.static('static'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/static/index.html");
})

app.get('/api/todos', function(req, res) {
    models.Todo.findAll().then((todos) => {
        res.json(todos);
    }).catch((err) => {
        console.log("Error getting todos -> " + err.message);
    });
})

app.post('/api/todos', function(req, res) {
    models.Todo.create({
        title: req.body.title,
        completed: req.body.completed
    }).then((todo) => {
        res.json(todo);
    }).catch((err) => {
        console.log("Error adding todo -> " + err.message);
        res.json({});
    })
})

app.get('/api/todos/:id', function(req, res) {
    models.Todo.findOne({where: {id: req.params['id']}}).then((todo) => {
        if(todo != null) {
            res.json(todo);
        } else {
            res.json({});
        }
    }).catch((err) => {
        console.log("Error getting todo by id: " + req.params['id'] + " -> msg: " + err.message);
        res.json({});
    });
})

app.put('/api/todos/:id', function(req, res) {
    
    models.Todo.update({title: req.body.title, completed: req.body.completed}, {where: {id: req.params['id']}}).then(todo => {
        if(todo != null) {
            res.json(todo);
        } else res.json({});
    }).catch(err => {
        console.log("Error updating todo by id: " + req.params['id'] + " -> msg: " + err.message);
    });
})

app.patch('/api/todos/:id', function(req, res) {
    
    let newdata = {};
    if(req.body.title) {
        newdata.title = req.body.title;
    } else if(req.body.completed) {
        newdata.completed = req.body.completed;
    }
    
    models.Todo.update(newdata, {where: {id: req.params['id']}}).then(todo => {
        if(todo != null) {
            res.json(todo);
        } else res.json({});
    }).catch(err => {
        console.log("Error patching todo by id: " + req.params['id'] + " -> msg: " + err.message);
    });
})

app.delete('/api/todos/:id', function(req, res) {
    models.Todo.destroy({where: {id: req.params['id']}}).then((todo) => {
        if(todo != null) {
            res.json(todo);
        } else res.json({});
    }).catch(err => {
        console.log("Error deleting todo by id: " + req.params['id'] + " -> msg: " + err.message);
    })
})

app.listen(3000, function () {
    console.log('Express running on http://localhost:3000/.')
});
