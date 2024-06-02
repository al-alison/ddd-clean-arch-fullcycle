import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../db/sequelize/model/customer.model";
import OrderItemModel from "../../db/sequelize/model/order-item.model";
import OrderModel from "../../db/sequelize/model/order.model";
import ProductModel from "../../db/sequelize/model/product.model";
import Customer from "../../../domain/entity/customer/customer";
import Address from "../../../domain/entity/customer/address";
import Product from "../../../domain/entity/product/product";
import ProductRepository from "../product/product.repository";
import OrderItem from "../../../domain/entity/order/order_item";
import Order from "../../../domain/entity/order/order";
import OrderRepository from "./order.repository";
import CustomerRepository from "../customer/customer.repository";

describe("Order Repository Tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([CustomerModel, OrderItemModel, OrderModel, ProductModel]);
        await sequelize.sync();
    });


    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const orderRepository = new OrderRepository();
        const customer = new Customer("c1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        customer.activate();
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);

        const product2 = new Product("p2", "Product 2", 400);
        await productRepository.create(product2);

        const orderItem = new OrderItem("i1", product.name, product.price, product.id, 2);
        const orderItem2 = new OrderItem("i2", product2.name, product2.price, product2.id, 4);

        const order = new Order("o1", customer.id, [orderItem, orderItem2]);

        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        })

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customerId: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    orderId: order.id,
                    productId: orderItem.productId
                },
                {
                    id: orderItem2.id,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                    orderId: order.id,
                    productId: orderItem2.productId
                }
            ]
        });

    });

    it("should update order", async () => {
        const customerRepository = new CustomerRepository();
        const orderRepository = new OrderRepository();
        const customer = new Customer("c1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        customer.activate();
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);

        const product2 = new Product("p2", "Product 2", 400);
        await productRepository.create(product2);

        const orderItem = new OrderItem("i1", product.name, product.price, product.id, 2);
        const orderItem2 = new OrderItem("i2", product2.name, product2.price, product2.id, 4);

        const order = new Order("o1", customer.id, [orderItem, orderItem2]);

        await orderRepository.create(order);

        const product3 = new Product("p3", "Product 3", 500);
        await productRepository.create(product3);

        const orderItem3 = new OrderItem("i3", product3.name, product3.price, product3.id, 6);
        order.items.length = 0;
        order.items.push(orderItem3);
        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        })

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customerId: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem3.id,
                    name: orderItem3.name,
                    price: orderItem3.price,
                    quantity: orderItem3.quantity,
                    orderId: order.id,
                    productId: orderItem3.productId
                }
            ]
        });

    });

    it("should find order", async () => {
        const customerRepository = new CustomerRepository();
        const orderRepository = new OrderRepository();
        const customer = new Customer("c1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        customer.activate();
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("i1", product.name, product.price, product.id, 2);
        const order = new Order("o1", customer.id, [orderItem]);

        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        })

        const foundOrder = await orderRepository.findById(order.id);

        expect(orderModel.toJSON()).toStrictEqual({
            id: foundOrder.id,
            customerId: customer.id,
            total: foundOrder.total(),
            items: [
                {
                    id: foundOrder.items[0].id,
                    name: foundOrder.items[0].name,
                    price: foundOrder.items[0].price,
                    quantity: foundOrder.items[0].quantity,
                    orderId: foundOrder.id,
                    productId: foundOrder.items[0].productId
                }
            ]
         })

    });

    it("should throw error when order is not found", async () => {
        const orderRepository = new OrderRepository();
        expect(async () => {
            await orderRepository.findById("order_not_found");
        }).rejects.toThrow("Order not found");
    });

    it("should delete order", async () => {
        const customerRepository = new CustomerRepository();
        const orderRepository = new OrderRepository();
        const customer = new Customer("c1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        customer.activate();
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("i1", product.name, product.price, product.id, 2);
        const order = new Order("o1", customer.id, [orderItem]);

        await orderRepository.create(order);

        await orderRepository.delete(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        })

        expect(orderModel).toBeNull();
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const orderRepository = new OrderRepository();
        const customer = new Customer("c1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        customer.activate();
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("i1", product.name, product.price, product.id, 2);
        const order1 = new Order("o1", customer.id, [orderItem]);

        const orderItem2 = new OrderItem("i2", product.name, product.price, product.id, 8);
        const order2 = new Order("o2", customer.id, [orderItem2]);

        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const foundOrders = await orderRepository.findAll();
        expect(foundOrders).toHaveLength(2);

        expect(foundOrders).toContainEqual(order1);
        expect(foundOrders).toContainEqual(order2);
    });
});