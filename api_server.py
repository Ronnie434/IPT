from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from portfolio_analyzer import PortfolioAnalyzer
from utils import safe_float
import os
from typing import Optional

app = FastAPI(title="Portfolio Analyzer API")


# Global analyzer instance
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
    global analyzer
    
    try:
        # Clear any existing analyzer
        if analyzer:
            try:
                analyzer.logout()
            except:
                pass
        
        # Create new analyzer instance
        analyzer = PortfolioAnalyzer()
        success = analyzer.login(request.username, request.password, request.mfa_code)
        
        if success:
            response_data = {"success": True, "message": "Login successful"}
        else:
            response_data = {"success": False, "message": "Login failed. Please check your credentials."}
            
    except Exception as e:
        response_data = {"success": False, "message": f"Login error: {str(e)}"}
    
    # Create JSONResponse with CORS headers
    response = JSONResponse(content=response_data)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.get("/api/portfolio/summary", response_model=PortfolioResponse)
async def get_portfolio_summary():
    global analyzer
    
    if not analyzer:
        response_data = {"success": False, "message": "Not authenticated"}
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
