const express = require('express');
const router = express.Router();
const ConectarBD = require('../bd/ConectarBD'); 
const conexion = new ConectarBD(); 

const { crearBaseDeDatos } = require('../bd/BaseBD');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/crearBase', (req, res) => {
    res.render('crearBase');
});

router.post('/crearBase', async (req, res) => {
    const { nombreBase } = req.body;
    try {
        await crearBaseDeDatos(nombreBase);
        res.redirect('/');
    } catch (err) {
        console.error('Error al crear la base de datos:', err);
        res.status(500).send('Error al crear la base de datos');
    }
});

router.get('/listarBases', async (req, res) => {
    try {
        const bases = await conexion.listarBasesDeDatos();
        res.render('listarBases', { bases });
    } catch (err) {
        console.error('Error al listar bases de datos:', err);
        res.status(500).send('Error al listar bases de datos');
    }
});

router.get('/verTablas', async (req, res) => {
    const { baseNombre } = req.query;
    try {
        await conexion.conectarMySql();
        await conexion.conexion.query(`USE \`${baseNombre}\``);

        const [tablas] = await conexion.conexion.query('SHOW TABLES');

        const tablasDetalles = await Promise.all(tablas.map(async (tablaObj) => {
            const tablaNombre = tablaObj[`Tables_in_${baseNombre}`];
            const [columnas] = await conexion.conexion.query(`SHOW COLUMNS FROM \`${tablaNombre}\``);
            const [registros] = await conexion.conexion.query(`SELECT * FROM \`${tablaNombre}\``);
            return { tablaNombre, columnas: columnas.map(col => col.Field), registros };
        }));

        await conexion.cerrarConexion();

        res.render('verTablas', { baseNombre, tablasDetalles });
    } catch (err) {
        console.error('Error al obtener tablas:', err);
        res.status(500).send('Error al obtener tablas');
    }
});


router.post('/eliminarTabla', async (req, res) => {
    const { baseNombre, tablaNombre } = req.body;
    try {
        await conexion.conectarMySql();
        await conexion.conexion.query(`USE \`${baseNombre}\``);

        const query = `DROP TABLE \`${tablaNombre}\``;
        await conexion.conexion.query(query);
        await conexion.cerrarConexion();

        res.redirect(`/verTablas?baseNombre=${baseNombre}`);
    } catch (err) {
        console.error('Error al eliminar la tabla:', err);
        res.status(500).send('Error al eliminar la tabla');
    }
});


router.post('/eliminarRegistro', async (req, res) => {
    const { baseNombre, tablaNombre, ...registro } = req.body;
    try {
        await conexion.conectarMySql();
        await conexion.conexion.query(`USE \`${baseNombre}\``);

        const whereClause = Object.keys(registro)
            .map(key => `\`${key}\` = ?`)
            .join(' AND ');

        const values = Object.values(registro);

        const sql = `DELETE FROM \`${tablaNombre}\` WHERE ${whereClause}`;

        await conexion.conexion.query(sql, values);
        await conexion.cerrarConexion();

        res.redirect(`/verTablas?baseNombre=${baseNombre}`);
    } catch (err) {
        console.error('Error al eliminar el registro:', err);
        res.status(500).send('Error al eliminar el registro');
    }
});


router.get('/insertarRegistroForm', async (req, res) => {
    const { baseNombre, tablaNombre } = req.query;
    try {
        await conexion.conectarMySql();
        await conexion.conexion.query(`USE \`${baseNombre}\``);

        const [columnas] = await conexion.conexion.query(`SHOW COLUMNS FROM \`${tablaNombre}\``);
        
        const columnasNames = columnas.map(col => col.Field);
        
        await conexion.cerrarConexion();
        res.render('insertarRegistro', { baseNombre, tablaNombre, columnas: columnasNames });
    } catch (err) {
        console.error('Error al obtener columnas:', err);
        res.status(500).send('Error al obtener columnas');
    }
});

router.post('/insertarRegistro', async (req, res) => {
    const { baseNombre, tablaNombre, ...registro } = req.body;
    try {
        await conexion.conectarMySql();
        await conexion.conexion.query(`USE \`${baseNombre}\``);

        const columnas = Object.keys(registro);
        const valores = Object.values(registro);
        const placeholders = columnas.map(() => '?').join(', ');
        const sql = `INSERT INTO \`${tablaNombre}\` (${columnas.map(col => `\`${col}\``).join(', ')}) VALUES (${placeholders})`;

        await conexion.conexion.query(sql, valores);
        await conexion.cerrarConexion();

        res.redirect(`/verTablas?baseNombre=${baseNombre}`);
    } catch (err) {
        console.error('Error al insertar el registro:', err);
        res.status(500).send('Error al insertar el registro');
    }
});

router.get('/modificarRegistro', (req, res) => {
    const { baseNombre, tablaNombre, ...datosRegistro } = req.query;
    res.render('modificarRegistro', { baseNombre, tablaNombre, datosRegistro });
});


router.post('/modificarRegistro', async (req, res) => {
    const { baseNombre, tablaNombre, ...datosRegistro } = req.body;
    try {
        await conexion.conectarMySql();
        await conexion.conexion.query(`USE \`${baseNombre}\``);

        const columnas = Object.keys(datosRegistro).filter(columna => columna !== 'id');
        const id = datosRegistro.id;
        const sets = columnas.map(columna => `\`${columna}\` = '${datosRegistro[columna]}'`).join(', ');
        const query = `UPDATE \`${tablaNombre}\` SET ${sets} WHERE \`id\` = '${id}'`;

        await conexion.conexion.query(query);
        await conexion.cerrarConexion();

        res.redirect(`/verTablas?baseNombre=${baseNombre}`);
    } catch (err) {
        console.error('Error al modificar registro:', err);
        res.status(500).send('Error al modificar registro');
    }
});

router.get('/crearTabla/:baseNombre', (req, res) => {
    const { baseNombre } = req.params;
    res.render('crearTabla', { baseNombre });
});

router.post('/generarCampos', (req, res) => {
    const { nombreTabla, numeroCampos } = req.query;
    res.render('generarCampos', { nombreTabla, numeroCampos });
});

router.post('/crearTabla', (req, res) => {
    const { nombreTabla, campos } = req.body;
    res.redirect('/listarBases');
});

router.post('/crearTabla', async (req, res) => {
    const { baseNombre, tablaNombre, campos } = req.body;
    try {
        await crearTabla(baseNombre, tablaNombre, JSON.parse(campos));
        res.redirect(`/verTablas/${baseNombre}`);
    } catch (err) {
        console.error('Error al crear la tabla:', err);
        res.status(500).send('Error al crear la tabla');
    }
});

module.exports = router;
