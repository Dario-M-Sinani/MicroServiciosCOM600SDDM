const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Mesa",
    tableName: "mesa",
    columns: {
        id: { type: "int", primary: true, generated: true },
        nro_mesa: { type: "varchar" },
        nombre_escuela: { type: "varchar" }
    },
    relations: {
        padrones: {
            type: "one-to-many",
            target: "Padron",
            inverseSide: "mesa"
        }
    }
});