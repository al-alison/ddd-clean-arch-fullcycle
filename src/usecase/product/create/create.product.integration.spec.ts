import { Sequelize } from "sequelize-typescript";
import CreateProductUseCase from "./create.product.usecase";
import ProductModel from "../../../infrasctructure/product/sequelize/model/product.model";
import ProductRepository from "../../../infrasctructure/product/sequelize/repository/product.repository";


const input = {
    name: "Product 1",
    price: 10
}

describe("Create product usecase integration test", () => {

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


    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUseCase(productRepository);

        const output = await useCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        })
    });

    it("should throw an error when price is invalid", async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUseCase(productRepository);

        input.price = -1;

        await expect(useCase.execute(input)).rejects.toThrow("Price must be greater than zero");
    })

    it("should throw an error when name is missing", async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUseCase(productRepository);

        input.name = "";

        await expect(useCase.execute(input)).rejects.toThrow("Name is required");
    })
});
