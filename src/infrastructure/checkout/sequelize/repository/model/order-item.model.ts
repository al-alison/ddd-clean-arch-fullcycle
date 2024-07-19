import {OrderModel} from "../../../../../internal";
import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript'
import ProductModel from '../../../../product/sequelize/model/product.model';

@Table({
    tableName: "order_items",
    timestamps: false
})
export default class OrderItemModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;

    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false })
    declare productId: string;

    @BelongsTo(() => ProductModel)
    declare product: ProductModel;

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    declare orderId: string;

    @BelongsTo(() => OrderModel, {as: "owner", foreignKey: "orderId"})
    declare order: OrderModel;

    @Column({ allowNull: false })
    declare quantity: number;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare price: number;
}