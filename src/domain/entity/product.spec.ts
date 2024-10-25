import Product from "./product";

describe("Product unit tests", () => {

    it("Should throw error when id is empty", () => {
        expect(() => {
            new Product('', 'name', 5)
        }).toThrowError('Id is required')
    });

    it("Should throw error when id is empty", () => {
        expect(() => {
            new Product('id', '', 5)
        }).toThrowError('Name is required')
    });

    it("Should throw error when price is less than zero", () => {
        expect(() => {
            new Product('id', 'name', 0)
        }).toThrowError('Price must be greater than zero')
    });

    it("Should change name", () => {
        const product = new Product('id', 'name', 20);
        product.changeName('new name');
        expect(product.name).toBe('new name')
    });

    it("Should change price", () => {
        const product = new Product('id', 'name', 20);
        product.changePrice(80);
        expect(product.price).toBe(80)
    });

})