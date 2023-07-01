const express = require('express');
const router = express.Router();
const axios = require('axios');
const { QB_EDIT } = require('../../helpers/qb_crud');
const google_key = require('../../config/quickbase').GOOGLE;

router.get('/', async (req, res) => {
	// Query
	const origin = req.query.origin_addresses;
	const destination = req.query.destination_addresses;
	const rec_id = req.query.rec_id;
	const table = 'bpgi8qd7p';

	// Request
	const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${google_key}`;
	const request = await axios.get(url);
	const data = request.data;

	// Sorted Data
	const distance = data.rows[0].elements[0].distance.value * 0.001;
	const duration = data.rows[0].elements[0].duration.value / 60;

	QB_EDIT(table, rec_id, {
		_fid_62: duration.toFixed(2),
		_fid_63: distance
	});

	console.log('Distance', distance, duration);

	// Response
	res.send(`<h1>Distance: ${distance}km</h1>
			  <h1>Duration: ${duration.toFixed(2)}</h1>
			  <h4>Posted</h4>`);
});

module.exports = router;
