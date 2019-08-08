const Sequelize   = require('sequelize');
const User 				= require('../models/user');

class IndexModel {
	 constructor() {
		this.sequelize = new Sequelize('task', 'test', '', {
			host: 'localhost',
			dialect: 'postgres',
			force: true,
			logging: false
		});
		this._dbInit(this.sequelize).then(() => {
			console.log('Connection has been established successfully.');
		});
	}

	async findUser(firstName) {
		return await User.findOne({ where: { firstName: firstName }});
	}

	async _dbInit(sequelize) {
		await sequelize.authenticate();

		// Init User Model
		User.init({
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			firstName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			lastName: {
				type: Sequelize.STRING
			},
			image: {
				type: Sequelize.BLOB('long')
			},
			pdf: {
				type: Sequelize.BLOB('long')
			}
		}, { sequelize, modelName: 'user' });
		await User.sync();
	}
}

module.exports = new IndexModel();