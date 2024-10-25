import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
            }))
        }, {
            include: [{model: OrderItemModel}]
        })
    }

    async update(entity: Order): Promise<void> {        
        await OrderModel.update({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
            }))
        }, {
            where: {
                id: entity.id
            }
        })
    }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({where: {id}, include: ['items']});
        const items: OrderItem[] = [];
        orderModel.items.forEach( element => {
            items.push(new OrderItem(element.id, element.name, element.price, element.product_id, element.quantity));
        });
        
        return new Order(orderModel.id, orderModel.customer_id, items);
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({include: ['items']});

        return orderModels.map((orderModel) => {
            const items: OrderItem[] = [];
            orderModel.items.forEach( element => {
                items.push(new OrderItem(element.id, element.name, element.price, element.product_id, element.quantity));
            });
            return new Order(orderModel.id, orderModel.customer_id, items)
        })
    }

    
}