/* === Normalización === */
function capitalizeName(name) {
  if (!name) return '';
  return name
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}

function normalizeEmail(email) {
  return email ? email.trim().toLowerCase() : '';
}

/* === Validaciones === */

/* ID validación */
function isValidId(id, users) {
  const parsedId = parseInt(id, 10);
  const isNumeric = !isNaN(parsedId) && parsedId > 0;
  const isUnique = !users.some(user => user.id === parsedId);
  return isNumeric && isUnique;
}

/* Name validación */
function isValidName(nombre) {
  if (typeof nombre !== 'string') return false;
  const trimmed = nombre.trim();
  return trimmed.length >= 2 && /^[a-zA-Z\s]+$/.test(trimmed);
}

/* Email validación */
function isValidEmail(email) {
  const emailNormalized = normalizeEmail(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailNormalized);
}

/* User validación */
function validateUser(user, users) {
  const errors = [];

  if (!isValidId(user.id, users)) {
    errors.push('ID inválido o ya existe');
  }

  if (!isValidName(user.nombre)) {
    errors.push('Nombre inválido (mínimo 2 letras, solo letras y espacios)');
  }

  if (!isValidEmail(user.email)) {
    errors.push('Email inválido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  capitalizeName,
  normalizeEmail,
  isValidId,
  isValidName,
  isValidEmail,
  validateUser
};
