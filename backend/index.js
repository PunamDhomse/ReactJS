const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
mongoose = require('mongoose')
User = require('./Models/UserModel')
const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())
app.use(cors());
app.get('/', (req, res) => res.send('Hello World with Express'));

mongoose.promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/Userdb",{useNewUrlParser: true ,  useUnifiedTopology: true});

const routes = require('./routes/UserListRoutes');
routes(app);


const port = process.env.PORT || 5000;

let db = mongoose.connection;
console.log(db)
db.once('open', () => console.log('connected to the database'));

app.listen(port, () => console.log('server started on port'+ port));
