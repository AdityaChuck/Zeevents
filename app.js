const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { connect } = require("mongoose");
const cors = require("cors");

const Schema = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const { checkAuth } = require("./middleware/is-auth");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json());
app.use(checkAuth);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: Schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

connect(process.env.DB_URL)
  .then(() => {
    console.log("Mongo DB connected");
    app.listen(4000, () => console.log("listening on 4000"));
  })
  .catch((err) => console.log("something went wrong", err));
