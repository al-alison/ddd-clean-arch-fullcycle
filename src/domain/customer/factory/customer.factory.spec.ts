import Address from "../value_object/address";
import CustomerFactory from "./customer.factory";

describe("Customer factory unit tests", () => {
    it("should create a customer", () => {
        let customer = CustomerFactory.create("John");

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John");
        expect(customer.address).toBeUndefined();
    });

    it("should create a customer with and address", () => {
        const customerAddress = new Address("Rua Tulinha", 123, "03456987", "São Paulo");
        let customer = CustomerFactory.createWithAddress("John", customerAddress);

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John");
        expect(customer.address).toEqual(customerAddress);
    });
});