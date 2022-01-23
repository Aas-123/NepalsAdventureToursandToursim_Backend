const Category = require('../models/category');

const mongoose = require('mongoose');
const { iteratee } = require('lodash');
const url = 'mongodb://127.0.0.1:27017/traveltestdb';

// use the new name of ~the databaseconsturl= 'mongodb://localhost:27017/new_database_name';
beforeAll(async () => {
	await mongoose.connect(url, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology : true
	});
	try {
		await mongoose.connection.collections['categories'].drop()
	} catch (error) {}
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe('Test category model', () => {
	let category_id;

	it('should insert category', async () => {
		const category = new Category({name : 'International'});
		await category.save();
		expect(category._id).toBeTruthy();
	})

	
	it('should read category', async () => {
		const category = await Category.findOne({name : 'International'});
		category_id = category._id;
		expect(category.name).toBe('International');
	})

	it('should update category', async () => {
		const category = await Category.findByIdAndUpdate(category_id, {
			name : 'Super-International'
		}, {useFindAndModify : false, new : true});
		expect(category.name).toBe('Super-International');
	})

	it('should delete category', async () => {
		const category = await Category.findByIdAndDelete(category_id, {
			useFindAndModify : false
		});
		expect(category.name).toBe('Super-International');
	})
});