import CustomerFactory from "../../../../domain/customer/factory/customer.factory";
import Address from "../../../../domain/customer/value_object/address";
import ListCustomerUseCase from "./list.customer.usecase";

const customer1 = CustomerFactory.createWithAddress("Customer C1", new Address("Street 1", 1, "Zipcode 1", "City 1"));
const customer2 = CustomerFactory.createWithAddress("Customer C2", new Address("Street 2", 2, "Zipcode 2", "City 2"));

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }
}

describe("Unit test for customer list use case", ()=> {

    it("should list all customers", async () => {
        const customerRepository = MockRepository();
        const useCase = new ListCustomerUseCase(customerRepository);
        const output = await useCase.execute({});
        expect(output.customers).toHaveLength(2);

        expect(output.customers[0].id).toBe(customer1.id);
        expect(output.customers[1].id).toBe(customer2.id);

        expect(output.customers[0].name).toBe(customer1.name);
        expect(output.customers[1].name).toBe(customer2.name);

        expect(output.customers[0].address.street).toBe(customer1.address.street);
        expect(output.customers[1].address.street).toBe(customer2.address.street);
    })
})