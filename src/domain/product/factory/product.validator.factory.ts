import ValidatorInterface from "../../@shared/validator/validator.interface";
import ProductInterface from "../entity/product.interface";
import ProductBYupValidator from "../validator/product-b.yup.validator";
import ProductYupValidator from "../validator/product.yup.validator";

export default class ProductValidatorFactory {

    static create(type: string): ValidatorInterface<ProductInterface> {
        switch (type) {
            case "a":
                return new ProductBYupValidator();
            case "b":
                return new ProductYupValidator();
            default:
                throw new Error("Product type not supported");
        }
    }
}