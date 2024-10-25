import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {

    it("Should throw error when id is empty", () => {
        expect(() => {
            new Order('', 'customer', [])
        }).toThrowError('Id is required')
    });

    it("Should throw error when CustomerId is empty", () => {
        expect(() => {
            new Order('id', '', [])
        }).toThrowError('CustomerId is required')
    });

    it("Should throw error when items is empty", () => {
        expect(() => {
            new Order('id', 'customer', [])
        }).toThrowError('Items should be greater than 0')
    });

    it("Should calculate total", () => {
        const item = new OrderItem('id', 'name', 4, 'p1', 2);
        const item2 = new OrderItem('id', 'name', 6, 'p2', 2);
        const order = new Order('o1', 'c1', [item]);

        let total = order.total();

        expect(total).toBe(8);

        const order2 = new Order('o2', 'c2', [item, item2]);

        total = order2.total();

        expect(total).toBe(20);
    });

    it("Should throw error if item qtd is less or equal zero", () => {

        expect(() => {
            const item = new OrderItem('id', 'name', 4, 'p1', 0);
            const order = new Order('o1', 'c1', [item]);
        }).toThrowError('Quantity must be grater than 0')
    });

})