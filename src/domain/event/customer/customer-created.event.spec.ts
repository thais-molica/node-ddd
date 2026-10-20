import Customer from "../../entity/customer";
import EventDispatcher from "../@shared/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2.handler";

describe("CustomerCreated", () => {
    let log: jest.SpyInstance;

    beforeEach(() => {
        log = jest.spyOn(console, "log").mockImplementation(() => {});
    });
    afterEach(() => jest.restoreAllMocks());

    it("publishes creation data and executes both subscribers once", () => {
        const dispatcher = new EventDispatcher();
        const first = new EnviaConsoleLog1Handler();
        const second = new EnviaConsoleLog2Handler();
        const firstHandle = jest.spyOn(first, "handle");
        const secondHandle = jest.spyOn(second, "handle");
        dispatcher.register(CustomerCreatedEvent.name, first);
        dispatcher.register(CustomerCreatedEvent.name, second);

        new Customer("123", "Maria", dispatcher);

        expect(firstHandle).toHaveBeenCalledTimes(1);
        expect(secondHandle).toHaveBeenCalledTimes(1);
        const event = firstHandle.mock.calls[0][0];
        expect(event).toBeInstanceOf(CustomerCreatedEvent);
        expect(event.eventData).toEqual({ id: "123", name: "Maria" });
        expect(event.dataTimeOccured).toBeInstanceOf(Date);
        expect(secondHandle).toHaveBeenCalledWith(event);
        expect(log.mock.calls).toEqual([
            ["Esse é o primeiro console.log do evento: CustomerCreated"],
            ["Esse é o segundo console.log do evento: CustomerCreated"]
        ]);
    });

    it("automatically subscribes both handlers for every new customer", () => {
        new Customer("1", "Maria");
        new Customer("2", "João");

        expect(log.mock.calls).toEqual([
            ["Esse é o primeiro console.log do evento: CustomerCreated"],
            ["Esse é o segundo console.log do evento: CustomerCreated"],
            ["Esse é o primeiro console.log do evento: CustomerCreated"],
            ["Esse é o segundo console.log do evento: CustomerCreated"]
        ]);
    });

    it.each([["", "Maria"], ["123", ""]])("does not publish invalid customers (%s, %s)", (id, name) => {
        const dispatcher = new EventDispatcher();
        const notify = jest.spyOn(dispatcher, "notify");
        expect(() => new Customer(id, name, dispatcher)).toThrow();
        expect(notify).not.toHaveBeenCalled();
        expect(log).not.toHaveBeenCalled();
    });

    it.each([1, 2])("keeps subscribers independent when handler %s is removed", removed => {
        const dispatcher = new EventDispatcher();
        const first = new EnviaConsoleLog1Handler();
        const second = new EnviaConsoleLog2Handler();
        const firstHandle = jest.spyOn(first, "handle");
        const secondHandle = jest.spyOn(second, "handle");
        dispatcher.register(CustomerCreatedEvent.name, first);
        dispatcher.register(CustomerCreatedEvent.name, second);
        dispatcher.unregister(CustomerCreatedEvent.name, removed === 1 ? first : second);

        new Customer("123", "Maria", dispatcher);

        expect(firstHandle).toHaveBeenCalledTimes(removed === 1 ? 0 : 1);
        expect(secondHandle).toHaveBeenCalledTimes(removed === 2 ? 0 : 1);
        expect(log).toHaveBeenCalledTimes(1);
    });
});
