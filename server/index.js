require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const { CONNECTION_STRING, SESSION_SECRET } = process.env;
const app = express();
const PORT = 4000;
const authCtrl = require('./controllers/authController')

app.use(express.json());
app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET
    })
)


massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db => {
    app.set('db', db)
    console.log('aye aye captain!')
})

app.listen(PORT, () => console.log(`oooooh can you hear me? (port ${PORT})`));

app.post('/auth/register', authCtrl.register)