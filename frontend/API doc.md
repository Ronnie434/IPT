# Portfolio Analyzer API Documentation

This document provides detailed information about all available API endpoints in the Portfolio Analyzer service.

## Base URL

```
https://ipt-fb73.onrender.com
```

## Authentication

Most endpoints require authentication. You must first login using the `/api/auth/login` endpoint to obtain a session.

## API Endpoints

### Authentication & Session Management

#### POST `/api/auth/login`
Login to Robinhood account

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "mfa_code": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful"
}
```

**Usage Example:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username", "password":"your_password"}' \
  https://ipt-fb73.onrender.com/api/auth/login
```

#### POST `/api/auth/logout`
Logout from Robinhood account

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Usage Example:**
```bash
curl -X POST \
  -H "Origin: https://your-frontend.com" \
  https://ipt-fb73.onrender.com/api/auth/logout
```

#### POST `/api/session/clear`
Clear session data

**Response:**
```json
{
  "success": true,
  "message": "Session cleared successfully"
}
```

**Usage Example:**
```bash
curl -X POST \
  -H "Origin: https://your-frontend.com" \
  https://ipt-fb73.onrender.com/api/session/clear
```

#### POST `/api/cache/clear`
Clear cached data

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared successfully"
}
```

**Usage Example:**
```bash
curl -X POST \
  -H "Origin: https://your-frontend.com" \
  https://ipt-fb73.onrender.com/api/cache/clear
```

### Portfolio Data

#### GET `/api/portfolio/summary`
Get portfolio summary with calculated metrics

**Response:**
```json
{
  "success": true,
  "data": {
    "total_equity": 0,
    "total_market_value": 0,
    "total_positions": 0,
    "total_dividends": 0,
    "holdings": {}
  }
}
```

**Usage Example:**
```bash
curl -X GET \
  -H "Origin: https://your-frontend.com" \
  https://ipt-fb73.onrender.com/api/portfolio/summary
```

#### GET `/api/portfolio/holdings`
Get raw holdings data

**Response:**
```json
{
  "success": true,
  "data": {
    "SYMBOL": {
      "quantity": "0",
      "average_buy_price": "0",
      "equity": "0",
      "market_value": "0",
      "price": "0",
      "percent_change": "0",
      "total_return_today": "0",
      "total_return_today_percent": "0",
      "equity_change": "0",
      "type": "stock",
      "name": "string",
      "id": "string",
      "pe_ratio": "string",
      "dividend_yield": "string"
    }
  }
}
```

**Usage Example:**
```bash
curl -X GET \
  -H "Origin: https://your-frontend.com" \
  https://ipt-fb73.onrender.com/api/portfolio/holdings
```

#### GET `/api/portfolio/dividends`
Get all dividend records

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "amount": "0",
      "rate": "0",
      "position": "0",
      "paid_at": "string",
      "payable_date": "string",
      "record_date": "string",
      "state": "string",
      "symbol": "string",
      "instrument": "string"
    }
  ]
}
```

**Usage Example:**
```bash
curl -X GET \
  -H "Origin: https://your-frontend.com" \
  https://ipt-fb73.onrender.com/api/portfolio/dividends
```

#### GET `/api/portfolio/total-dividends`
Get total dividends earned

**Response:**
```json
{
  "success": true,
  "data": {
    "total_dividends": "0.00"
  }
}
```

**Usage Example:**
```bash
curl -X GET \
  -H "Origin: https://your-frontend.com" \
  https://ipt-fb73.onrender.com/api/portfolio/total-dividends
```

### Order Management

#### GET `/api/orders/open`
Get all open orders

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "quantity": "0",
      "price": "0",
      "side": "string",
      "type": "string",
      "time_in_force": "string",
      "state": "string",
      "created_at": "string",
      "updated_at": "string",
      "symbol": "string",
      "instrument": "string"
    }
  ]
}
```

**Usage Example:**
```bash
curl -X GET \
  -H "Origin: https://your-frontend.com" \
  https://ipt-fb73.onrender.com/api/orders/open
```

#### GET `/api/orders/all`
Get all orders (including completed)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "quantity": "0",
      "price": "0",
      "side": "string",
      "type": "string",
      "time_in_force": "string",
      "state": "string",
      "created_at": "string",
      "updated_at": "string",
      "executed_at": "string",
      "symbol": "string",
      "instrument": "string"
    }
  ]
}
```

**Usage Example:**
```bash
curl -X GET \
  -H "Origin: https://your-frontend.com" \
  https://ipt-fb73.onrender.com/api/orders/all
```

#### GET `/api/orders/symbol/{symbol}`
Get orders for a specific stock symbol

**Path Parameters:**
- `symbol`: Stock symbol (e.g., AAPL)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "quantity": "0",
      "price": "0",
      "side": "string",
      "type": "string",
      "time_in_force": "string",
      "state": "string",
      "created_at": "string",
      "updated_at": "string",
      "executed_at": "string",
      "symbol": "string",
      "instrument": "string"
    }
  ]
}
```

**Usage Example:**
```bash
curl -X GET \
  -H "Origin: https://your-frontend.com" \
  https://ipt-fb73.onrender.com/api/orders/symbol/AAPL
```

### Dividend Information

#### GET `/api/dividends/symbol/{symbol}`
Get dividends for a specific stock symbol

**Path Parameters:**
- `symbol`: Stock symbol (e.g., AAPL)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "amount": "0",
      "rate": "0",
      "position": "0",
      "paid_at": "string",
      "payable_date": "string",
      "record_date": "string",
      "state": "string",
      "symbol": "string",
      "instrument": "string"
    }
  ]
}
```

**Usage Example:**
```bash
curl -X GET \
  -H "Origin: https://your-frontend.com" \
  https://ipt-fb73.onrender.com/api/dividends/symbol/AAPL
```

### Stock Analysis

#### GET `/api/stock/{symbol}`
Get comprehensive summary for a specific stock

**Path Parameters:**
- `symbol`: Stock symbol (e.g., AAPL)

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "string",
    "current_holding": {},
    "orders": [],
    "dividends": [],
    "metrics": {
      "total_bought_quantity": 0,
      "total_sold_quantity": 0,
      "net_quantity": 0,
      "total_dividend_amount": 0,
      "dividend_count": 0,
      "calculated_avg_price": 0,
      "total_orders": 0,
      "buy_orders": 0,
      "sell_orders": 0
    }
  }
}
```

**Usage Example:**
```bash
curl -X GET \
  -H "Origin: https://your-frontend.com" \
  https://ipt-fb73.onrender.com/api/stock/AAPL
```

### Account Information

#### GET `/api/account/info`
Get basic account information

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {},
    "account": {},
    "portfolio": {}
  }
}
```

**Usage Example:**
```bash
curl -X GET \
  -H "Origin: https://your-frontend.com" \
  https://ipt-fb73.onrender.com/api/account/info
```

#### GET `/api/user/info`
Get current user information

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "string",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "account_id": "string",
    "profile": {},
    "account": {},
    "attempted_username": "string"
  }
}
```

**Usage Example:**
```bash
curl -X GET \
  -H "Origin: https://your-frontend.com" \
  https://ipt-fb73.onrender.com/api/user/info
```

### System Health

#### GET `/api/health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy"
}
```

**Usage Example:**
```bash
curl -X GET \
  -H "Origin: https://your-frontend.com" \
  https://ipt-fb73.onrender.com/api/health
```

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Unauthorized requests (when not logged in) will return a 401 status code with:
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

## CORS Support

All endpoints support CORS and can be accessed from any origin:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Methods: *`
- `Access-Control-Allow-Headers: *`