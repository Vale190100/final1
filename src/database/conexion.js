import mysql from 'mysql2/promise'

//cnonexion con la base de datos
export const conexion = await mysql.createConnection({
    host: 'localhost',
    user: 'Vale1234',
    database:'nueva reclamos',
    password:'hola',
})