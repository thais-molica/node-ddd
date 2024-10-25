import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";

describe("Customer repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        })
        sequelize.addModels([CustomerModel])
        await sequelize.sync();
    });


    afterEach(async () => {
        await sequelize.close()
    });

    it("shoould create a customer", async() => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Customer 1');
        const address = new Address('Street 1', 1, 'zip 1', 'city 1');
        customer.Address = address;
        
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({where: {id: '1'}})

        expect(customerModel.toJSON()).toStrictEqual({
            id: '1',
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
        })
    });

    it('should update a customer', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Customer 1');
        const address = new Address('Street 1', 1, 'zip 1', 'city 1');
        customer.Address = address;

        await customerRepository.create(customer);

        customer.changeName('Customer 2');

        await customerRepository.update(customer);
        
        const customerModel = await CustomerModel.findOne({where: {id: '1'}})

        expect(customerModel.toJSON()).toStrictEqual({
            id: '1',
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
        })
    });

    it('should find a customer', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Customer 1');
        const address = new Address('Street 1', 1, 'zip 1', 'city 1');
        customer.Address = address;

        await customerRepository.create(customer);
        
        const customerResult = await customerRepository.find('1')

        expect(customer).toStrictEqual(customerResult);
    });

    it('Should throw an error when customer is not found', async () => {
        const customerRepository = new CustomerRepository();

        expect(async () => {
            await customerRepository.find('aaa')
        }).rejects.toThrow('Customer not found')
    })

    it('should find all customers', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Customer 1');
        const address = new Address('Street 1', 1, 'zip 1', 'city 1');
        customer.Address = address;

        await customerRepository.create(customer);

        const customer2 = new Customer('2', 'Customer 2');
        const address2 = new Address('Street 2', 2, 'zip 2', 'city 2');
        customer2.Address = address2;

        await customerRepository.create(customer2);
        
        const foundCustomer = await customerRepository.findAll();
        const customers = [customer, customer2]

        expect(customers).toEqual(foundCustomer);

    });

});