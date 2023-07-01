const moment = require('moment');
module.exports = {
	toMoney: function(amount) {
		amount = parseFloat(amount);
		if (amount == 0 || amount == undefined || amount == null) {
			amount = '0.00';
		} else {
			if (amount > 1) {
				amount = amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
				amount = amount.substring(0, amount.lastIndexOf('.'));
			} else {
				amount = amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
			}
		}

		return `$${amount}`;
	},
	toMoneyDec: function(amount) {
		if (amount === 'Not Applicable') return 'Not Applicable';
		if (amount == 0 || amount == undefined || amount == null) {
			amount = '0.00';
		} else {
			amount = parseFloat(amount);

			if (amount > 1) {
				amount = amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
			} else {
				amount = amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
			}
		}

		return `$${amount}`;
	},
	toNumber: function(amount) {
		if (amount === 'Not Applicable') return 'Not Applicable';
		amount = parseFloat(amount);
		if (amount == 0 || amount == undefined || amount == null) {
			amount = '0.00';
		} else {
			if (amount > 1) {
				amount = amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
				amount = amount.substring(0, amount.lastIndexOf('.'));
			} else {
				amount = amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
			}
		}
		return amount;
	},
	ifCon: function(v1, operator, v2, options) {
		switch (operator) {
			case '==':
				return v1 == v2 ? options.fn(this) : options.inverse(this);
			case '===':
				return v1 === v2 ? options.fn(this) : options.inverse(this);
			case '!=':
				return v1 != v2 ? options.fn(this) : options.inverse(this);
			case '!==':
				return v1 !== v2 ? options.fn(this) : options.inverse(this);
			case '<':
				return v1 < v2 ? options.fn(this) : options.inverse(this);
			case '<=':
				return v1 <= v2 ? options.fn(this) : options.inverse(this);
			case '>':
				return v1 > v2 ? options.fn(this) : options.inverse(this);
			case '>=':
				return v1 >= v2 ? options.fn(this) : options.inverse(this);
			case '&&':
				return v1 && v2 ? options.fn(this) : options.inverse(this);
			case '||':
				return v1 || v2 ? options.fn(this) : options.inverse(this);
			case 'includes':
				return v1 !== undefined && v1.includes(v2) ? options.fn(this) : options.inverse(this);
			default:
				return options.inverse(this);
		}
	},
	parseTags: function(string, remove) {
		if (typeof string === 'object') {
			string = JSON.stringify(string);
			string = JSON.parse(string);
			string = string['#text'];
		}

		if (string === undefined) return;

		if (string.indexOf('&lt;') !== -1 || string.indexOf('&gt;') !== -1) {
			string = string.replace(/&lt;/g, '<');
			string = string.replace(/&gt;/g, '>');
			string = string.replace(/&quot;/g, '"');
			string = string.replace(/&rqduo;/g, '"');
			string = string.replace(/&rqduo;/g, '"');
		} else {
			return string;
		}

		if (remove === '<h5>') {
			string = string.replace(/<h5>[\s\S]*?<\/h5>/, '');
		}

		return string;
	},
	parseContract: function(string, contractObj) {
		if (typeof string === 'object') {
			string = JSON.stringify(string);
			string = JSON.parse(string);
			string = string['#text'];
			string = string.replace(/&lt;/g, '<');
			string = string.replace(/&gt;/g, '>');
			string = string.replace(/&quot;/g, '"');
			string = string.replace(/&amp;nbsp;/g, '&nbsp;');
			string = string.replace(/&amp;quot;/g, '&quot;');
			string = string.replace(/&amp;rsquo;/g, '&rsquo;');
			string = string.replace(/&amp;ldquo;/g, '&ldquo;');
			string = string.replace(/&amp;rdquo;/g, '&rdquo;');
			string = string.replace(/&amp;larr;/g, '&larr;');
			string = string.replace(/&amp;#39;/g, '&#39;');
			string = string.replace(/&amp;ndash;/g, '&ndash;');
			string = string.replace(/&amp;#8208;/g, '-');
			//&sect;
			string = string.replace(/&amp;sect;/g, '&sect;');
			//System Values
			if (contractObj.CashOrFinanced === 'Cash') {
				string = string.replace('#cashChecked', '&#10004;');
				string = string.replace('#financedChecked', '');
			} else if (contractObj.CashOrFinanced === 'Loan') {
				string = string.replace('#financedChecked', '&#10004;');
				string = string.replace('#cashChecked', '');
			} else {
				string = string.replace('#financedChecked', '');
				string = string.replace('#cashChecked', '');
			}
			string = string.replace('#customerName', `${contractObj.CustomerName}`);
			string = string.replace('#customerAddress', contractObj.CustomerAddress);
			string = string.replace('#projectLocation', contractObj.ProjectLocation);
			string = string.replace('#systemSize', contractObj.SystemSize);
			string = string.replace('#moduleQuantity', contractObj.ModuleQuantity);
			string = string.replace('#moduleType', contractObj.ModuleType);



			//Input Price Table
			let priceObj = contractObj.priceObj;

			if (priceObj) {
				if (priceObj.name === 'Cash') {
					string = string.replace(
						'#cashPrice',
						`<b>$${priceObj.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</b>`
					);
					string = string.replace(
						'#totalSystemCost',
						`<b>${priceObj.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</b>`
					);
					string = string.replace(
						'#deposit',
						`$${priceObj.deposit.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
					);
					string = string.replace(
						'#uponWork',
						`$${priceObj.uponWork.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
					);
					string = string.replace(
						'#uponInstallation',
						`$${priceObj.uponInstallation.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
					);
					string = string.replace(
						'#balanceDue',
						`$${priceObj.balanceDue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
					);
				} else if (priceObj.name === 'Loan') {
					string = string.replace(
						'#loanPrice',
						`$${priceObj.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
					);
					string = string.replace(
						'#totalSystemCost',
						`${priceObj.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
					);

					if (priceObj.contribution !== '') {
						const priceWithCon = Number(priceObj.contribution) + Number(priceObj.price);

						string = string.replace(
							'#PriceWithCon',
							`$${priceWithCon.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
						);
						string = string.replace(
							/#contribution/g,
							`$${priceObj.contribution.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
						);
						string = string.replace(
							/#contribution/g,
							`$${priceObj.contribution.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
						);
					}
				}
			}

			//Input Cost Adders
			let costAdders = contractObj.costAdders;
			if (costAdders) {
				let costAdderString = ``;
				costAdders.forEach((adder) => {
					if (!adder.hide) {
						let adderType =
							adder.title_of_work !== '' ? adder.title_of_work : adder.variable_name___adder_type_picker;
						if (typeof adderType === 'object') {
							adderType = JSON.stringify(adderType);
							adderType = JSON.parse(adderType);
							adderType = adderType['#text'];

							costAdderString += `( 1 ) ${adderType} <br>`;
						} else {
							costAdderString += `( 1 ) ${adderType} <br>`;
						}
					} else {
						string = string.replace('#costAdders', '');
					}
				});
				string = string.replace('#costAdders', costAdderString);
			}

			let Warranty;
			//Input Warranty
			if (contractObj.Warranty) {
				Warranty = contractObj.Warranty;
			}
			if (Warranty > 0) {
				string = string.replace(/#valueWarranty/g, `${Warranty}`);
			}

			//Input Contract Notes
			let ContractNotes = contractObj.ContractNotes;
			if (ContractNotes) {
				string = string.replace(/#contractNotes/g, `<p><b>Contract Notes:</b><br>${ContractNotes}</p>`);
			} else {
				string = string.replace(/#contractNotes/g, ``);
			}
		}

		return string;
	},

	parseStrings: function(string) {
		if (typeof string === 'object') {
			string = JSON.stringify(string);
			string = JSON.parse(string);
			string = string['#text'];
		}
		if (string.indexOf('&quot;') !== -1) {
			string = string.replace(/&quot;/g, '"');
		}
		if (string.indexOf('&#039;') !== -1) {
			string = string.replace(/&#039;/g, "'");
		}
		return string;
	},

	plusOne: function(value, options) {
		return parseInt(value) + 1;
	},
	HTML: function(str, remove) {
		if (Array.isArray(str)) str = str.join('');
		if (remove && str !== undefined) str = str.replace(remove, '');
		if (str !== undefined)
			return str
				.replace(/\\r/g, '')
				.replace(/\\n10/g, '')
				.replace(/\\n/g, '')
				.replace(/;/g, '')
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.replace(/&quot;/g, '"')
				.replace(/&nbsp;/g, '&nbsp;')
				.replace(/&quot;/g, '&quot;')
				.replace(/&rsquo/g, '&rsquo;')
				.replace(/&ldquo/g, '&ldquo;')
				.replace(/&rdquo/g, '&rdquo;')
				.replace(/&larr/g, '&larr;')
				.replace(/&#39;/g, '&#39;')
				.replace(/&ndash;/g, '&ndash;')
				.replace(/&sect;/g, '&sect;')
				.replace(/&quot;/g, '"')
				.replace(/&#039;/g, "'")
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.replace(/&quot;/g, '"');
	},
	offHTML: function(str, remove) {
		if (Array.isArray(str)) str = str.join('');
		if (remove && str !== undefined) str = str.replace(remove, '');
		if (str !== undefined)
			return str
				.replace(/\\r/g, '')
				.replace(/\\n10/g, '<br>')
				.replace(/\\n/g, '<br>')
				.replace(/;/g, '')
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.replace(/&quot;/g, '"')
				.replace(/&nbsp;/g, '&nbsp;')
				.replace(/&quot;/g, '&quot;')
				.replace(/&rsquo/g, '&rsquo;')
				.replace(/&ldquo/g, '&ldquo;')
				.replace(/&rdquo/g, '&rdquo;')
				.replace(/&larr/g, '&larr;')
				.replace(/&#39;/g, '&#39;')
				.replace(/&ndash;/g, '&ndash;')
				.replace(/&sect;/g, '&sect;')
				.replace(/&quot;/g, '"')
				.replace(/&#039;/g, "'")
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.replace(/&quot;/g, '"');
	},
	formatDate: function(currentDate) {
		const newDate = moment(Number(currentDate)).format('MM-DD-YYYY');
		return newDate;
	},
	formatLi: function(str) {
		if (str) {
			str = str.split(';');
			return str.map((string) => `<li>${string}</li>`).join('');
		}
		return null;
	},
	removeBr: function(str) {
		return str.replace(/<br>/g, "");
	}
};
