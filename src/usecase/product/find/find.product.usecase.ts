import ProductRepository from "../../../infrastructure/product/sequelize/repository/product.repository";
import { InputFindProductDto, OutputFindProductDto } from "./find.product.dto";

export default class FindProductUseCase{
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(input: InputFindProductDto): Promise<OutputFindProductDto> {
        const product = await this.productRepository.findById(input.id);
        return {
            id: product.id,
            name: product.name,
            price: product.price
        }
    }
}