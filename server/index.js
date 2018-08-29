const  express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const db_config = require('./database/Db');

const users = require('./routes/users/route-user');
const contacts = require('./routes/contacts/route-contact');

const app = express();


//initialize passport
app.use(passport.initialize());
require('./passport')(passport);

//config database
mongoose.connect(db_config.DB, {useNewUrlParser: true})
.then(
    ()=>{console.log('Database connected')},
    err =>{console.log('Cannot connect to the database'+ err)}
)

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/contacts', contacts);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server running on PORT', PORT);
})



