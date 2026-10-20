import Address from "../../entity/address";
import Customer from "../../entity/customer";
import EventDispatcher from "../@shared/event-dispatcher";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import EnviaConsoleLogHandler from "./handler/envia-console-log.handler";

describe("CustomerAddressChanged", () => {
    let log: jest.SpyInstance;
    const oldAddress = () => new Address("Rua A", 1, "01000-000", "São Paulo");
    const newAddress = () => new Address("Rua B", 20, "02000-000", "Campinas");

    beforeEach(() => {
        log = jest.spyOn(console, "log").mockImplementation(() => {});
    });
    afterEach(() => jest.restoreAllMocks());

    it("publishes id, current name and new address after changing state", () => {
        const dispatcher = new EventDispatcher();
        const handler = new EnviaConsoleLogHandler();
        const handle = jest.spyOn(handler, "handle");
        dispatcher.register(CustomerAddressChangedEvent.name, handler);
        const customer = new Customer("123", "Maria", dispatcher);
        customer.changeAddress(oldAddress());
        customer.changeName("Maria Silva");
        handle.mockClear();
        log.mockClear();
        const address = newAddress();
        const notify = jest.spyOn(dispatcher, "notify");

        customer.changeAddress(address);

        expect(customer.address).toBe(address);
        expect(notify).toHaveBeenCalledTimes(1);
        expect(handle).toHaveBeenCalledTimes(1);
        const event = handle.mock.calls[0][0];
        expect(event).toBeInstanceOf(CustomerAddressChangedEvent);
        expect(event.eventData).toEqual({ id: "123", name: "Maria Silva", address });
        expect(event.eventData.address).toBe(address);
        expect(event.dataTimeOccured).toBeInstanceOf(Date);
        expect(log.mock.calls).toEqual([
            ["Endereço do cliente: 123, Maria Silva alterado para: Rua B, 20, 02000-000, Campinas"]
        ]);
    });

    it.each(["changeAddress", "ChangeAddress", "Address"])("automatically subscribes the handler through %s", method => {
        const customer = new Customer("123", "Maria");
        log.mockClear();
        if (method === "Address") customer.Address = newAddress();
        else if (method === "ChangeAddress") customer.ChangeAddress(newAddress());
        else customer.changeAddress(newAddress());

        expect(log.mock.calls).toEqual([
            ["Endereço do cliente: 123, Maria alterado para: Rua B, 20, 02000-000, Campinas"]
        ]);
    });

    it("does not publish when the address values have not changed", () => {
        const dispatcher = new EventDispatcher();
        const customer = new Customer("123", "Maria", dispatcher);
        customer.changeAddress(oldAddress());
        const notify = jest.spyOn(dispatcher, "notify");

        customer.changeAddress(oldAddress());

        expect(notify).not.toHaveBeenCalled();
    });

    it("rejects invalid addresses without changing state or publishing", () => {
        const dispatcher = new EventDispatcher();
        const customer = new Customer("123", "Maria", dispatcher);
        const original = oldAddress();
        customer.changeAddress(original);
        const notify = jest.spyOn(dispatcher, "notify");

        expect(() => customer.changeAddress(new Address("", 1, "zip", "city"))).toThrow("Street is required");
        expect(customer.address).toBe(original);
        expect(notify).not.toHaveBeenCalled();
    });

    it("keeps previous event data and only publishes address events on updates", () => {
        const dispatcher = new EventDispatcher();
        const customer = new Customer("123", "Maria", dispatcher);
        const notify = jest.spyOn(dispatcher, "notify");
        customer.changeAddress(oldAddress());
        customer.changeAddress(newAddress());

        expect(notify).toHaveBeenCalledTimes(2);
        expect(notify.mock.calls[0][0].eventData.address.toString()).toBe("Rua A, 1, 01000-000, São Paulo");
        expect(notify.mock.calls.every(([event]) => event instanceof CustomerAddressChangedEvent)).toBe(true);
    });

    it("restores persisted state silently and publishes subsequent changes", () => {
        const customer = Customer.restore("123", "Maria", oldAddress(), false, 50);

        expect(log).not.toHaveBeenCalled();
        expect(customer.isActive()).toBe(false);
        expect(customer.rewardPoints).toBe(50);
        expect(customer.address.toString()).toBe("Rua A, 1, 01000-000, São Paulo");

        customer.changeAddress(newAddress());

        expect(log.mock.calls).toEqual([
            ["Endereço do cliente: 123, Maria alterado para: Rua B, 20, 02000-000, Campinas"]
        ]);
    });
});
