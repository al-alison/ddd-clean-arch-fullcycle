
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value_object/address";
import FindCustomerUseCase from "./find.customer.usecase";


const customer = new Customer("c1", "Customer 1");
const address = new Address("Street 1", 22, "Zipcode 1", "City 1");
customer.changeAddress(address);

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn().mockReturnValue(Promise.resolve(customer)),
        update: jest.fn(),
        delete: jest.fn()
    }
}

describe("Find customer usecase unit test", () => {

    it("should not find a customer", async () => {
        const customerRepository = MockRepository();
        customerRepository.findById.mockImplementation(() => {
            throw new Error("Customer not found");
        })
        const useCase = new FindCustomerUseCase(customerRepository);
        const input = {
            id: "c1"
        }
        expect(async () => {
            await useCase.execute(input);
        }).rejects.toThrow("Customer not found");
    })

    it("should find a customer", async () => {

        const customerRepository = MockRepository();
        const useCase = new FindCustomerUseCase(customerRepository);

        const input = {
            id: "c1"
        }

        const output = {
            id: "c1",
            name: "Customer 1",
            address: {
                street: "Street 1",
                number: 22,
                zip: "Zipcode 1",
                city: "City 1"
            }
        }

        const result = await useCase.execute(input);
        expect(output).toEqual(result);
    })
});