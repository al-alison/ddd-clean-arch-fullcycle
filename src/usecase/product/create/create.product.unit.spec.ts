import CreateProductUseCase from "./create.product.usecase";

const input = {
    name: "Product 1",
    price: 10
}

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }
}

describe("Create product usecase unit test", () => {
    it("should create a product", async () => {
        const productRepository = MockRepository();
        const useCase = new CreateProductUseCase(productRepository);

        const output = await useCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        })
    });

    it("should throw an error when price is invalid", async () => {
        const productRepository = MockRepository();
        const useCase = new CreateProductUseCase(productRepository);

        input.price = -1;

        await expect(useCase.execute(input)).rejects.toThrow("Price must be greater than zero");
    })

    it("should throw an error when name is missing", async () => {
        const productRepository = MockRepository();
        const useCase = new CreateProductUseCase(productRepository);

        input.name = "";

        await expect(useCase.execute(input)).rejects.toThrow("Name is required");

    })
});
