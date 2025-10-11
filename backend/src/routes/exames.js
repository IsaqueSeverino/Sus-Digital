const express = require('express');
const router = express.Router();

// Rota básica - implementação completa pode ser feita depois
router.get('/', (req, res) => {
  res.json({ 
    message: 'Rotas de exames - em desenvolvimento',
    availableRoutes: ['GET /', 'POST /', 'GET /:id', 'PUT /:id']
  });
});

module.exports = router;
