import Address from "../../../domain/entity/customer/address";
import Customer from "../../../domain/entity/customer/customer";
import CustomerRepositoryInterface from "../../../domain/repository/customer.repository.interface";
import CustomerModel from "../../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {

    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            city: entity.address.city,
            zipCode: entity.address.zipCode,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints
        });
    }
    async update(entity: Customer): Promise<void> {
        await CustomerModel.update(
            {
                name: entity.name,
                street: entity.address.street,
                number: entity.address.number,
                city: entity.address.city,
                zipCode: entity.address.zipCode,
                active: entity.isActive(),
                rewardPoints: entity.rewardPoints
            },
            {
                where: { id: entity.id }
            });
    }
    async delete(entity: Customer): Promise<void> {
        await CustomerModel.destroy({
            where: { id: entity.id }
        })
    }
    async findById(id: string): Promise<Customer> {
        let customerModel;
        try {
            customerModel = await CustomerModel.findOne({ where: { id }, rejectOnEmpty: true });
        }
        catch (error) {
            throw new Error("Customer not found");
        }
        let customer = new Customer(customerModel.id, customerModel.name);
        customer.changeAddress(new Address(customerModel.street, customerModel.number, customerModel.zipCode, customerModel.city));
        return customer;
    }
    async findAll(): Promise<Customer[]> {
        let customerModels = await CustomerModel.findAll();
        let customers = customerModels.map(customerModel => {
            let customer = new Customer(customerModel.id, customerModel.name);
            customer.changeAddress(new Address(customerModel.street, customerModel.number, customerModel.zipCode, customerModel.city));
            customer.addRewardPoints(customerModel.rewardPoints)
            customerModel.active? customer.activate() : customer.deactivate();
            return customer;
        });
        return customers;
    }
}