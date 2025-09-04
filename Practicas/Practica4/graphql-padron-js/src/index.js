require("reflect-metadata");
const { DataSource } = require("typeorm");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "graphql_practica",
    synchronize: true,
    logging: false,
    entities: [__dirname + "/entity/*.js"]
});

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: { AppDataSource } 
    });

    await server.start();
    server.applyMiddleware({ app });

    try {
        await AppDataSource.initialize();
        console.log("✅ Conectado a la base de datos");
        app.listen(4000, () => {
            console.log(`🚀 Servidor listo en http://localhost:4000${server.graphqlPath}`);
        });
    } catch (error) {
        console.error(" Error al conectar a la base de datos:", error);
    }
}

startServer();