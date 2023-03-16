require('./config/db')

const app = require('express')() ;
const port = 3000;
const index = require('./routes/index');

const bodyParser = require('express').json;
app.use(bodyParser());
app.set('view engine', 'ejs');
app.use(require('express').urlencoded({ extended: false }));

app.use('/', index)
app. listen(port, () => {
  console.log(`Server running on port ${port}`);
})