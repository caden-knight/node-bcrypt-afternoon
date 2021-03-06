const bcrypt = require('bcryptjs');

module.exports = {
	register: async (req, res) => {
		const { username, password, isAdmin } = req.body;

        //link to the database
		const db = req.app.get('db');

		//check to see if the username already exists
		const result = await db.get_user([username]);
		const existingUser = result[0];

		if (existingUser) {
			return status(409).send('Username taken');
		}

		//registering the user
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);
		const registeredUser = await db.register_user(isAdmin, username, hash);
		const user = registeredUser[0];
		req.session.user = {
			isAdmin: user.is_admin,
			id: user.id,
			user: user.username
		};
		return res.status(201).send(req.session.user);
	},
	login: (req, res) => {
		const { username, passwords } = req.body
		const db = req.app.get('db')

		const foundUser = await db.get_user([username])
		const user = foundUser[0]

		if(!user) {
			return status(401).send('User not found. Please register as a new user before logging in')
		}

		const isAuthenticated = bcrypt.compareSync(password, user.hash)
	}
};
