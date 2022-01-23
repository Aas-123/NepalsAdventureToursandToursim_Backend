const {Order} = require('../models/order');
const Product = require('../models/product');
const Category = require('../models/category');

const mongoose = require('mongoose');
const category = require('../models/category');
const url = 'mongodb://127.0.0.1:27017/traveltestdb';

// use the new name of ~the databaseconsturl= 'mongodb://localhost:27017/new_database_name';
beforeAll(async () => {
	await mongoose.connect(url, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology : true
	});
	try {
        await mongoose.connection.collections['orders'].drop()
	    await mongoose.connection.collections['products'].drop()
	    await mongoose.connection.collections['categories'].drop()
    } catch (error) {}
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe('Test order model', () => {
	let order_id, product_id;

    it('should create product', async () => {
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
    })

	it('should insert order', async () => {
		const order = new Order({products : [product_id]});
		await order.save();
        order_id = order._id;
		expect(order._id).toBeTruthy();
	})

	
	it('should read order', async () => {
		const order = await Order.findById(order_id);
		expect(order._id).toStrictEqual(order_id);
	})

	it('should update order', async () => {
		const order = await Order.findByIdAndUpdate(order_id, {
			products : [product_id]
		}, {useFindAndModify : false, new : true});
		expect(order.products).toHaveLength(1);
	})

	it('should delete order', async () => {
		const order = await Order.findByIdAndDelete(order_id, {useFindAndModify : false});
		expect(order._id).toStrictEqual(order_id);
	})
});