const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Padron",
    tableName: "padron",
    columns: {
        id: { type: "int", primary: true, generated: true },
        nombres: { type: "varchar" },
        apellidos: { type: "varchar" },
        numero_documento: { type: "varchar" },
        fotografia: { type: "varchar" }
    },
    relations: {
        mesa: {
            type: "many-to-one",
            target: "Mesa",
            joinColumn: true,
            eager: true
        }
    }
});