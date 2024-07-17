import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../../domain/product/factory/product.factory";
import ListProductUseCase from "./list.product.usecase";
import ProductModel from "../../../../infrasctructure/product/sequelize/model/product.model";
import ProductRepository from "../../../../infrasctructure/product/sequelize/repository/product.repository";
import Product from "../../../../domain/product/entity/product";

const product1 = ProductFactory.create("a", "Product 1", 100) as Product;
const product2 = ProductFactory.create("b", "Product 2", 200) as Product;


describe("Integration test for products list use case", ()=> {

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


    it("should list all products", async () => {
        const productRepository = new ProductRepository();

        productRepository.create(product1);
        productRepository.create(product2);

        const useCase = new ListProductUseCase(productRepository);
        const output = await useCase.execute({});
        expect(output.products).toHaveLength(2);

        expect(output.products[0].id).toBe(product1.id);
        expect(output.products[1].id).toBe(product2.id);

        expect(output.products[0].name).toBe(product1.name);
        expect(output.products[1].name).toBe(product2.name);

        expect(output.products[0].price).toBe(product1.price);
        expect(output.products[1].price).toBe(product2.price);
    })
})