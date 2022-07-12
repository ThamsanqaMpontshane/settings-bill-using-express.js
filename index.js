const express = require('express');
const bodyParser = require('body-parser');
const SettingsBill = require('./settings-bill');

const exphbs = require('express-handlebars');
const app = express();
const settingsBill = SettingsBill();

app.engine('handlebars', exphbs.engine());

app.set('view engine', 'handlebars');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index', {
        setting: settingsBill.getSettings(),
        totals: settingsBill.totals()
    });
});
app.post('/settings', function (req, res) {
    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });
    console.log(settingsBill.getSettings());
    res.redirect('/');
});
app.post('/action', function (req, res) {
    settingsBill.recordAction(req.body.actionType);
    res.redirect('/');
});
app.get('/actions', function (req, res) {

    res.render('actions',{actions: settingsBill.actions()});

});
app.get('/actions/:actionType', function (req, res) {
const actionType = req.params.actionType;
    res.render('actions',{actions: settingsBill.actionsFor(actionType)});
});

let port = process.env.PORT || 3006;

app.listen(port, function () {
    console.log('listening on port 3006');
});