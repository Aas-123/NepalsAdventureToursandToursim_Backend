const Product = require('../models/product');
const Category = require('../models/category');

const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/traveltestdb';

// use the new name of ~the databaseconsturl= 'mongodb://localhost:27017/new_database_name';
beforeAll(async () => {
	await mongoose.connect(url, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology : true
	});
	try {
        await mongoose.connection.collections['products'].drop()
        await mongoose.connection.collections['categories'].drop()
    } catch (error) {}
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe('Test product model', () => {
	let product_id;

	it('should insert product', async () => {
        const category = new Category({name : 'Shoes'});
        await category.save()
		const product = new Product({
            name : 'Shoes', subname : 'sn',
            youtubelink : 'https://',
            description : 'nice shoes',
            price : 1500,
            category : category._id,
        });
        await product.save();
        product_id = product._id;
		expect(product._id).toBeTruthy();
	})

	
	it('should read product', async () => {
		const product = await Product.findOne({name : 'Shoes'});
		product_id = product._id;
		expect(product.name).toBe('Shoes');
	})

	it('should update product', async () => {
		const product = await Product.findByIdAndUpdate(product_id, {
			name : 'Chappal'
		}, {useFindAndModify : false, new : true});
		expect(product.name).toBe('Chappal');
	})

	it('should delete product', async () => {
		const product = await Product.findByIdAndDelete(product_id, {
			useFindAndModify : false
		});
		expect(product.name).toBe('Chappal');
	})
});