# URL Shortening Service – By Ahmed Hesham

## Tech Stack

- **Backend:** Node.js (Express.js)
- **Database:** MySQL
- **ORM/DB Driver:** mysql2 (Promise-based)
- **Security:** helmet, express-rate-limit, API key authentication
- **CORS:** Enabled via `cors` package
- **Testing:** Mocha, Supertest, Assert

---

## API Endpoints

All endpoints are prefixed with `/api/v1/shorten` and require an `x-api-key` header.

  **Important:**  
   - Set your API key in the `.env` file (do not hardcode it in your source code).  
   - Example `.env` entry:  
     ```
     API_KEY=your-secure-api-key
     ```
   - The `.env` file should also contain your database credentials.

### 1. Create a Short URL

**POST** `/api/v1/shorten`

**Headers:**
```
x-api-key: your-secure-api-key
Content-Type: application/json
```

**Body:**
```json
{
  "url": "https://www.example.com/your/long/url"
}
```

**Response:**
```json
{
  "id": 1,
  "url": "https://www.example.com/your/long/url",
  "shortCode": "abc123",
  "createdAt": "2024-06-01T12:00:00.000Z",
  "updatedAt": "2024-06-01T12:00:00.000Z",
  "accessCount": 0,
  "shortUrl": "http://localhost:3000/api/v1/shorten/abc123"
}
```

---

### 2. Retrieve Original URL

**GET** `/api/v1/shorten/{shortCode}`

**Headers:**
```
x-api-key: your-secure-api-key
```

**Response:**
```json
{
  "id": 1,
  "url": "https://www.example.com/your/long/url",
  "shortCode": "abc123",
  "createdAt": "2024-06-01T12:00:00.000Z",
  "updatedAt": "2024-06-01T12:00:00.000Z",
  "accessCount": 1
}
```

---

### 3. Update Short URL

**PUT** `/api/v1/shorten/{shortCode}`

**Headers:**
```
x-api-key: your-secure-api-key
Content-Type: application/json
```

**Body:**
```json
{
  "url": "https://www.example.com/your/updated/url"
}
```

**Response:**
```json
{
  "id": 1,
  "url": "https://www.example.com/your/updated/url",
  "shortCode": "abc123",
  "createdAt": "2024-06-01T12:00:00.000Z",
  "updatedAt": "2024-06-01T12:30:00.000Z",
  "accessCount": 1
}
```

---

### 4. Delete Short URL

**DELETE** `/api/v1/shorten/{shortCode}`

**Headers:**
```
x-api-key: your-secure-api-key
```

**Response:**  
- `204 No Content` (no body)

---

### 5. Get URL Statistics

**GET** `/api/v1/shorten/{shortCode}/stats`

**Headers:**
```
x-api-key: your-secure-api-key
```

**Response:**
```json
{
  "id": 1,
  "url": "https://www.example.com/your/long/url",
  "shortCode": "abc123",
  "createdAt": "2024-06-01T12:00:00.000Z",
  "updatedAt": "2024-06-01T12:00:00.000Z",
  "accessCount": 10
}
```

---

## Error Responses

- `400 Bad Request` – Invalid input
- `401 Unauthorized` – Missing or invalid API key
- `404 Not Found` – Short URL not found
- `429 Too Many Requests` – Rate limit exceeded

---

## Notes

- All endpoints return JSON.
- Replace `{shortCode}` with the code returned from the create endpoint.
- Use tools like Postman or curl to interact with the API.
- The API is protected by API key and rate limiting.

## License
- MIT

## Author
- Ahmed Hesham

## Project URLs
- https://roadmap.sh/projects/url-shortening-service
- 