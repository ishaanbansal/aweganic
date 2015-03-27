
/*
 * GET home page.
 */

/*
	req.session.passport.admin --> aweganic admins
	req.session.passport.user --> company admins
	req.session.passport.customer --> individual customers
*/

var menuSchema = require('../schemas/menu');
var feedbackSchema = require('../schemas/feedback');

module.exports = function (menu) {
	var combo = require('../combo');

	for(var number in menu) {
		menu[number] = combo(menu[number]);
	}

	var functions = {};
	//GET 
	functions.combo = function(req, res){
		var number = req.param('number');

		req.session.lastNumber = number;

		if (typeof menu[number] === 'undefined') {
			res.status(404).json({status: 'error'});
		} else {
			res.json(menu[number].getInformation());
		}
	};

	functions.menu = function(req, res) {
		if (req.session.passport.user === undefined) {
			res.redirect('/login');
		} else {
			menuSchema.find()
			.setOptions({sort: 'comboID'})
			.exec(function(err, combos) {
				if (err) {
					res.status(500).json({status: 'failure'});
				} else {
					res.render('menu', {
						title: 'Welcome!',
						user: req.user,
						menu: combos,
						lastNumber: req.session.lastNumber
					});
				}
			});
		}
	};
	
	functions.addComboView = function(req, res) {
		//add condition to check for admins login
		
		if (req.session.passport.user === undefined) {
			res.redirect('/login');
		} else {
			res.render('addCombo', {title: 'add'});
		}
	};

	functions.addCombo = function(req, res) {
		//add condition to check for admins login
		
		if (req.session.passport.user === undefined) {
			res.redirect('/login');
		} else {
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
			res.redirect('/');
		}
	};	

	functions.deleteCombo = function(req, res) { 
		menuSchema.remove({"comboID":req.params.id}, function(err, result) { 
		    res.send( (result === 1) ? { msg: 'Deleted' } : { msg: 'error: '+ err } );
		});
		res.redirect('/');
	}

	functions.listFeedback = function(req, res) {
		if (req.session.passport.user === undefined) {
			res.redirect('/login');
		} else {
			feedbackSchema.find()
			.setOptions({sort: 'rating'})
			.exec(function(err, feeds) {
				if (err) {
					res.status(500).json({status: 'failure'});
				} else {
					res.render('feedbacks', {
						title: 'FeedBacks',
						user: req.user,
						feeds: feeds
					});
				}
			});
		}
	}

	functions.login = function(req, res) {
		if (req.session.passport.user === undefined) {
			res.render('login', {title: 'Log in'});
		} else {
			res.redirect('/');
		}
	};

	return functions;
};
