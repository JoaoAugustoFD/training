require('dotenv').config();
const authRoutes = require('./routes/auth');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    app.use('/auth', authRoutes);
  res.json({ status: 'ok', message: 'API do app de treino funcionando' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    console.error('Erro ao iniciar o servidor:', err.message);
    return;
  }
  console.log(`Servidor rodando na porta ${PORT}`);
});