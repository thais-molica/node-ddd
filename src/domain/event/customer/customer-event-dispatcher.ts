import EventDispatcher from "../@shared/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2.handler";
import EnviaConsoleLogHandler from "./handler/envia-console-log.handler";

export default function createCustomerEventDispatcher(): EventDispatcher {
    const dispatcher = new EventDispatcher();
    dispatcher.register(CustomerCreatedEvent.name, new EnviaConsoleLog1Handler());
    dispatcher.register(CustomerCreatedEvent.name, new EnviaConsoleLog2Handler());
    dispatcher.register(CustomerAddressChangedEvent.name, new EnviaConsoleLogHandler());
    return dispatcher;
}
