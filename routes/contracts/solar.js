const express = require('express');
const router = express.Router();
const axios = require('axios');

//QuickBase
const {
	QB_QUERY_FID
} = require('../../helpers/query');

//Helpers
const {
	formatNumber
} = require('../../helpers/formatContent');

router.get('/', (req, res) => {
	const rec_id = req.query.rec_id;

	axios
		.all([
			QB_QUERY_FID('bnyi4n2cv', 'obj', '{6.EX.Solar Contract}AND{76.EX.1}', 'a'),
			QB_QUERY_FID(
				'bpmbhwbng',
				'obj',
				`{3.EX.${rec_id}}`,
				'3.73.74.235.251.351.381.419.456.470.247.493.499.500.501.225.257.507.672.1384.1385'
			)
		])
		.then(
			axios.spread((content, price) => {
				if (Array.isArray(content._fid_11)) content._fid_11 = content._fid_11.join('');
				if (Array.isArray(content._fid_14)) content._fid_14 = content._fid_14.join('');
				if (Array.isArray(content._fid_9)) content._fid_9 = content._fid_9.join('');

				// Contract Notes
				const contract_notes =
					price._fid_419 !== undefined ? `<p><b>Contract Notes:</b><p> <p>${price._fid_419}</p>` : '';

				// Warranty Terms
				content._fid_9 = content._fid_9.replace(/#valueWarranty/g, price._fid_507);

				// Cash or Loan Checkbox
				if (price._fid_247 === 'Cash') {
					content._fid_11 = content._fid_11
						.replace('#cashChecked', '&#10003;')
						.replace('#financedChecked', '');
					content._fid_14 = content._fid_14.replace(
						'#totalSystemCost',
						`${formatNumber(Number(price._fid_235))}`
					);
					content.selected_price = 'Cash';
				} else if (price._fid_247 === 'Loan') {
					content._fid_11 = content._fid_11
						.replace('#cashChecked', '')
						.replace('#financedChecked', '&#10003;');
					content._fid_14 = content._fid_14.replace(
						'#totalSystemCost',
						`${formatNumber(Number(price._fid_672))}`
					);
					content.selected_price = 'Loan';
				} else {
					content._fid_11 = content._fid_11
						.replace('#cashChecked', "<span class='text-danger'>Error: Select Option</span>")
						.replace('#financedChecked', "<span class='text-danger'>Error: Select Option</span>");
				}

				// List Items Drop down
				if (price._fid_381 !== undefined) {
					price._fid_381 = price._fid_381.replace(/<li>/g, '( 1 ) ').replace(/<\/\li>/g, '<br>');
				} else {
					price._fid_381 = '';
				}

				// Global Replacements
				content._fid_11 = content._fid_11
					.replace('#systemSize', price._fid_74)
					.replace('#customerName', price._fid_456)
					.replace('#customerAddress', price._fid_470)
					.replace('#projectLocation', price._fid_251)
					.replace('#moduleQuantity', price._fid_73)
					.replace('#moduleType', price._fid_351)
					.replace('#costAdders', price._fid_381)
					.replace('#contractNotes', contract_notes);
				// Cash Obj
				content._fid_11 = content._fid_11
					.replace('#cashPrice', `$${formatNumber(Number(price._fid_235))}`)
					.replace('#deposit', `$${formatNumber(Number(price._fid_493))}`)
					.replace('#uponWork', `$${formatNumber(Number(price._fid_499))}`)
					.replace('#uponInstallation', `$${formatNumber(Number(price._fid_500))}`)
					.replace('#balanceDue', `$${formatNumber(Number(price._fid_501))}`);

				// Finance Obj
				if (price._fid_225) {
					content._fid_11 = content._fid_11
						.replace('#PriceWithCon', `$${formatNumber(Number(price._fid_257) + Number(price._fid_225))}`)
						.replace(/#contribution/g, `$${formatNumber(Number(price._fid_225))}`)
						.replace('#loanPrice', `$${formatNumber(Number(price._fid_257))}`);
				} else {
					content.hide_contribution = true;
					content._fid_11 = content._fid_11
						.replace('Price includes a #contribution customer contribution.', ``)
						.replace('#PriceWithCon', `$${formatNumber(Number(price._fid_257))}`)
						.replace('#loanPrice', `$${formatNumber(Number(price._fid_257))}`);
				}

				res.render('contracts/solar', content);
			})
		);
});

router.get('/offering', (req, res) => {
	const rec_id = req.query.rec_id;

	axios
		.all([
			QB_QUERY_FID('bnyi4n2cv', 'obj', '{6.EX.Contract 2020}AND{76.EX.1}', 'a'),
			QB_QUERY_FID('bpmbhwbng', 'obj', `{3.EX.${rec_id}}`, 'a')
		])
		.then(
			axios.spread((content, price) => {
				if (Array.isArray(content._fid_11)) content._fid_11 = content._fid_11.join('');
				if (Array.isArray(content._fid_14)) content._fid_14 = content._fid_14.join('');
				if (Array.isArray(content._fid_9)) content._fid_9 = content._fid_9.join('');
				content._fid_9 = content._fid_9.replace(/#pageBreak/g, "<div class='pb-always'></div>");
				if (price._fid_911) price._fid_911 = price._fid_911.split(/[A-Z]\) /);

				if (price._fid_937) price._fid_911.push(price._fid_937.split(/;/g).join('<br/>'))

				if (price._fid_938) {
					if (Array.isArray(price._fid_938) && price._fid_938.length > 0) {
						price._fid_938 = price._fid_938.join('')
						price._fid_938 = price._fid_938.replace(/\n:/g, ';')
					}
					price._fid_938 = price._fid_938.split(/;/g).join('<br/>')
				}
				price._fid_911.push(price._fid_938)
				price._fid_911 = price._fid_911.splice(1).join('<br/>')

				content._fid_11 = content._fid_11.replace(/_fid_456/g, price._fid_456);
				content._fid_11 = content._fid_11.replace(/_fid_251/g, price._fid_251);
				content._fid_11 = content._fid_11.replace(/_fid_470/g, price._fid_470);
				content._fid_11 = content._fid_11.replace(/_fid_911/g, price._fid_911);
				if (price._fid_419) {
					content._fid_11 = content._fid_11.replace(/_fid_419/g, `<b>Contract Notes:</b> <br> ${price._fid_419}`);
				} else {
					content._fid_11 = content._fid_11.replace(/_fid_419/g, "");
				}
				content._fid_11 = content._fid_11.replace(/#pageBreak/g, "<div class='pb-always'></div>");
				content._fid_11 = content._fid_11.replace(/_fid_937/g, price._fid_937);
				content._fid_11 = content._fid_11.replace(/_fid_937/g, price._fid_937);
				content._fid_11 = content._fid_11.replace(/_fid_938/g, price._fid_938);
				content._fid_11 = content._fid_11.replace(/_fid_1384/g, price._fid_1384 ? price._fid_1384 : '3');
				content._fid_11 = content._fid_11.replace(/_fid_1385/g, price._fid_1385 ? price._fid_1385 : '2');
				content._fid_11 = content._fid_11.replace(/_fid_243/g, `$${formatNumber(Number(price._fid_243))}`);
				content._fid_11 = content._fid_11.replace(/_fid_257/g, `$${formatNumber(Number(price._fid_257))}`);
				content._fid_11 = content._fid_11.replace(/_fid_502/g, `$${formatNumber(Number(price._fid_502))}`);
				content._fid_11 = content._fid_11.replace(/_fid_493/g, `$${formatNumber(Number(price._fid_493))}`);
				content._fid_11 = content._fid_11.replace(/_fid_499/g, `$${formatNumber(Number(price._fid_499))}`);
				content._fid_11 = content._fid_11.replace(/_fid_500/g, `$${formatNumber(Number(price._fid_500))}`);
				content._fid_11 = content._fid_11.replace(/_fid_501/g, `$${formatNumber(Number(price._fid_501))}`);
				content._fid_14 = content._fid_14.replace(/_fid_243/g, formatNumber(Number(price._fid_243)))

				if (price._fid_247 === 'Cash') {
					content._fid_11 = content._fid_11.replace(/#cashChecked/g, '&#10004;');
					content._fid_11 = content._fid_11.replace(/#financedChecked/g, '');
					content.isCash = 1;
				} else {
					content._fid_11 = content._fid_11.replace(/#cashChecked/g, '');
					content._fid_11 = content._fid_11.replace(/#financedChecked/g, '&#10004;');
					content.isCash = 0;
				}

				if (price._fid_502 && price._fid_502 != 0) {
					content.hasContribution = 1
				} else {
					content.hasContribution = 0
				}

				res.render('contracts/offering', content);
			})
		);
});

module.exports = router;
