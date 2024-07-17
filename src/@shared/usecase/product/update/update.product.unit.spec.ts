import ProductFactory from "../../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

const product = ProductFactory.create("a", "Product 1", 100);

const input = {
    id: product.id,
    name: "Product Updated",
    price: 10000
};

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn().mockReturnValue(Promise.resolve(product)),
        update: jest.fn(),
        delete: jest.fn()
    }
}

describe("Unit test for product update use case", ()=> {

    it("should update a product", async () => {
        const productRepository = MockRepository();
        const useCase = new UpdateProductUseCase(productRepository);

        const output = await useCase.execute(input);

        expect(output).toEqual(input)
    });
})