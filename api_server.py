from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from portfolio_analyzer import PortfolioAnalyzer
from utils import safe_float
import os
import logging
from typing import Optional
import datetime

# Configure logging for Render deployment
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()  # This will output to stdout, which Render captures
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI(title="Portfolio Analyzer API")

# Global analyzer instance for session-based authentication
analyzer = None

class LoginRequest(BaseModel):
    username: str
    password: str
    mfa_code: Optional[str] = None

class LoginResponse(BaseModel):
    success: bool
    message: str

class PortfolioResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = None

@app.post("/api/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    @app.post("/api/auth/login", response_model=LoginResponse)
    async def login(request: LoginRequest):
        """
        Login with fresh credentials, ensuring no old cached session is used.
        Creates persistent session for subsequent API calls.
        """
        global analyzer
        
        # Log login attempt (without password for security)
        logger.info(f"LOGIN ATTEMPT - User: {request.username}, MFA: {'Yes' if request.mfa_code else 'No'}, Timestamp: {datetime.datetime.now().isoformat()}")
        
        try:
            # CRITICAL: Clear any existing analyzer and force fresh authentication
            if analyzer:
                try:
                    analyzer.logout()
                    logger.info(f"LOGIN - Cleared existing analyzer session for user: {request.username}")
                except Exception as logout_error:
                    logger.warning(f"LOGIN - Error clearing existing analyzer: {str(logout_error)}")
                    pass
                analyzer = None
            
            # Create completely new analyzer instance to ensure fresh authentication
            analyzer = PortfolioAnalyzer()
            logger.info(f"LOGIN - Created new analyzer instance for user: {request.username}")
            
            # IMPORTANT: This login call will use the enhanced authentication logic
            # from PortfolioAnalyzer that validates fresh credentials and prevents
            # session contamination
            success = analyzer.login(request.username, request.password, request.mfa_code)
            
            if success:
                logger.info(f"LOGIN SUCCESS - User: {request.username}, Timestamp: {datetime.datetime.now().isoformat()}")
                response_data = {"success": True, "message": "Login successful"}
            else:
                # If login failed, clear the analyzer
                analyzer = None
                logger.warning(f"LOGIN FAILED - User: {request.username}, Reason: Invalid credentials, Timestamp: {datetime.datetime.now().isoformat()}")
                response_data = {"success": False, "message": "Login failed. Please check your credentials."}
                
        except Exception as e:
            # If any error occurs, clear the analyzer
            analyzer = None
            logger.error(f"LOGIN ERROR - User: {request.username}, Error: {str(e)}, Timestamp: {datetime.datetime.now().isoformat()}")
            response_data = {"success": False, "message": f"Login error: {str(e)}"}
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.get("/api/portfolio/summary", response_model=PortfolioResponse)
async def get_portfolio_summary():
    """
    Get portfolio summary using session-based authentication
    """
    global analyzer
    
    if not analyzer:
        response_data = {"success": False, "message": "Not authenticated. Please login first."}
        response = JSONResponse(content=response_data, status_code=401)
    else:
        try:
            holdings = analyzer.get_holdings()
            
            if not holdings:
                response_data = {
                    "success": False, 
                    "message": "No holdings data available"
                }
            else:
                # Calculate summary metrics
                total_equity = sum(safe_float(holding.get('equity', 0)) for holding in holdings.values())
                total_market_value = sum(safe_float(holding.get('market_value', 0)) for holding in holdings.values())
                total_positions = len(holdings)
                total_dividends = analyzer.get_total_dividends()
                
                portfolio_data = {
                    "total_equity": total_equity,
                    "total_market_value": total_market_value,
                    "total_positions": total_positions,
                    "total_dividends": safe_float(total_dividends),
                    "holdings": holdings
                }
                
                response_data = {"success": True, "data": portfolio_data}
                
        except Exception as e:
            response_data = {
                "success": False, 
                "message": f"Error loading portfolio data: {str(e)}"
            }
        
        response = JSONResponse(content=response_data)
    
    # Add CORS headers to the response
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.get("/api/portfolio/dividends")
async def get_dividends():
    global analyzer
    
    if not analyzer:
        response_data = {"success": False, "message": "Not authenticated. Please login first."}
        response = JSONResponse(content=response_data, status_code=401)
    else:
        try:
            dividends = analyzer.get_dividends()
            response_data = {"success": True, "data": dividends}
        except Exception as e:
            response_data = {
                "success": False, 
                "message": f"Error loading dividends data: {str(e)}"
            }
        
        response = JSONResponse(content=response_data)
    
    # Add CORS headers to the response
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.get("/api/portfolio/total-dividends")
async def get_total_dividends():
    global analyzer
    
    if not analyzer:
        response_data = {"success": False, "message": "Not authenticated. Please login first."}
        response = JSONResponse(content=response_data, status_code=401)
    else:
        try:
            total_dividends = analyzer.get_total_dividends()
            response_data = {"success": True, "data": {"total_dividends": total_dividends}}
        except Exception as e:
            response_data = {
                "success": False, 
                "message": f"Error loading total dividends data: {str(e)}"
            }
        
        response = JSONResponse(content=response_data)
    
    # Add CORS headers to the response
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.get("/api/orders/open")
async def get_open_orders():
    global analyzer
    
    if not analyzer:
        response_data = {"success": False, "message": "Not authenticated. Please login first."}
        response = JSONResponse(content=response_data, status_code=401)
    else:
        try:
            open_orders = analyzer.get_open_orders()
            response_data = {"success": True, "data": open_orders}
        except Exception as e:
            response_data = {
                "success": False, 
                "message": f"Error loading open orders data: {str(e)}"
            }
        
        response = JSONResponse(content=response_data)
    
    # Add CORS headers to the response
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.get("/api/orders/all")
async def get_all_orders():
    global analyzer
    
    if not analyzer:
        response_data = {"success": False, "message": "Not authenticated. Please login first."}
        response = JSONResponse(content=response_data, status_code=401)
    else:
        try:
            all_orders = analyzer.get_all_orders()
            response_data = {"success": True, "data": all_orders}
        except Exception as e:
            response_data = {
                "success": False, 
                "message": f"Error loading all orders data: {str(e)}"
            }
        
        response = JSONResponse(content=response_data)
    
    # Add CORS headers to the response
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.get("/api/orders/symbol/{symbol}")
async def get_stock_orders_by_symbol(symbol: str):
    global analyzer
    
    if not analyzer:
        response_data = {"success": False, "message": "Not authenticated. Please login first."}
        response = JSONResponse(content=response_data, status_code=401)
    else:
        try:
            orders = analyzer.get_stock_orders_by_symbol(symbol)
            response_data = {"success": True, "data": orders}
        except Exception as e:
            response_data = {
                "success": False, 
                "message": f"Error loading orders for symbol {symbol}: {str(e)}"
            }
        
        response = JSONResponse(content=response_data)
    
    # Add CORS headers to the response
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.get("/api/dividends/symbol/{symbol}")
async def get_stock_dividends_by_symbol(symbol: str):
    global analyzer
    
    if not analyzer:
        response_data = {"success": False, "message": "Not authenticated. Please login first."}
        response = JSONResponse(content=response_data, status_code=401)
    else:
        try:
            dividends = analyzer.get_stock_dividends_by_symbol(symbol)
            response_data = {"success": True, "data": dividends}
        except Exception as e:
            response_data = {
                "success": False, 
                "message": f"Error loading dividends for symbol {symbol}: {str(e)}"
            }
        
        response = JSONResponse(content=response_data)
    
    # Add CORS headers to the response
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.get("/api/stock/{symbol}")
async def get_stock_summary(symbol: str):
    global analyzer
    
    if not analyzer:
        response_data = {"success": False, "message": "Not authenticated. Please login first."}
        response = JSONResponse(content=response_data, status_code=401)
    else:
        try:
            stock_summary = analyzer.get_stock_summary(symbol)
            response_data = {"success": True, "data": stock_summary}
        except Exception as e:
            response_data = {
                "success": False, 
                "message": f"Error loading summary for symbol {symbol}: {str(e)}"
            }
        
        response = JSONResponse(content=response_data)
    
    # Add CORS headers to the response
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.get("/api/account/info")
async def get_account_info():
    global analyzer
    
    if not analyzer:
        response_data = {"success": False, "message": "Not authenticated. Please login first."}
        response = JSONResponse(content=response_data, status_code=401)
    else:
        try:
            account_info = analyzer.get_account_info()
            response_data = {"success": True, "data": account_info}
        except Exception as e:
            response_data = {
                "success": False, 
                "message": f"Error loading account info: {str(e)}"
            }
        
        response = JSONResponse(content=response_data)
    
    # Add CORS headers to the response
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.get("/api/user/info")
async def get_current_user_info():
    global analyzer
    
    if not analyzer:
        response_data = {"success": False, "message": "Not authenticated. Please login first."}
        response = JSONResponse(content=response_data, status_code=401)
    else:
        try:
            user_info = analyzer.get_current_user_info()
            response_data = {"success": True, "data": user_info}
        except Exception as e:
            response_data = {
                "success": False, 
                "message": f"Error loading user info: {str(e)}"
            }
        
        response = JSONResponse(content=response_data)
    
    # Add CORS headers to the response
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.post("/api/auth/logout")
async def logout():
    global analyzer
    
    if not analyzer:
        logger.warning(f"LOGOUT ATTEMPT - No active session found, Timestamp: {datetime.datetime.now().isoformat()}")
        response_data = {"success": False, "message": "Not authenticated. Please login first."}
        response = JSONResponse(content=response_data, status_code=401)
    else:
        try:
            logger.info(f"LOGOUT ATTEMPT - Active session found, Timestamp: {datetime.datetime.now().isoformat()}")
            analyzer.logout()
            analyzer = None
            logger.info(f"LOGOUT SUCCESS - Session cleared successfully, Timestamp: {datetime.datetime.now().isoformat()}")
            response_data = {"success": True, "message": "Logout successful"}
        except Exception as e:
            logger.error(f"LOGOUT ERROR - Error during logout: {str(e)}, Timestamp: {datetime.datetime.now().isoformat()}")
            response_data = {
                "success": False,
                "message": f"Error during logout: {str(e)}"
            }
        
        response = JSONResponse(content=response_data)
    
    # Add CORS headers to the response
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.post("/api/session/clear")
async def clear_session():
    global analyzer
    
    if not analyzer:
        response_data = {"success": False, "message": "Not authenticated. Please login first."}
        response = JSONResponse(content=response_data, status_code=401)
    else:
        try:
            analyzer.clear_session()
            response_data = {"success": True, "message": "Session cleared successfully"}
        except Exception as e:
            response_data = {
                "success": False, 
                "message": f"Error clearing session: {str(e)}"
            }
        
        response = JSONResponse(content=response_data)
    
    # Add CORS headers to the response
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.post("/api/cache/clear")
async def clear_cache():
    global analyzer
    
    if not analyzer:
        response_data = {"success": False, "message": "Not authenticated. Please login first."}
        response = JSONResponse(content=response_data, status_code=401)
    else:
        try:
            analyzer.clear_cache()
            response_data = {"success": True, "message": "Cache cleared successfully"}
        except Exception as e:
            response_data = {
                "success": False, 
                "message": f"Error clearing cache: {str(e)}"
            }
        
        response = JSONResponse(content=response_data)
    
    # Add CORS headers to the response
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.get("/api/portfolio/holdings")
async def get_holdings():
    global analyzer
    
    if not analyzer:
        response_data = {"success": False, "message": "Not authenticated. Please login first."}
        response = JSONResponse(content=response_data, status_code=401)
    else:
        try:
            holdings = analyzer.get_holdings()
            response_data = {"success": True, "data": holdings}
        except Exception as e:
            response_data = {
                "success": False, 
                "message": f"Error loading holdings data: {str(e)}"
            }
        
        response = JSONResponse(content=response_data)
    
    # Add CORS headers to the response
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.get("/api/health")
async def health_check():
    response_data = {"status": "healthy"}
    response = JSONResponse(content=response_data)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# Handle preflight OPTIONS requests explicitly
@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request):
    response = JSONResponse(content={"message": "CORS preflight successful"})
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
