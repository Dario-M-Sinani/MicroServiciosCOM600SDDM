const { gql } = require("apollo-server-express");

const typeDefs = gql`
    # --- Tipos existentes ---
    type Mesa {
        id: ID!
        nro_mesa: String!
        nombre_escuela: String!
        padrones: [Padron!]
    }

    type Padron {
        id: ID!
        nombres: String!
        apellidos: String!
        numero_documento: String!
        fotografia: String!
        mesa: Mesa!
    }

    # --- NUEVOS TIPOS PARA LA BIBLIOTECA ---
    type Libro {
        id: ID!
        titulo: String!
        autor: String!
        isbn: String!
        anio_publicacion: Int!
        prestamos: [Prestamo!]
    }

    type Prestamo {
        id: ID!
        usuario: String!
        fecha_prestamo: String!
        fecha_devolucion: String!
        libro: Libro!
    }

    type Query {
        # --- Consultas existentes ---
        getPadrones: [Padron!]
        getMesas: [Mesa!]
        getPadronById(id: ID!): Padron

        # --- NUEVAS CONSULTAS ---
        getLibros: [Libro!]
        getPrestamos: [Prestamo!]
        getPrestamoById(id: ID!): Prestamo
        getPrestamosByUsuario(usuario: String!): [Prestamo!]
    }

    type Mutation {
        # --- Mutaciones existentes ---
        createMesa(nro_mesa: String!, nombre_escuela: String!): Mesa
        createPadron(nombres: String!, apellidos: String!, numero_documento: String!, fotografia: String!, mesaId: ID!): Padron
    
        # --- NUEVAS MUTACIONES ---
        createLibro(titulo: String!, autor: String!, isbn: String!, anio_publicacion: Int!): Libro
        createPrestamo(usuario: String!, fecha_prestamo: String!, fecha_devolucion: String!, libroId: ID!): Prestamo
    }
`;

module.exports = typeDefs;