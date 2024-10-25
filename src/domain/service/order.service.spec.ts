import Customer from "../entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe('Order service unit tests', () => {

    it('should place an order', () => {
        const customer = new Customer('id', 'name');
        const item1 = new OrderItem('id', 'name', 10, 'id', 1);

        const order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10)

    });

    it('should total of all orders', () => {
        const orderItem1 = new OrderItem('id1', 'name', 100, 'id', 1);
        const orderItem2 = new OrderItem('id2', 'name', 200, 'id', 2);

        const order = new Order('id', 'id', [orderItem1]);
        const order2 = new Order('id', 'id', [orderItem2]);

        const total = OrderService.total([order, order2]);

        expect(total).toBe(500)
    });
});