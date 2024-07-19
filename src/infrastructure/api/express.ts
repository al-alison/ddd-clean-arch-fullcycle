import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../customer/sequelize/model/customer.model";
import ProductModel from "../product/sequelize/model/product.model";
import { customerRoute } from "./route/customer.route";
import { productRoute } from "./route/product.route";

export const app: Express = express();
app.use(express.json());
app.use("/customer", customerRoute);
app.use("/product", productRoute);

export let sequelize: Sequelize;

async function setupDB(){
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
    });
    await sequelize.addModels([ProductModel, CustomerModel]);
    await sequelize.sync();
}

setupDB();