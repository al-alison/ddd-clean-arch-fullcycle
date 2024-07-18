import { Sequelize } from "sequelize-typescript";
import FindCustomerUseCase from "./find.customer.usecase";
import CustomerModel from "../../../infrasctructure/customer/sequelize/model/customer.model";
import CustomerRepository from "../../../infrasctructure/customer/sequelize/repository/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value_object/address";

describe("Find customer usecase integration test", () => {
    let sequelize: Sequelize;

        beforeEach(async () => {

            sequelize = new Sequelize({
                dialect: "sqlite",
                storage: ":memory:",
                logging: false,
                sync: { force: true },
            });
    
            await sequelize.addModels([CustomerModel]);
            await sequelize.sync();
        });
        
        afterEach(async () => {
            await sequelize.close();
        });

        it("should find a customer", async () => {

            const customerRepository = new CustomerRepository();
            const useCase = new FindCustomerUseCase(customerRepository);

            const customer = new Customer("c1", "Customer 1");
            const address = new Address("Street 1", 22, "Zipcode 1", "City 1");
            customer.changeAddress(address);

            await customerRepository.create(customer);

            const input = {
                id: "c1"
            }

            const output = {
                id: customer.id,
                name: customer.name,
                address: {
                    street: customer.address.street,
                    number: customer.address.number,
                    zip: customer.address.zipCode,
                    city: customer.address.city
                }
            }

            const result = await useCase.execute(input);
            expect(output).toEqual(result);
        })
});