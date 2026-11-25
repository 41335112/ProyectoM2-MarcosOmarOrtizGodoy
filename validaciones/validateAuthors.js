


function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidId(id) {
  const num = Number(id);
  return Number.isInteger(num) && num > 0;
}

function validateIdParam(req, res, next) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: 'El id debe ser un número entero positivo' });
  }
  next();
}

function validateCreateAuthor(req, res, next) {
  const { name, email, bio } = req.body;

  if (!isNonEmptyString(name) || !isNonEmptyString(email)) {
    return res.status(400).json({
      error: 'Los campos name y email son obligatorios y no pueden estar vacíos'
    });
  }

  if (bio !== undefined && bio !== null && typeof bio !== 'string') {
    return res.status(400).json({ error: 'El campo bio debe ser texto' });
  }

  // Normalizamos un poco los datos
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  next();
}

function validateUpdateAuthor(req, res, next) {
  const { name, email, bio } = req.body;

  if (name === undefined && email === undefined && bio === undefined) {
    return res.status(400).json({
      error: 'Debes enviar al menos un campo para actualizar'
    });
  }

  if (name !== undefined) {
    if (!isNonEmptyString(name)) {
      return res.status(400).json({ error: 'El campo name no puede estar vacío' });
    }
    req.body.name = name.trim();
  }

  if (email !== undefined) {
    if (!isNonEmptyString(email)) {
      return res.status(400).json({ error: 'El campo email no puede estar vacío' });
    }
    req.body.email = email.trim().toLowerCase();
  }

  if (bio !== undefined && bio !== null && typeof bio !== 'string') {
    return res.status(400).json({ error: 'El campo bio debe ser texto' });
  }

  next();
}

module.exports = {
  validateIdParam,
  validateCreateAuthor,
  validateUpdateAuthor
};