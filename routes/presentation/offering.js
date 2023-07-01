const express = require('express');
const router = express.Router();
const axios = require('axios');

//QuickBase
const {
	QB_QUERY_FID
} = require('../../helpers/query');

// Helpers
const {
	CREATE_COST
} = require('./helpers/cost');

router.get('/', (req, res) => {
	const recId = req.query.recId;
	const name = req.query.name.replace(/ *\([^)]*\) */g, '');
	const presentation = {};
	presentation.compare = [];
	axios
		.all([
			// ====================== CONTENT =========================
			QB_QUERY_FID('bnyi4n2cv', 'obj', '{6.EX.Presentation2020}', 'a'),
			// ====================== Warranty =========================
			QB_QUERY_FID('bnyi4n2cv', 'arr', '{6.EX.Warranty Matrix}', 'a'),
			// ====================== PRICING =========================
			QB_QUERY_FID('bpmbhwbng', 'arr', `{37.EX.${recId}}AND{337.EX.1}AND{312.CT.${name}}`, 'a')
		])
		.then(
			axios.spread((content, warranty, pricing) => {
				if (pricing.length === 0) return res.json({
					success: false,
					error: 'No Price Record'
				});
				presentation.content = content;
				presentation.pricing = pricing;
				presentation.warranty = warranty;
				presentation.customerName = pricing[0]._fid_312;
				presentation.customerAddress = pricing[0]._fid_251;
				presentation.hasFinancing = false;
				presentation.hideCash = true;

				// Break out of forEach
				let count = 0;
				presentation.pricing.forEach((price, i) => {
					presentation.current = {
						_fid_369: price._fid_369,
						_fid_368: price._fid_368,
						_fid_334: price._fid_334,
						_fid_335: price._fid_335
					};
					price.cost = CREATE_COST(price);
					price.cost.forEach((option) => presentation.compare.push(option));
					price.disclaimer = content;
					price.hasFinancing = false;
					price.hasSolarInsure = price._fid_664.indexOf('SolarInsure') > -1;

					price._fid_346 = price._fid_346.replace('solarenergyforlife.com', 'savingenergyforlife.com');
					if (price._fid_817) price._fid_817 = price._fid_817.replace(/;/g, '<br>');
					if (price._fid_848) {
						price._fid_848 = price._fid_848.replace(/;/g, '<br>+ ');
					}
					if (price._fid_817)
						price._fid_817 = price._fid_817.replace('A)', '').replace('C)', '').replace('B)', '');

					if (price._fid_61) {
						presentation.hasFinancing = true;
						price.hasFinancing = true;
					}
					if (price._fid_341 != 0) {
						presentation.hideCash = false;
					}

					axios
						.all([
							// ====================== Contact Agent =========================
							QB_QUERY_FID(
								'bkhxst86z',
								'obj',
								`{9.CT.${price._fid_346.toLowerCase()}}`,
								'58.115.111.9.31'
							),

							// ====================== Offering Info =========================
							QB_QUERY_FID('bqajvsekn', 'array', `{12.EX.${price._fid_3}}`, 'a')
						])
						.then(
							axios.spread((agent, offering) => {
								if (!presentation.agent) presentation.agent = agent;
								price.offering = offering.sort((a, b) => a._fid_155 > b._fid_155);

								price.offering.forEach((offer) => {
									if (offer._fid_7) {
										if (!price.solar && offer._fid_7.indexOf('Module') !== -1) price.solar = offer;

										if (!price.storage && offer._fid_7.indexOf('Battery') !== -1) price.storage = offer;

										if (!price.generator && offer._fid_7.indexOf('Generator') !== -1)
											price.generator = offer;
									}

									offer._fid_155 = offer._fid_155
										.replace('A)', '')
										.replace('C)', '')
										.replace('B)', '');
								});

								// Get Type of Offering
								price.type = '';
								if (price.solar) price.type += 'solar+';
								if (price.storage) price.type += 'storage+';
								if (price.generator) price.type += 'generator+';

								count++;
							})
						)
						.then(() => {
							if (count === presentation.pricing.length) {
								presentation.pricingLength = presentation.pricing.length + 1;
								presentation.query = req.query;
								return res.render('offering', {
									presentation,
									layout: 'tailwind'
								});
							}
						})
						.catch((err) => {
							console.log('error', err);
							res.json({
								success: false,
								error: err
							});
						});
				});
			})
		)
		.catch((err) => {
			console.log('error', err);
			res.json({
				success: false,
				error: err
			});
		});
});

module.exports = router;