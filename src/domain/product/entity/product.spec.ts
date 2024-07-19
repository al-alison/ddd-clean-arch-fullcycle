import Product from "./product";

describe("Product unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => {
            const product = new Product("", "Product 1", 100);
        }).toThrow("product: Id is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            const product = new Product("123", "", 100);
        }).toThrow("product: Name is required");
    });

    it("should throw error when price is less or equal than 0", () => {
        expect(() => {
            const product = new Product("123", "Product", -1);
        }).toThrow("product: Price must be greater than zero");
    });

    it("should throw error when name and id are empty and when price is less or equal than 0", () => {
        expect(() => {
            const product = new Product("", "", -1);
        }).toThrow("product: Id is required,product: Name is required,product: Price must be greater than zero");
    });

    it("it should change name", () => {
        const product = new Product("123", "Product", 100);
        product.changeName("Product 2");
        expect(product.name).toBe("Product 2");
    });

    it("it should change price", () => {
        const product = new Product("123", "Product", 100);
        product.changePrice(150);
        expect(product.price).toBe(150);
    });
});