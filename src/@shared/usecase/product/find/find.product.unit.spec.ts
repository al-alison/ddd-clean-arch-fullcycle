import ProductFactory from "../../../../domain/product/factory/product.factory";
import FindProductUseCase from "./find.product.usecase";

const product = ProductFactory.create("a", "Product 1", 100);

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn().mockReturnValue(Promise.resolve(product)),
        update: jest.fn(),
        delete: jest.fn()
    }
}

describe("Find product usecase unit test", () => {

    it("should not find a product", async () => {
        const productRepository = MockRepository();
        productRepository.findById.mockImplementation(() => {
            throw new Error("Product not found");
        })
        const useCase = new FindProductUseCase(productRepository);
        const input = {
            id: "c1"
        }
        expect(async () => {
            await useCase.execute(input);
        }).rejects.toThrow("Product not found");
    })

    it("should find a product", async () => {

        const productRepository = MockRepository();
        const useCase = new FindProductUseCase(productRepository);

        const input = {
            id: "c1"
        }

        const output = {
            id: product.id,
            name: "Product 1",
            price: 100
        }

        const result = await useCase.execute(input);
        expect(output).toEqual(result);
    })
});