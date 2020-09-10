global.__basePath = process.cwd() + '/';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
var server = require('http').createServer(app);
const config = require('./config/configuration');
const PORT = process.env.PORT || config.get("server:port");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/knol', express.static('public', {
    extensions: ['html'],
}));

app.get('/knol/ping', (req, res, next) => {
    res.send(util.createResponse(true, "pong"));
});

require('./config/dependency')(app);

app.get('/knol/pages/*', function (req, res) {
    res.redirect(`/knol/pages/error`);
});

server.listen(PORT, () => {
    console.log(`Knolskape contacts app is running on port: ${PORT}`);
});
