import { Sequelize } from "sequelize-typescript";
import UpdateProductUseCase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/sequelize/model/product.model";
import ProductRepository from "../../../infrastructure/product/sequelize/repository/product.repository";


const product = ProductFactory.create("a", "Product 1", 100) as Product;

const input = {
    id: product.id,
    name: "Product updated",
    price: 1444
};

describe("Unit test for product update use case", ()=> {

    let sequelize: Sequelize;

    beforeEach(async () => {
    
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
    
        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });
    
    afterEach(async () => {
        await sequelize.close();
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        productRepository.create(product);

        const useCase = new UpdateProductUseCase(productRepository);

        const output = await useCase.execute(input);

        expect(output).toEqual(input);
    });
})