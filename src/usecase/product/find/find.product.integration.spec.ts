import { Sequelize } from "sequelize-typescript";
import FindProductUseCase from "./find.product.usecase";
import ProductModel from "../../../infrasctructure/product/sequelize/model/product.model";
import ProductRepository from "../../../infrasctructure/product/sequelize/repository/product.repository";
import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";

describe("Find product usecase integration test", () => {
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

        it("should find a product", async () => {

            const productRepository = new ProductRepository();
            const useCase = new FindProductUseCase(productRepository);

            const product = ProductFactory.create("a", "Product 1", 100) as Product;

            await productRepository.create(product);

            const input = {
                id: product.id
            }

            const output = {
                id: product.id,
                name: product.name,
                price: product.price
            }

            const result = await useCase.execute(input);
            expect(output).toEqual(result);
        })
});