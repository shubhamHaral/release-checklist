const schema = require("../src/graphql/schema/schema");

describe("GraphQL schema", () => {
    test("should contain required Release fields", () => {
        const releaseType = schema.getType("Release");

        expect(releaseType).toBeDefined();

        const fields = releaseType.getFields();

        expect(fields.name).toBeDefined();
        expect(fields.date).toBeDefined();
        expect(fields.status).toBeDefined();
        expect(fields.additionalInfo).toBeDefined();
        expect(fields.steps).toBeDefined();
    });
});