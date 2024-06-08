import Product from "../entity/product";
import ProductService from "./product.service";

describe("Product service unit tests", ()=>{
    it("should change price of all products", ()=>{
        const product1 = new Product("prd1", "Product 1", 10);
        const product2 = new Product("prd2", "Product 2", 20);
        const product3 = new Product("prd3", "Product 3", 30);

        const products = [product1, product2, product3];

        ProductService.increasePrice(products, 10);

        expect(product1.price).toBe(11);
        expect(product2.price).toBe(22);
        expect(product3.price).toBe(33);
    }); 
});
