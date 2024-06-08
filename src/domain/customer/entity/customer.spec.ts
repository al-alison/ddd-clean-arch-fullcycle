import Address from "../value_object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "John");
        }).toThrow("Id is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("123", "");
        }).toThrow("Name is required");
    });

    it("should change name", () => {
        const customer = new Customer("123", "John");
        customer.changeName("Jane");
        expect(customer.name).toBe("Jane");
    });

    it("should activate customer", () => {
        const customer = new Customer("123", "John");
        const address = new Address("Street", 123, "Zip", "City");
        customer.changeAddress(address);

        customer.activate();
        expect(customer.isActive()).toBe(true);
    });

    it("should deactivate customer", () => {
        const customer = new Customer("123", "John");

        customer.deactivate();
        expect(customer.isActive()).toBe(false);
    });

    it("should throw error when address is undefined when you activate a customer", () => {

        expect(() => {
            const customer = new Customer("123", "John");
            customer.activate();
        }).toThrow("Address is mandatory to activate a customer");

    });

});