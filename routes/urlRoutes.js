const express = require('express');
const router = express.Router();
const urlModel = require('../models/urlModel');
const { nanoid } = require('nanoid');

// Create Short URL
router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  const shortCode = nanoid(6);
  try {
    const result = await urlModel.createUrl(url, shortCode);
    // Add shortUrl property to the response
    const protocol = req.protocol;
    const host = req.get('host');
    result.shortUrl = `${protocol}://${host}/api/v1/shorten/${result.shortCode}`;
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all Short URLs
router.get('/', async (req, res) => {
  try {
    const urls = await urlModel.getAllUrls();
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Retrieve Original URL
router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  const urlEntry = await urlModel.getUrlByShortCode(shortCode);
  if (!urlEntry) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  await urlModel.incrementAccessCount(shortCode);
  res.json(urlEntry);
});

// Update Short URL
router.put('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  const updated = await urlModel.updateUrl(shortCode, url);
  if (!updated) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  res.json(await urlModel.getUrlByShortCode(shortCode));
});

// Delete Short URL
router.delete('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  const deleted = await urlModel.deleteUrl(shortCode);
  if (!deleted) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  res.status(204).send();
});

// Get URL Statistics
router.get('/:shortCode/stats', async (req, res) => {
  const { shortCode } = req.params;
  const urlEntry = await urlModel.getUrlByShortCode(shortCode);
  if (!urlEntry) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  res.json(urlEntry);
});

module.exports = router;
