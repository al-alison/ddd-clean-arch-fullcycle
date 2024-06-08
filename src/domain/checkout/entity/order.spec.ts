import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "123", []);
        }).toThrow("Id is required");
    });

    it("should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("123", "", []);
        }).toThrow("customerId is required");
    });

    it("should throw error when no items are provided", () => {
        expect(() => {
            let order = new Order("123", "123", []);
        }).toThrow("Items are required");
    });

    it("should calculate total", () => {
        const item = new OrderItem("i1", "Item 1",100, "p1" , 2);
        const item2 = new OrderItem("i2", "Item 2", 250, "p2", 2);

        const order = new Order("123", "123", [item, item2]);
        let total = order.total()

        const order2 = new Order("124", "1234", [item, item2]);

        total = order2.total()

        expect(total).toBe(700);
    });

    it("should throw error if item quantity is less or equal zero", () => {
        expect(()=>{
            const item = new OrderItem("i1", "Item 1",100, "p1" , 0);
            const order = new Order("123", "123", [item]);    
        }).toThrow("Quantity must be greater than zero");
    });
});