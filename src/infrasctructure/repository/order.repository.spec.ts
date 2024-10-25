import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        })
        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel])
        await sequelize.sync();
    });


    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async() => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('cust1', 'customer');
        const address = new Address('street', 1, 'zip', 'city');
        customer.ChangeAddress(address);
        await customerRepository.create(customer);

        const produtRepository = new ProductRepository();
        const product = new Product('prod1', 'name', 10);
        await produtRepository.create(product);

        const orderItem = new OrderItem('item1', product.name, product.price, product.id, 2);
        const order = new Order('order1', customer.id, [orderItem] )
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: {id: order.id},
            include: ['items']
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: 'order1',
            customer_id: 'cust1',
            total: order.total(),
            items: [{
                id: orderItem.id,
                name: orderItem.name,
                price: orderItem.price,
                quantity: orderItem.quantity,
                order_id: 'order1',
                product_id: "prod1",
            }]
        })

    });

    it("should update an existing order order", async() => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('cust1', 'customer');
        const address = new Address('street', 1, 'zip', 'city');
        customer.ChangeAddress(address);
        await customerRepository.create(customer);

        const produtRepository = new ProductRepository();
        const product = new Product('prod1', 'name', 10);
        await produtRepository.create(product);

        const orderItem = new OrderItem('item1', product.name, product.price, product.id, 2);
        const order = new Order('order1', customer.id, [orderItem] )
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: {id: order.id},
            include: ['items']
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: 'order1',
            customer_id: 'cust1',
            total: order.total(),
            items: [{
                id: orderItem.id,
                name: orderItem.name,
                price: orderItem.price,
                quantity: orderItem.quantity,
                order_id: 'order1',
                product_id: "prod1",
            }]
        });

        const product2 = new Product('prod2', 'name2', 100);
        await produtRepository.create(product2);
        const orderItem2 = new OrderItem('item2', product2.name, product2.price, product2.id, 2);
        order.addItem(orderItem2);
        await orderRepository.update(order);

    });

    it("should find an order", async() => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('cust1', 'customer');
        const address = new Address('street', 1, 'zip', 'city');
        customer.ChangeAddress(address);
        await customerRepository.create(customer);

        const produtRepository = new ProductRepository();
        const product = new Product('prod1', 'name', 10);
        await produtRepository.create(product);

        const orderItem = new OrderItem('item1', product.name, product.price, product.id, 2);
        const order = new Order('order1', customer.id, [orderItem] )
        const orderRepository = new OrderRepository();
        
        await orderRepository.create(order);

        const foundOrder = await orderRepository.find('order1');

        expect(foundOrder).toEqual({
            _id: 'order1',
            _customerId: 'cust1',
            _total: order.total(),
            _items: [{
                _id: orderItem.id,
                _name: orderItem.name,
                _price: orderItem.price,
                _quantity: orderItem.quantity,
                _productId: "prod1",
            }]
        })

    });

    it("should find all orders", async() => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('cust1', 'customer');
        const address = new Address('street', 1, 'zip', 'city');
        customer.ChangeAddress(address);
        await customerRepository.create(customer);

        const produtRepository = new ProductRepository();
        const product = new Product('prod1', 'name', 10);
        await produtRepository.create(product);

        const orderItem = new OrderItem('item1', product.name, product.price, product.id, 2);
        const order = new Order('order1', customer.id, [orderItem] )
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const product2 = new Product('prod2', 'name2', 100);
        await produtRepository.create(product2);
        const orderItem2 = new OrderItem('item2', product2.name, product2.price, product2.id, 1);
        const order2 = new Order('order2', customer.id, [orderItem2] );
        await orderRepository.create(order2);

        const foundOrder = await orderRepository.findAll();

        console.log(foundOrder)

        expect(foundOrder).toEqual([ {
            _id: 'order1',
            _customerId: 'cust1',
            _total: order.total(),
            _items: [{
                _id: orderItem.id,
                _name: orderItem.name,
                _price: orderItem.price,
                _quantity: orderItem.quantity,
                _productId: "prod1",
            }]
        },{
            _id: 'order2',
            _customerId: 'cust1',
            _total: order2.total(),
            _items: [{
                _id: orderItem2.id,
                _name: orderItem2.name,
                _price: orderItem2.price,
                _quantity: orderItem2.quantity,
                _productId: "prod2",
            }]
        }])

    });

});