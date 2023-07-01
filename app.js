const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');

//Use Helper
const {
	toMoney,
	toMoneyDec,
	toNumber,
	ifCon,
	parseTags,
	parseContract,
	parseStrings,
	plusOne,
	HTML,
	formatDate,
	offHTML,
	formatLi,
	removeBr
} = require('./helpers/hbHelpers');

//Cors Middleware
app.use(cors());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.text({ type: 'text/html' }));

//  Handlebars Middleware
app.engine(
	'handlebars',
	exphbs.engine({
		helpers: {
			formatDate: formatDate,
			toMoney: toMoney,
			toMoneyDec: toMoneyDec,
			toNumber: toNumber,
			ifCon: ifCon,
			parseTags: parseTags,
			parseContract: parseContract,
			parseStrings: parseStrings,
			plusOne: plusOne,
			HTML: HTML,
			offHTML: offHTML,
			formatLi: formatLi,
			removeBr: removeBr
		},
		defaultLayout: 'main'
	})
);

app.set('view engine', 'handlebars');

//Use Public CSS
app.use(express.static(path.join(__dirname, 'public')));

// Express session middleware
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

//  Use Routes
app.use('/', require('./routes/index-users'));
app.use('/proposal', require('./routes/proposal/proposal'));
app.use('/content', require('./routes/content/content'));
app.use('/pge', require('./routes/pge/pge'));
app.use('/quickbase', require('./routes/pge/quickbase_pge'));
app.use('/estimation', require('./routes/pge/usage_estimation'));
app.use('/monitoring', require('./routes/monitoring/monitoring'));
app.use('/system', require('./routes/system/system'));
app.use('/presentation/solar', require('./routes/presentation/solar'));
app.use('/presentation/2020', require('./routes/presentation/offering'));
app.use('/pvwatts', require('./routes/pvwatts'));
app.use('/solar/contract', require('./routes/contracts/solar'));
app.use('/contract', require('./routes/contracts/non-solar'));
app.use('/change-order/contract', require('./routes/contracts/change-order'));
app.use('/site-survey', require('./routes/site-survey'));
app.use('/distance', require('./routes/distance'));

//Port Heroku Or Dev
const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`App Started On Port ${port}`);
});
