import CustomerFactory from "../../../../domain/customer/factory/customer.factory";
import CustomerRepositoryInterface from "../../../../domain/customer/repository/customer.repository.interface";
import Address from "../../../../domain/customer/value_object/address";
import { InputCreateCustomerDto, OutputCreateCustomerDto } from "./create.customer.dto";
import { v4 as uuid } from "uuid";
export default class CreateCustomerUseCase {
    private customerRepository: CustomerRepositoryInterface
    constructor(customerRepository: CustomerRepositoryInterface) {
        this.customerRepository = customerRepository
    }

    async execute(input: InputCreateCustomerDto): Promise<OutputCreateCustomerDto> {
        const customerId = uuid();

        const customer = CustomerFactory.createWithAddress(input.name,
            new Address(
                input.address.street,
                input.address.number,
                input.address.zip,
                input.address.city
            )
        );
        await this.customerRepository.create(customer);
        return {
            id: customerId,
            name: customer.name,
            address: {
                street: customer.address.street,
                number: customer.address.number,
                zip: customer.address.zipCode,
                city: customer.address.city
            }
        }
    }
}