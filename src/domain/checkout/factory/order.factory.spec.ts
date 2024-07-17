import { v4 as uuid } from "uuid";
import OrderFactory from "./order.factory";

describe("Order factory unit tests", () => {
    it("should create a order", () => {

        const orderProps = {
            id: uuid(),
            customerId: uuid(),
            items: [
                {
                    id: uuid(),
                    name: "Product A",
                    productId: uuid(),
                    quantity: 1,
                    price: 10
                }
            ]
        }

        const order = OrderFactory.create(orderProps);
        expect(order.id).toEqual(orderProps.id);
        expect(order.customerId).toBe(orderProps.customerId);
        expect(order.items.length).toBe(1);
    });
});