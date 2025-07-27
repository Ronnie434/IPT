import robin_stocks.robinhood as r
import streamlit as st
from typing import Dict, List, Optional, Any
import os

class PortfolioAnalyzer:
    """
    A class to handle Robinhood API interactions and portfolio analysis
    """
    
    def __init__(self):
        self._logged_in = False
        self._cache = {}
        self._cache_timeout = 300  # 5 minutes
        
    def login(self, username: str, password: str, mfa_code: Optional[str] = None) -> bool:
        """
        Login to Robinhood with provided credentials
        
        Args:
            username: Robinhood username/email
            password: Robinhood password
            mfa_code: MFA code if required
            
        Returns:
            bool: True if login successful, False otherwise
        """
        try:
            # Aggressive session clearing
            self._clear_all_sessions()
            
            # Clear any cached data
            self._cache.clear()
            self._logged_in = False
            
            # Force reimport of robin_stocks to clear any module-level caching
            import importlib
            import sys
            if 'robin_stocks.robinhood' in sys.modules:
                importlib.reload(sys.modules['robin_stocks.robinhood'])
            
            # Attempt fresh login
            if mfa_code:
                login_result = r.login(username, password, mfa_code=mfa_code)
            else:
                login_result = r.login(username, password)
            
            # Check if login was successful
            if login_result is not None:
                self._logged_in = True
                return True
            else:
                self._logged_in = False
                return False
                
        except Exception as e:
            st.error(f"Login failed: {str(e)}")
            self._logged_in = False
            return False
    
    def logout(self):
        """Logout from Robinhood and clear all session data"""
        try:
            # Use aggressive session clearing
            self._clear_all_sessions()
            self._logged_in = False
            self._cache.clear()
                        
        except Exception as e:
            # Don't show error for logout - just ensure we clear local state
            self._logged_in = False
            self._cache.clear()
    
    def clear_cache(self):
        """Clear the data cache to force refresh"""
        self._cache.clear()
    
    def _clear_all_sessions(self):
        """Aggressively clear all possible session data"""
        try:
            # Force logout multiple times to be sure
            for _ in range(3):
                try:
                    r.logout()
                except:
                    pass
            
            # Clear session files in multiple possible locations
            import glob
            possible_locations = [
                './',
                '/tmp/',
                os.path.expanduser('~/.'),
                '/app/',
                '/home/runner/'
            ]
            
            session_patterns = [
                '*.pickle',
                '*robinhood*',
                '.robinhood*',
                'rh_*',
                '*auth*'
            ]
            
            for location in possible_locations:
                for pattern in session_patterns:
                    try:
                        for file_path in glob.glob(os.path.join(location, pattern)):
                            if os.path.isfile(file_path) and ('robinhood' in file_path.lower() or file_path.endswith('.pickle')):
                                try:
                                    os.remove(file_path)
                                    print(f"Removed session file: {file_path}")
                                except:
                                    pass
                    except:
                        pass
                        
            # Clear environment variables that might cache auth
            env_vars_to_clear = [key for key in os.environ.keys() 
                               if any(term in key.lower() for term in ['robinhood', 'rh_', 'auth', 'token'])]
            
            for var in env_vars_to_clear:
                try:
                    del os.environ[var]
                except:
                    pass
                    
        except Exception as e:
            pass  # Continue even if clearing fails
    
    def _check_login(self):
        """Check if user is logged in"""
        if not self._logged_in:
            raise Exception("Not logged in to Robinhood. Please login first.")
    
    def get_holdings(self, force_refresh: bool = False) -> Dict[str, Any]:
        """
        Get current stock holdings with dividend information
        
        Args:
            force_refresh: Force refresh of cached data
            
        Returns:
            Dict containing holdings data
        """
        cache_key = 'holdings'
        
        if not force_refresh and cache_key in self._cache:
            return self._cache[cache_key]
        
        try:
            self._check_login()
            
            # Get holdings with dividends
            holdings = r.account.build_holdings(with_dividends=True)
            
            if holdings:
                # Process and clean the holdings data
                processed_holdings = {}
                for symbol, data in holdings.items():
                    processed_holdings[symbol] = {
                        'quantity': data.get('quantity', '0'),
                        'average_buy_price': data.get('average_buy_price', '0'),
                        'equity': data.get('equity', '0'),
                        'market_value': data.get('market_value', '0'),
                        'price': data.get('price', '0'),
                        'percent_change': data.get('percent_change', '0'),
                        'total_return_today': data.get('total_return_today', '0'),
                        'total_return_today_percent': data.get('total_return_today_percent', '0'),
                        'equity_change': data.get('equity_change', '0'),
                        'type': data.get('type', 'stock'),
                        'name': data.get('name', symbol),
                        'id': data.get('id', ''),
                        'pe_ratio': data.get('pe_ratio', ''),
                        'dividend_yield': data.get('dividend_yield', ''),
                    }
                
                self._cache[cache_key] = processed_holdings
                return processed_holdings
            else:
                return {}
                
        except Exception as e:
            st.error(f"Error fetching holdings: {str(e)}")
            return {}
    
    def get_dividends(self, force_refresh: bool = False) -> List[Dict[str, Any]]:
        """
        Get dividend information
        
        Args:
            force_refresh: Force refresh of cached data
            
        Returns:
            List of dividend records
        """
        cache_key = 'dividends'
        
        if not force_refresh and cache_key in self._cache:
            return self._cache[cache_key]
        
        try:
            self._check_login()
            
            dividends = r.account.get_dividends()
            
            if dividends:
                # Process dividend data
                processed_dividends = []
                for div in dividends:
                    processed_dividends.append({
                        'id': div.get('id', ''),
                        'amount': div.get('amount', '0'),
                        'rate': div.get('rate', '0'),
                        'position': div.get('position', '0'),
                        'paid_at': div.get('paid_at', ''),
                        'payable_date': div.get('payable_date', ''),
                        'record_date': div.get('record_date', ''),
                        'state': div.get('state', ''),
                        'symbol': self._get_symbol_from_instrument(div.get('instrument', '')),
                        'instrument': div.get('instrument', ''),
                    })
                
                self._cache[cache_key] = processed_dividends
                return processed_dividends
            else:
                return []
                
        except Exception as e:
            st.error(f"Error fetching dividends: {str(e)}")
            return []
    
    def get_total_dividends(self, force_refresh: bool = False) -> str:
        """
        Get total dividends earned
        
        Args:
            force_refresh: Force refresh of cached data
            
        Returns:
            String representation of total dividends
        """
        cache_key = 'total_dividends'
        
        if not force_refresh and cache_key in self._cache:
            return self._cache[cache_key]
        
        try:
            self._check_login()
            
            total_dividends = r.account.get_total_dividends()
            
            if total_dividends:
                self._cache[cache_key] = str(total_dividends)
                return str(total_dividends)
            else:
                return "0.00"
                
        except Exception as e:
            st.error(f"Error fetching total dividends: {str(e)}")
            return "0.00"
    
    def get_open_orders(self, force_refresh: bool = False) -> List[Dict[str, Any]]:
        """
        Get all open stock orders
        
        Args:
            force_refresh: Force refresh of cached data
            
        Returns:
            List of open orders
        """
        cache_key = 'open_orders'
        
        if not force_refresh and cache_key in self._cache:
            return self._cache[cache_key]
        
        try:
            self._check_login()
            
            open_orders = r.orders.get_all_open_stock_orders()
            
            if open_orders:
                # Process orders data
                processed_orders = []
                for order in open_orders:
                    processed_orders.append({
                        'id': order.get('id', ''),
                        'quantity': order.get('quantity', '0'),
                        'price': order.get('price', '0'),
                        'side': order.get('side', ''),
                        'type': order.get('type', ''),
                        'time_in_force': order.get('time_in_force', ''),
                        'state': order.get('state', ''),
                        'created_at': order.get('created_at', ''),
                        'updated_at': order.get('updated_at', ''),
                        'symbol': self._get_symbol_from_instrument(order.get('instrument', '')),
                        'instrument': order.get('instrument', ''),
                    })
                
                self._cache[cache_key] = processed_orders
                return processed_orders
            else:
                return []
                
        except Exception as e:
            st.error(f"Error fetching open orders: {str(e)}")
            return []
    
    def get_all_orders(self, force_refresh: bool = False) -> List[Dict[str, Any]]:
        """
        Get all stock orders (including completed)
        
        Args:
            force_refresh: Force refresh of cached data
            
        Returns:
            List of all orders
        """
        cache_key = 'all_orders'
        
        if not force_refresh and cache_key in self._cache:
            return self._cache[cache_key]
        
        try:
            self._check_login()
            
            all_orders = r.orders.get_all_stock_orders()
            
            if all_orders:
                # Process orders data
                processed_orders = []
                for order in all_orders:
                    processed_orders.append({
                        'id': order.get('id', ''),
                        'quantity': order.get('quantity', '0'),
                        'price': order.get('price', '0'),
                        'side': order.get('side', ''),
                        'type': order.get('type', ''),
                        'time_in_force': order.get('time_in_force', ''),
                        'state': order.get('state', ''),
                        'created_at': order.get('created_at', ''),
                        'updated_at': order.get('updated_at', ''),
                        'executed_at': order.get('executed_at', ''),
                        'symbol': self._get_symbol_from_instrument(order.get('instrument', '')),
                        'instrument': order.get('instrument', ''),
                    })
                
                self._cache[cache_key] = processed_orders
                return processed_orders
            else:
                return []
                
        except Exception as e:
            st.error(f"Error fetching all orders: {str(e)}")
            return []
    
    def _get_symbol_from_instrument(self, instrument_url: str) -> str:
        """
        Extract symbol from instrument URL
        
        Args:
            instrument_url: URL of the instrument
            
        Returns:
            Stock symbol or 'N/A' if not found
        """
        try:
            if instrument_url:
                # Use robin_stocks function to get instrument data
                instrument_data = r.stocks.get_instrument_by_url(instrument_url)
                if instrument_data and isinstance(instrument_data, dict) and 'symbol' in instrument_data:
                    return instrument_data['symbol']
            return 'N/A'
        except Exception:
            return 'N/A'
    
    def get_account_info(self, force_refresh: bool = False) -> Dict[str, Any]:
        """
        Get basic account information
        
        Args:
            force_refresh: Force refresh of cached data
            
        Returns:
            Dict containing account information
        """
        cache_key = 'account_info'
        
        if not force_refresh and cache_key in self._cache:
            return self._cache[cache_key]
        
        try:
            self._check_login()
            
            # Get basic account information
            profile = r.profiles.load_basic_profile()
            account = r.profiles.load_account_profile()
            portfolio = r.profiles.load_portfolio_profile()
            
            account_info = {
                'profile': profile or {},
                'account': account or {},
                'portfolio': portfolio or {}
            }
            
            self._cache[cache_key] = account_info
            return account_info
            
        except Exception as e:
            st.error(f"Error fetching account info: {str(e)}")
            return {}
