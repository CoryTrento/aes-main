const fs = require('fs');
const path = require('path');
const os = require('os');
const moment = require('moment');
moment().format();

const formatIntervals = (intervals, meter) => {
	const output = [ [ 'Related Meter', 'Interval Start', 'Interval End', 'Electricity (kWh)' ] ];
	intervals.forEach((interval) => {
		interval.forEach((read) => {
			let start = Number(read.ns0_timePeriod.ns0_start.value);
			let end = start + Number(read.ns0_timePeriod.ns0_duration.value);
			const value = Number(read.ns0_value.value);

			const interval_start = moment.unix(start).utc().format('DD MMM - HH:mm');
			const interval_end = moment.unix(end).utc().subtract({ minutes: 1 }).format('DD MMM - HH:mm');

			const row = [];
			row.push();
			row.push(meter);
			row.push(interval_start);
			row.push(interval_end);
			row.push(value / 1000000);
			output.push(row);
		});
	});
	return output.map((row) => row.join(',')).join('\n');
};
const formatIntervals2 = (intervals, meter) => {
	const output = [ [ 'Related Meter', 'Interval Start', 'Interval End', 'Electricity (kWh)' ] ];
	intervals.forEach((read) => {
		let start = Number(read.ns0_timePeriod.ns0_start.value);
		let end = start + Number(read.ns0_timePeriod.ns0_duration.value);
		const value = Number(read.ns0_value.value);

		const interval_start = moment.unix(start).utc().format('DD MMM - HH:mm');
		const interval_end = moment.unix(end).utc().subtract({ minutes: 1 }).format('DD MMM - HH:mm');

		const row = [];
		row.push();
		row.push(meter);
		row.push(interval_start);
		row.push(interval_end);
		row.push(value / 1000000);
		output.push(row);
	});
	return output.map((row) => row.join(',')).join('\n');
};

module.exports = {
	formatIntervals,
	formatIntervals2
};
