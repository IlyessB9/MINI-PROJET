const express = require("express");
const { engine } = require('express-handlebars');
const connectDB = require("./connexions");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const UserRoutes = require("./routes/user");
app = express();
const port = 3000;

connectDB().catch(err => console.log(err));

app.engine('handlebars', engine());

app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

app.use(cookieParser());

app.use(express.static('SITE'));
app.use(UserRoutes);
app.listen(port, () => {
    console.log(`Connecté avec succès au port : ${port}`);
});