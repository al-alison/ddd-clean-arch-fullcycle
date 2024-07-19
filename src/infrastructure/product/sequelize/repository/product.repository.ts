import Product from "../../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../../domain/product/repository/product.repository.interface";
import ProductModel from "../model/product.model";

export default class ProductRepository implements ProductRepositoryInterface {

    async create(entity: Product): Promise<void> {
        await ProductModel.create({
            id: entity.id,
            name: entity.name,
            price: entity.price
        });
    }
    async update(entity: Product): Promise<void> {
        await ProductModel.update(
            {
                name: entity.name,
                price: entity.price
            },
            {
                where: { id: entity.id }
            });
    }
    async delete(entity: Product): Promise<void> {
        await ProductModel.destroy({
            where: { id: entity.id }
        })
    }
    async findById(id: string): Promise<Product> {
        let productModel = await ProductModel.findOne({ where: { id } });
        return new Product(productModel.id, productModel.name, productModel.price);
    }
    async findAll(): Promise<Product[]> {
        let productModels = await ProductModel.findAll();
        let products = productModels.map(productModel => new Product(productModel.id, productModel.name, productModel.price));
        return products;
    }
}