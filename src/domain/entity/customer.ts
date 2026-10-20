import EventDispatcherInterface from '../event/@shared/event-dispatcher.interface';
import CustomerCreatedEvent from '../event/customer/customer-created.event';
import CustomerAddressChangedEvent from '../event/customer/customer-address-changed.event';
import createCustomerEventDispatcher from '../event/customer/customer-event-dispatcher';
import Address from './address';

export default class Customer {
    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = true;
    private _rewardPoints = 0;

    constructor(
        id: string,
        name: string,
        private eventDispatcher: EventDispatcherInterface | null = createCustomerEventDispatcher()
    ) {
        this._id = id;
        this._name = name;

        this.validate();

        this.notifyCustomerCreated();
    }

    static restore(id: string, name: string, address: Address, active: boolean, rewardPoints: number): Customer {
        // Loading persisted state is not a new domain operation.
        const customer = new Customer(id, name, null);
        customer._address = address;
        customer._active = active;
        customer._rewardPoints = rewardPoints;
        customer.eventDispatcher = createCustomerEventDispatcher();
        return customer;
    }

    get name() {
        return this._name;
    }

    get id() {
        return this._id;
    }

    get active() {
        return this._active;
    }

    get address(): Address {
        return this._address;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    isActive() {
        return this._active;
    }

    set Address(address: Address) {
        this.changeAddress(address);
    }

    validate() {
        if (!this._id.length) {
            throw new Error('Id is required');
        }
        if (!this._name.length) {
            throw new Error('Name is required');
        }
    }

    changeName(name:string) {
        this._name = name;
        this.validate();
    }

    ChangeAddress(address: Address) {
        this.changeAddress(address);
    }

    changeAddress(address: Address) {
        address.validate();
        if (this._address &&
            this._address.street === address.street &&
            this._address.number === address.number &&
            this._address.zip === address.zip &&
            this._address.city === address.city) {
            return;
        }
        this._address = address;
        this.eventDispatcher?.notify(new CustomerAddressChangedEvent({
            id: this.id,
            name: this.name,
            address: this.address
        }));
    }

    activate() {
        if (!this._address) {
            throw new Error('Address is mandatory to activate a customer');
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    private notifyCustomerCreated() {
        const customerCreatedEvent = new CustomerCreatedEvent({
            name: this.name,
            id: this.id
        })
        this.eventDispatcher?.notify(customerCreatedEvent);
    }


}
