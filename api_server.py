from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from portfolio_analyzer import PortfolioAnalyzer
from utils import safe_float
import os
from typing import Optional

app = FastAPI(title="Portfolio Analyzer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
            return LoginResponse(success=True, message="Login successful")
        else:
            return LoginResponse(success=False, message="Login failed. Please check your credentials.")
            
    except Exception as e:
        return LoginResponse(success=False, message=f"Login error: {str(e)}")

@app.get("/api/portfolio/summary", response_model=PortfolioResponse)
async def get_portfolio_summary():
    global analyzer
    
    if not analyzer:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        holdings = analyzer.get_holdings()
        
        if not holdings:
            return PortfolioResponse(
                success=False, 
                message="No holdings data available"
            )
        
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
        
        return PortfolioResponse(success=True, data=portfolio_data)
        
    except Exception as e:
        return PortfolioResponse(
            success=False, 
            message=f"Error loading portfolio data: {str(e)}"
        )

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
