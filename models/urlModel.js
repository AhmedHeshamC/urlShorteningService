const db = require('../db');

async function createUrl(url, shortCode) {
  const now = new Date();
  const [result] = await db.execute(
    'INSERT INTO urls (url, shortCode, createdAt, updatedAt, accessCount) VALUES (?, ?, ?, ?, 0)',
    [url, shortCode, now, now]
  );
  return {
    id: result.insertId,
    url,
    shortCode,
    createdAt: now,
    updatedAt: now,
    accessCount: 0
  };
}

async function getUrlByShortCode(shortCode) {
  const [rows] = await db.execute(
    'SELECT * FROM urls WHERE shortCode = ?',
    [shortCode]
  );
  return rows[0];
}

async function updateUrl(shortCode, url) {
  const now = new Date();
  const [result] = await db.execute(
    'UPDATE urls SET url = ?, updatedAt = ? WHERE shortCode = ?',
    [url, now, shortCode]
  );
  return result.affectedRows > 0 ? getUrlByShortCode(shortCode) : null;
}

async function deleteUrl(shortCode) {
  const [result] = await db.execute(
    'DELETE FROM urls WHERE shortCode = ?',
    [shortCode]
  );
  return result.affectedRows > 0;
}

async function incrementAccessCount(shortCode) {
  await db.execute(
    'UPDATE urls SET accessCount = accessCount + 1 WHERE shortCode = ?',
    [shortCode]
  );
}

async function getAllUrls() {
  const [rows] = await db.execute('SELECT * FROM urls');
  return rows;
}

module.exports = {
  createUrl,
  getUrlByShortCode,
  updateUrl,
  deleteUrl,
  incrementAccessCount,
  getAllUrls
};
