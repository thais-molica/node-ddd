import OrderItem from "./order_item";

export default class Order {
    private _id: string;
    private _customerId: string;
    private _items: OrderItem[] = [];
    private _total: number;

    constructor(id: string, customerId: string, items: OrderItem[]) {
        this._id = id;
        this._customerId = customerId;
        this._items = items;
        this._total = this.total();

        this.validate();

    }

    get id() {
        return this._id;
    }

    get items() {
        return this._items;
    }

    get customerId() {
        return this._customerId;
    }

    validate() {
        if (!this._id.length) {
            throw new Error('Id is required');
        }
        if (!this._customerId.length) {
            throw new Error('CustomerId is required');
        }
        if (!this._items.length) {
            throw new Error('Items should be greater than 0');
        }
        if (this._items.some(item => item.quantity <= 0)) {
            throw new Error('Quantity must be grater than 0');
        }
    }

    total(): number {
        return this._items.reduce((acc,item) => acc + item.orderItemTotal(), 0);
    } 

    addItem(item: OrderItem) {
        this._items.push(item);
        this.validate();
    }
}