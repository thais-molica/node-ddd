import Address from "../../entity/address";
import EventInterface from "../@shared/event.interface";

export default class CustomerAddressChangedEvent implements EventInterface {
    readonly dataTimeOccured: Date;
    readonly eventData: Readonly<{ id: string; name: string; address: Address }>;

    constructor(eventData: { id: string; name: string; address: Address }) {
        this.dataTimeOccured = new Date();
        this.eventData = Object.freeze({ ...eventData });
    }
}
