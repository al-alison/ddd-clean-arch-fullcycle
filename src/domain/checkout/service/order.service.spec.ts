import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe("Order service unit tests", ()=>{

    it("should place an order", ()=>{
        const customer = new Customer("c1", "Customer 1");
        const item1 = new OrderItem("i1", "Item 1", 100, "p1", 2);

        const order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(100);
        expect(order.total()).toBe(200);
    })

    it("should add reward points", ()=>{
        const customer = new Customer("c1", "Customer 1");

        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    })


    it("should get total of all orders", ()=>{
        const item1 = new OrderItem("i1", "Item 1", 100, "p1", 2);
        const item2 = new OrderItem("i2", "Item 2", 250, "p2", 5);  
        const item3 = new OrderItem("i3", "Item 3", 300, "p3", 3);  
        const item4 = new OrderItem("i4", "Item 4", 50, "p4", 9);  
        const item5 = new OrderItem("i5", "Item 5", 500, "p5", 1);  
        const item6 = new OrderItem("i6", "Item 6", 900, "p6", 3);  
        const item7 = new OrderItem("i7", "Item 7", 1000, "p7", 15);  

        const order1 = new Order("123", "123", [item1, item2]);
        const order2 = new Order("1234", "123", [item3,item4,item5]);
        const order3 = new Order("12345", "123", [item6, item1]);
        const order4 = new Order("123456", "123", [item7,item2]);

        const total = OrderService.total([order1, order2, order3, order4]);

        expect(total).toBe(22450);
    })
})