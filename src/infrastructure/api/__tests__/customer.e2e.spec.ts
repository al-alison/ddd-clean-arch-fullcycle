import { app, sequelize } from "../express";
import request from "supertest";

describe("Customer API E2E tests", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "Customer 1",
                address: {
                    street: "Street 1",
                    number: 1,
                    zip: "Zipcode 1",
                    city: "City 1"
                }
            });
        expect(response.status).toBe(201);
        expect(response.body.name).toBe("Customer 1");
        expect(response.body.address.street).toBe("Street 1");
        expect(response.body.address.number).toBe(1);
        expect(response.body.address.zip).toBe("Zipcode 1");
        expect(response.body.address.city).toBe("City 1");
    });

    it("should not create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "Customer 1",
            });
        expect(response.status).toBe(500);
    })

    it("should list all customers", async () => {
        const response1 = await request(app)
            .post("/customer")
            .send({
                name: "Customer 1",
                address: {
                    street: "Street 1",
                    number: 1,
                    zip: "Zipcode 1",
                    city: "City 1"
                }
            });
        expect(response1.status).toBe(201);

        const response2 = await request(app)
            .post("/customer")
            .send({
                name: "Customer 2",
                address: {
                    street: "Street 2",
                    number: 2,
                    zip: "Zipcode 2",
                    city: "City 2"
                }
            });

        expect(response2.status).toBe(201);

        const response = await request(app)
            .get("/customer")
            .send();
        expect(response.status).toBe(200);
        expect(response.body.customers.length).toBe(2);
        expect(response.body.customers[0].name).toBe("Customer 1");
        expect(response.body.customers[0].address.street).toBe("Street 1");
        expect(response.body.customers[0].address.number).toBe(1);
        expect(response.body.customers[0].address.zip).toBe("Zipcode 1");
        expect(response.body.customers[0].address.city).toBe("City 1");

        expect(response.body.customers[1].name).toBe("Customer 2");
        expect(response.body.customers[1].address.street).toBe("Street 2");
        expect(response.body.customers[1].address.number).toBe(2);
        expect(response.body.customers[1].address.zip).toBe("Zipcode 2");
        expect(response.body.customers[1].address.city).toBe("City 2");
    })
})