import Customer from "../../../../domain/customer/entity/customer";
import CustomerFactory from "../../../../domain/customer/factory/customer.factory";
import CustomerRepositoryInterface from "../../../../domain/customer/repository/customer.repository.interface";
import Address from "../../../../domain/customer/value_object/address";
import { InputUpdateCustomerDto, OutputUpdateCustomerDto } from "./update.customer.dto";

export default class UpdateCustomerUseCase {

    private customerRepository: CustomerRepositoryInterface;

    constructor(customerRepository: CustomerRepositoryInterface) {
        this.customerRepository = customerRepository;
    }

    async execute(input: InputUpdateCustomerDto): Promise<OutputUpdateCustomerDto> {
        const customer = await this.customerRepository.findById(input.id);
        customer.changeName(input.name);
        customer.changeAddress(new Address(input.address.street, input.address.number, input.address.zip, input.address.city))
        
        this.customerRepository.update(customer);
        
        return {
            id: customer.id,
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