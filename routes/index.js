
/*
 * GET home page.
 */

var menuSchema = require('../schemas/menu');

module.exports = function (menu) {
	var combo = require('../combo');

	for(var number in menu) {
		menu[number] = combo(menu[number]);
	}

	var functions = {};

	functions.combo = function(req, res){
		var number = req.param('number');

		req.session.lastNumber = number;

		if (typeof menu[number] === 'undefined') {
			res.status(404).json({status: 'error'});
		} else {
			res.json(menu[number].getInformation());
		}
	};

	functions.list = function(req, res) {
		menuSchema.find()
		.setOptions({sort: 'ID'})
		.exec(function(err, arrivals) {
			if (err) {
				res.status(500).json({status: 'failure'});
			} else {
				res.render('list', {
					title: 'Menu',
					menu: arrivals,
					lastNumber: req.session.lastNumber
				});
			}
		});
	};
	
	functions.addComboView = function(req, res) {
		res.render('addCombo', {title: 'add'});
	};

	functions.addCombo = function(req, res) {
		var temp = combo(
			{'comboID':req.body.comboID,
			'mainCourse':req.body.mainCourse,
			'drinks':req.body.drinks}
			).getInformation();
		req.session.lastNumber = req.body.comboID;
		var record = new menuSchema(temp);

			record.save(function(err) {
				if (err) {
					console.log(err);
					res.status(500).json({status: 'failure'});
				} else {
					res.json({status: 'success'});
				}
			});
			res.redirect('/menu');
			res.json({status: 'done'});

	};	

	functions.login = function(req, res) {
		res.render('login', {title: 'Log in'});
	};

	functions.user = function(req, res) {
		if (req.session.passport.user === undefined) {
			res.redirect('/login');
		} else {
			res.render('user', {title: 'Welcome!',
				user: req.user
			})
		}
	};

	return functions;
};