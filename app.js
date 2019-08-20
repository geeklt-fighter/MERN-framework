var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const todoRoutes = express.Router();
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

let Todo = require('./model/todo.model')

var app = express();


mongoose.connect('mongodb://timlo-react-cosmosdb:T6g7Zt4HRZjRJ1XfR90kd1v4wrfiS2XAXtVkpcHzSBrd4wyNESbUuWqj5Qe25mH1KSaVB3poUu3BFrK6qmxDdg%3D%3D@timlo-react-cosmosdb.documents.azure.com:10255/?ssl=true')
    .then(() => {
        console.log('Connect successfully');
    })
    .catch((err) => {
        console.log('Error connecting to Mongo with: ', err)
    })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





todoRoutes.route('/').get((req, res) => {
 
  Todo.find(function (err, todos) {
      if (err) {
          console.log(err);
      } else {
          res.json(todos)
      }
  })
})

todoRoutes.route('/:id').get((req, res) => {
 
  let id = req.params.id;
  Todo.findById(id, (err, todo) => {
      res.json(todo)
  })
})

todoRoutes.route('/add').post((req, res) => {
  let todo = new Todo(req.body);
  todo.save()
      .then(todo => {
          res.status(200).json({ 'todo': 'todo added successfully' })
      })
      .catch(err => {
          res.status(400).send('adding new todo failed')
      })
})

todoRoutes.route('/update/:id').post((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
      if (!todo) {
          res.status(404).send('data is not found');
      } else {
          todo.todo_description = req.body.todo_description;
          todo.todo_responsible = req.body.todo_responsible;
          todo.todo_priority = req.body.todo_priority;
          todo.todo_completed = req.body.todo_completed;

          todo.save()
              .then(todo => {
                  res.json('Todo Updated !');
              })
              .catch(err => {
                  res.status(400).send('Update not possible')
              })
      }
  })
})







app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/todos', todoRoutes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
