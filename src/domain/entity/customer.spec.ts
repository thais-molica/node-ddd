import Address from "./address";
import Customer from "./customer"

describe("Customer unit tests", () => {

    it("Should throw error when id is empty", () => {
        expect(() => {
            new Customer('', 'Name')
        }).toThrowError('Id is required')
    });

    it("Should throw error when name is empty", () => {
        expect(() => {
            new Customer('123', '')
        }).toThrowError('Name is required')
    });

    it("Should change name", () => {
        const customer = new Customer('id', 'name');
        const newName = 'abc';
        customer.changeName(newName);

        expect(customer.name).toBe(newName)

    });

    it("Should activate customer", () => {
        const customer = new Customer('id', 'name');
        const address = new Address('rua', 1, 'cep', 'cidade');
        customer.Address = address;

        customer.activate();

        expect(customer.isActive()).toBe(true);

    });

    it("Should throw error if address is undefined when activate customer", () => {

        expect(() => {
            const customer = new Customer('id', 'name');
            customer.activate();
        }).toThrowError('Address is mandatory to activate a customer')

    });

    it("Should deactivate customer", () => {
        const customer = new Customer('id', 'name');

        customer.deactivate();

        expect(customer.isActive()).toBe(false);

    });

    it("Should add rewardPoints", () => {
        const customer = new Customer('id', 'name');
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);

    });
})