global.__basePath           = process.cwd() + '/';
const express               = require('express');
const bodyParser            = require('body-parser');
const cors                  = require('cors');
const app                   = express();
var server                  = require('http').createServer(app);

const PORT                  = "5611";

const htmlbasePath          = '/Contacts/public/';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/knol',express.static('public', {
    extensions: ['html'],
}));

app.get('knol/ping', (req, res, next) => {
    res.send(util.createResponse(true, "pong"));
});
app.get('/knol/pages/*', function (req, res) {
    res.redirect(`${htmlbasePath}errorPage/error`);
});

server.listen(PORT, () => {
    console.log(`Eagle flying on port: ${PORT}`)
});
