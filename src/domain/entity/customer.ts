import Address from './address';

export default class Customer {
    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = true;
    private _rewardPoints = 0;

    constructor(id: string, name:string) {
        this._id = id;
        this._name = name;

        this.validate();
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
        this._address = address;
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
        this._address = address;
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


}