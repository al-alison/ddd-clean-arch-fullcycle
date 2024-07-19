import { Sequelize } from "sequelize-typescript";
import ProductModel from "../model/product.model";
import Product from "../../../../domain/product/entity/product";
import ProductRepository from "./product.repository";

describe("Product Repository Tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });


    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: "p1" } });

        expect(productModel.toJSON()).toStrictEqual({
            id: "p1",
            name: "Product 1",
            price: 100
        });
    })

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);
        product.changeName("Product 2");
        await productRepository.update(product);

        const productModel = await ProductModel.findOne({ where: { id: "p1" } });
        expect(productModel.toJSON()).toStrictEqual({
            id: "p1",
            name: "Product 2",
            price: 100
        });
    })

    it("should delete product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);
        await productRepository.delete(product);
        const productModel = await ProductModel.findOne({ where: { id: "p1" } });
        expect(productModel).toBeNull();
    })

    it("should find a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: "p1" } });
        const foundProduct = await productRepository.findById(productModel.id);
        expect(productModel.toJSON()).toStrictEqual({
            id: foundProduct.id,
            name: foundProduct.name,
            price: foundProduct.price
        });
    })

    it("should find all products", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);

        const product2 = new Product("p2", "Product 2", 200);
        await productRepository.create(product2);

        const foundProducts = await productRepository.findAll();
        const products = [product, product2];

        expect(products).toEqual(foundProducts);
    });
});