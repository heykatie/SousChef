'use strict';

let options = {};
options.tableName = 'Users';
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			options,
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				firstName: {
					type: Sequelize.STRING(50),
					allowNull: true,
				},
				lastName: {
					type: Sequelize.STRING(50),
					allowNull: true,
				},
				phone: {
					type: Sequelize.STRING(20),
					allowNull: true,
				},
				birthday: {
					type: Sequelize.DATEONLY,
					allowNull: true,
				},
				username: {
					type: Sequelize.STRING(30),
					allowNull: false,
					unique: true,
				},
				email: {
					type: Sequelize.STRING(256),
					allowNull: false,
					unique: true,
				},
				hashedPassword: {
					type: Sequelize.STRING(72),
					allowNull: true,
				},
				avatarUrl: {
					type: Sequelize.TEXT,
					allowNull: true,
					defaultValue:
						process.env.DEFAULT_AVATAR_URL ||
						'https://souschef-prj.s3.us-west-1.amazonaws.com/default-avatar.png',
				},
				bio: {
					type: Sequelize.TEXT,
					allowNull: true,
				},
				theme: {
					type: Sequelize.ENUM('dark', 'light', 'system'),
					allowNull: false,
					defaultValue: 'dark',
				},
				googleId: {
					type: Sequelize.STRING,
					unique: true,
				},
				discordId: {
					type: Sequelize.STRING,
					unique: true,
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				},
			},
			options
		);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable(options);
	},
};
