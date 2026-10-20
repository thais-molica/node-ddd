import EventInterface from "../@shared/event.interface";

export default class CustomerCreatedEvent implements EventInterface {
    dataTimeOccured: Date;
    readonly eventData: Readonly<{ id: string; name: string }>;

    constructor(eventData: { id: string; name: string }) {
        this.dataTimeOccured = new Date();
        this.eventData = Object.freeze({ ...eventData });
    }

}
