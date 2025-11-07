const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ msg: 'Por favor ingrese correo y contraseña' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM usuario WHERE correo = ?', [correo]);

    if (rows.length === 0) {
      return res.status(401).json({ msg: 'Credenciales inválidas' });
    }

    const usuario = rows[0];

    const isMatch = await bcrypt.compare(password, usuario.password);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Credenciales inválidas' });
    }

    const payload = {
      user: {
        id: usuario.id,
        correo: usuario.correo
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

const register = async (req, res) => {
};


module.exports = {
  login
  
};