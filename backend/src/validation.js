const validateCreateSubscription = (req, res, next) => {
  const errors = [];
  const { name, price, cycle, start_date, status } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required');
  } else if (name.length > 100) {
    errors.push('name must be 100 characters or fewer');
  }

  if (price === undefined || price === null || price === '') {
    errors.push('price is required');
  } else if (isNaN(Number(price)) || Number(price) <= 0) {
    errors.push('price must be a positive number');
  }

  if (!cycle) {
    errors.push('cycle is required');
  } else if (!['monthly', 'yearly'].includes(cycle)) {
    errors.push('cycle must be monthly or yearly');
  }

  if (!start_date) {
    errors.push('start_date is required');
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start_date)) {
      errors.push('start_date must be in YYYY-MM-DD format');
    } else if (isNaN(Date.parse(start_date))) {
      errors.push('start_date must be a valid date');
    }
  }

  if (status && !['active', 'cancelled'].includes(status)) {
    errors.push('status must be active or cancelled');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

const validateUpdateSubscription = (req, res, next) => {
  const errors = [];
  const { name, price, cycle, start_date, status } = req.body;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      errors.push('name must be a non-empty string');
    } else if (name.length > 100) {
      errors.push('name must be 100 characters or fewer');
    }
  }

  if (price !== undefined) {
    if (isNaN(Number(price)) || Number(price) <= 0) {
      errors.push('price must be a positive number');
    }
  }

  if (cycle !== undefined && !['monthly', 'yearly'].includes(cycle)) {
    errors.push('cycle must be monthly or yearly');
  }

  if (start_date !== undefined) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start_date)) {
      errors.push('start_date must be in YYYY-MM-DD format');
    } else if (isNaN(Date.parse(start_date))) {
      errors.push('start_date must be a valid date');
    }
  }

  if (status !== undefined && !['active', 'cancelled'].includes(status)) {
    errors.push('status must be active or cancelled');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

const validateId = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id < 1) {
    return res.status(400).json({ errors: ['id must be a positive integer'] });
  }
  req.params.id = id;
  next();
};

const validateCreateCard = (body) => {
  const errors = [];
  const { name } = body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required');
  } else if (name.length > 100) {
    errors.push('name must be 100 characters or fewer');
  }
  return errors;
};

module.exports = {
  validateCreateSubscription,
  validateUpdateSubscription,
  validateId,
  validateCreateCard,
};
