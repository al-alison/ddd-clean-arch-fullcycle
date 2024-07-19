import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../model/customer.model";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value_object/address";
import CustomerRepository from "./customer.repository";

describe("Customer Repository Tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });


    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "c1" } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: customer.address.street,
            number: customer.address.number,
            zipCode: customer.address.zipCode,
            city: customer.address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints
        });
    })

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        await customerRepository.create(customer);
        customer.changeName("Customer 2");
        customer.changeAddress(new Address("Street 2", 2, "Zipcode 2", "City 2"));
        await customerRepository.update(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "c1" } });
        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: customer.address.street,
            city: customer.address.city,
            number: customer.address.number,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            zipCode: customer.address.zipCode
        });
    })

    it("should delete customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        await customerRepository.create(customer);
        await customerRepository.delete(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "c1" } });
        expect(customerModel).toBeNull();
    })

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("p1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "p1" } });
        const foundCustomer = await customerRepository.findById(customerModel.id);

        expect(customerModel.toJSON()).toStrictEqual({
            id: foundCustomer.id,
            name: foundCustomer.name,
            street: customer.address.street,
            city: customer.address.city,
            number: customer.address.number,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            zipCode: customer.address.zipCode
        });
    })

    it("should throw error when customer is not found", async () => {
        const customerRepository = new CustomerRepository();
        expect(async () => {
            await customerRepository.findById("randomId");
        }).rejects.toThrow("Customer not found");
    })

    it("should find all customers", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        await customerRepository.create(customer);

        const customer2 = new Customer("c2", "Customer 2");
        customer2.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        await customerRepository.create(customer2);

        const foundCustomers = await customerRepository.findAll();
        const customers = [customer, customer2];

        expect(customers).toHaveLength(2);
        expect(customers).toContainEqual(customer);
        expect(customers).toContainEqual(customer2);

    });


});