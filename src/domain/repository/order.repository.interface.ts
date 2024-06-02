import Order from "../entity/order/order";
import RepositoryInterface from "./repository.interface";

export default interface OrderRepositoryInterface extends RepositoryInterface<Order> {}