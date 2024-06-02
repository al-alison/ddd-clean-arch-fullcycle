import { Op } from "sequelize";
import Order from "../../../domain/entity/order/order";
import OrderItem from "../../../domain/entity/order/order_item";
import OrderRepositoryInterface from "../../../domain/repository/order.repository.interface";
import OrderItemModel from "../../db/sequelize/model/order-item.model";
import OrderModel from "../../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
    async update(entity: Order): Promise<void> {

        const existingItems = await OrderItemModel.findAll({ where: { orderId: entity.id } });
        const existingItemIds = existingItems.map(item => item.id);
        const removedItemIds = existingItemIds.filter(id => !entity.items.some(item => item.id === id));
        await OrderItemModel.destroy({ where: { id: { [Op.in]: removedItemIds } } });

        // Update existing items
        await OrderItemModel.bulkCreate(entity.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            orderId: entity.id,
            productId: item.productId
        })));

        // Update order
        await OrderModel.update({
            customerId: entity.customerId,
            total: entity.total(),
        }, { where: { id: entity.id } });
    }
    async delete(entity: Order): Promise<void> {
        await OrderItemModel.destroy({ where: { orderId: entity.id } });
        await OrderModel.destroy({ where: { id: entity.id } });
    }
    async findById(id: string): Promise<Order> {
        let orderModel;
        try {
            orderModel = await OrderModel.findOne({
                where: { id },
                include: ["items"]
            })
        }
        catch (error) {
            throw new Error("Order not found");
        }
        let order = new Order(orderModel.id, orderModel.customerId, orderModel.items.map(item => {
            return new OrderItem(item.id, item.name, item.price, item.productId, item.quantity);
        }));

        return order;
    }
    async findAll(): Promise<Order[]> {
        let orderModels = await OrderModel.findAll({ include: ["items"] });
        let orders = orderModels.map(orderModel => {
            let order = new Order(orderModel.id, orderModel.customerId, orderModel.items.map(item => {
                return new OrderItem(item.id, item.name, item.price, item.productId, item.quantity);
            }));
            return order;
        });
        return orders;
    }

    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customerId: entity.customerId,
            total: entity.total(),
            items: entity.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                orderId: entity.id,
                productId: item.productId
            }))
        },
            { include: [{ model: OrderItemModel }] }
        );
    }
}