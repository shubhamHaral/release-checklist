const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./graphql/schema/schema");
const root = require("./graphql/resolvers/resolvers");
const { initDatabase } = require("./db/database");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "Release Checklist API is running" });
});

app.use(
    "/graphql",
    graphqlHTTP({
        schema,
        rootValue: root,
        graphiql: true,
    })
);

const PORT = process.env.PORT || 4000;

initDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`API running on http://localhost:${PORT}`);
            console.log(`GraphQL: http://localhost:${PORT}/graphql`);
        });
    })
    .catch((error) => {
        console.error("Database error:", error);
    });