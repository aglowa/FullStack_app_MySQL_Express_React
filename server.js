
var express = require('express');
const fileUpload = require('express-fileupload');
var cors = require('cors');
const mysql = require('mysql');
const path = require('path');
const app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 3001

const { getHomePage } = require('./routes/index');
const { addTaskPage, addTask, deleteTask, editTask, editTaskPage } = require('./routes/task');

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fullstack_app'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

app.get('/todolist/', getHomePage);
app.get('/todolist/add', addTaskPage);
app.get('/todolist/edit/:id', editTaskPage);
app.get('/todolist/delete/:id', deleteTask);
app.post('/todolist/add', addTask);
app.post('/todolist/edit/:id', editTask);


app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({
        extended: false
    })
)

var Users = require('./routes/Users')

app.use('/users', Users)

app.listen(port, () => {
    console.log('Server is running on port: ' + port)
})
