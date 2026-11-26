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

function validateCreatePost(req, res, next) {
  const { title, content, author_id, published } = req.body;
  const parsedAuthorId = Number(author_id);

  if (!isNonEmptyString(title)) {
    return res.status(400).json({ error: 'El campo title es obligatorio y no puede estar vacío' });
  }

  if (!isNonEmptyString(content)) {
    return res.status(400).json({ error: 'El campo content es obligatorio y no puede estar vacío' });
  }

  if (
    author_id === undefined ||
    author_id === null ||
    author_id === '' ||
    !Number.isInteger(parsedAuthorId) ||
    parsedAuthorId <= 0
  ) {
    return res.status(400).json({
      error: 'El campo author_id es obligatorio y debe ser un número entero positivo'
    });
  }

  if (published !== undefined && typeof published !== 'boolean') {
    return res.status(400).json({ error: 'El campo published debe ser booleano (true o false)' });
  }

  req.body.title = title.trim();
  req.body.content = content.trim();
  req.body.author_id = parsedAuthorId;
  req.body.published = published === undefined ? false : published;
  next();
}

function validateUpdatePost(req, res, next) {
  const { title, content, author_id, published } = req.body;

  if (
    title === undefined &&
    content === undefined &&
    author_id === undefined &&
    published === undefined
  ) {
    return res.status(400).json({
      error: 'Debes enviar al menos un campo para actualizar'
    });
  }

  if (title !== undefined) {
    if (!isNonEmptyString(title)) {
      return res.status(400).json({ error: 'El campo title no puede estar vacío' });
    }
    req.body.title = title.trim();
  }

  if (content !== undefined) {
    if (!isNonEmptyString(content)) {
      return res.status(400).json({ error: 'El campo content no puede estar vacío' });
    }
    req.body.content = content.trim();
  }

  if (author_id !== undefined) {
    const parsedAuthorId = Number(author_id);
    if (!Number.isInteger(parsedAuthorId) || parsedAuthorId <= 0) {
      return res.status(400).json({ error: 'El campo author_id debe ser un número entero positivo' });
    }
    req.body.author_id = parsedAuthorId;
  }

  if (published !== undefined && typeof published !== 'boolean') {
    return res.status(400).json({ error: 'El campo published debe ser booleano (true o false)' });
  }

  next();
}

module.exports = {
  validateIdParam,
  validateCreatePost,
  validateUpdatePost
};