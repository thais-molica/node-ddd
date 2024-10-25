import Product from "../entity/product"
import ProductService from "./product.service";

describe('Product service unit test', () => {

    it('should change prices of all products', () => {
        const product = new Product('id', 'name', 20);
        const product2 = new Product('id2', 'name2', 10);
        const products = [product, product2];

        ProductService.increasePrice(products, 100);

        expect(product.price).toBe(40);
        expect(product2.price).toBe(20);
    })
})