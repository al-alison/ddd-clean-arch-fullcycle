import CustomerFactory from "../../../../domain/customer/factory/customer.factory";
import Address from "../../../../domain/customer/value_object/address";
import UpdateCustomerUseCase from "./update.customer.usecase";

const customer = CustomerFactory.createWithAddress("Customer C1", new Address("Street 1", 1, "Zipcode 1", "City 1"));

const input = {
    id: customer.id,
    name: "Customer C1 Updated",
    address: {
        street: "Street 1 Updated",
        number: 1232,
        zip: "Zipcode 1 Updated",
        city: "City 1 Updated"
    }
};

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn().mockReturnValue(Promise.resolve(customer)),
        update: jest.fn(),
        delete: jest.fn()
    }
}

describe("Unit test for customer update use case", ()=> {

    it("should update a customer", async () => {
        const customerRepository = MockRepository();
        const useCase = new UpdateCustomerUseCase(customerRepository);

        const output = await useCase.execute(input);

        expect(output).toEqual(input);
    });
})