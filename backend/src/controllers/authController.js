const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// TEMPORÁRIO: usuários em memória. Será trocado por PostgreSQL (A2/A3).
// Atenção: ao reiniciar o servidor, esta lista zera.
const users = [];

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    const emailNormalized = email.toLowerCase().trim();
    if (users.find((u) => u.email === emailNormalized)) {
      return res.status(409).json({ error: 'E-mail já cadastrado' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = { id: users.length + 1, name, email: emailNormalized, password_hash };
    users.push(user);

    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    const user = users.find((u) => u.email === email.toLowerCase().trim());
    // Mesma mensagem para e-mail ou senha errados, para não revelar quais e-mails existem
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = { register, login };