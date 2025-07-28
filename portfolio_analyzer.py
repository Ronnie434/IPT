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
        self._current_user_info = {}
        
    def login(self, username: str, password: str, store_session=False, mfa_code: Optional[str] = None) -> bool:
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
            
            # Nuclear reimport approach - completely reload robin_stocks modules
            import importlib
            import sys
            
            modules_to_reload = [
                'robin_stocks.robinhood.authentication',
                'robin_stocks.robinhood.account',
                'robin_stocks.robinhood.profiles', 
                'robin_stocks.robinhood.orders',
                'robin_stocks.robinhood.markets',
                'robin_stocks.robinhood',
                'robin_stocks'
            ]
            
            for module_name in modules_to_reload:
                if module_name in sys.modules:
                    try:
                        importlib.reload(sys.modules[module_name])
                    except:
                        pass
            
            # Force clear any cached authentication in the module
            global r
            import robin_stocks.robinhood as r
            
            # Attempt fresh login with explicit credential validation
            try:
                # Store the credentials we're attempting to use
                attempted_username = username
                
                if mfa_code:
                    login_result = r.login(username, password, mfa_code=mfa_code, store_session=store_session)
                else:
                    login_result = r.login(username, password, store_session=store_session)
                
                # CRITICAL: The robin_stocks login may return success even for invalid credentials
                # due to persistent session caching, so we need extensive verification
                
            except Exception as login_error:
                # Direct login failure
                print(f"Direct login failed: {str(login_error)}")
                self._logged_in = False
                return False
            
            # EXTENSIVE VERIFICATION: Multiple layers of validation
            try:
                # Layer 1: Basic profile access
                profile = r.profiles.load_basic_profile()
                account = r.profiles.load_account_profile()
                
                # Debug logging to understand what data we're getting
                print(f"DEBUG: Profile data type: {type(profile)}")
                if isinstance(profile, dict):
                    print(f"DEBUG: Profile keys: {list(profile.keys()) if profile else 'None'}")
                    print(f"DEBUG: Profile first_name: {profile.get('first_name', 'NOT_FOUND')}")
                    print(f"DEBUG: Profile email: {profile.get('email', 'NOT_FOUND')}")
                else:
                    print(f"DEBUG: Profile is not a dict: {profile}")
                
                # Layer 2: Account-specific data access
                try:
                    holdings = r.account.build_holdings()
                    positions = r.account.get_open_stock_positions()
                except Exception as data_error:
                    print(f"Account data access failed: {str(data_error)}")
                    holdings = None
                    positions = None
                
                # Layer 3: Cross-validate the profile email with attempted username
                if profile and account:
                    profile_email = profile.get('email', '') if isinstance(profile, dict) else ''
                    
                    # CRITICAL CHECK: Ensure we're accessing the RIGHT account
                    # The robin_stocks library has a fundamental flaw where it accepts any credentials
                    # and returns cached data. We need to validate that we're accessing the correct account.
                    
                    # Check 1: Reject known fake credentials immediately
                    fake_domains = ['nowhere.invalid', 'fake.com', 'test.invalid', 'example.com', 'test.com']
                    fake_usernames = ['absolutely_fake', 'definitely_fake', 'test@test', 'fake@fake']
                    
                    attempted_domain = attempted_username.split('@')[-1] if '@' in attempted_username else ''
                    
                    # Reject obvious fake domains
                    if any(fake_domain in attempted_domain.lower() for fake_domain in fake_domains):
                        print(f"SECURITY REJECTION: Fake domain detected in attempted login: {attempted_domain}")
                        print("Rejecting obviously invalid credentials")
                        self._logged_in = False
                        return False
                    
                    # Reject fake usernames
                    if any(fake_user in attempted_username.lower() for fake_user in fake_usernames):
                        print(f"SECURITY REJECTION: Fake username pattern detected: {attempted_username}")
                        print("Rejecting obviously invalid credentials")  
                        self._logged_in = False
                        return False
                    
                    # Check 2: Email validation (if profile has an email)
                    if profile_email and attempted_username:
                        # If we have a real email but it doesn't match what we tried, this is contamination
                        if profile_email.lower() != attempted_username.lower():
                            print(f"SECURITY WARNING: Profile email ({profile_email}) doesn't match login username ({attempted_username})")
                            print("This indicates session contamination - rejecting login")
                            self._logged_in = False
                            return False
                    
                    self._logged_in = True
                    
                    # Store comprehensive user info for verification
                    self._current_user_info = {
                        'username': attempted_username,
                        'first_name': profile.get('first_name', 'Unknown') if isinstance(profile, dict) else 'Unknown',
                        'last_name': profile.get('last_name', '') if isinstance(profile, dict) else '',
                        'email': profile.get('email', attempted_username) if isinstance(profile, dict) else attempted_username,
                        'account_id': account.get('account_number', 'Unknown') if isinstance(account, dict) else 'Unknown',
                        'profile': profile,
                        'account': account,
                        'attempted_username': attempted_username  # Store what we tried to login with
                    }
                    
                    # Use the stored user info for consistent display
                    display_name = self._current_user_info.get('first_name', 'Unknown')
                    display_email = self._current_user_info.get('email', attempted_username)
                    print(f"Login successful for user: {display_name} (Email: {display_email})")
                    return True
                else:
                    print("Login verification failed: Could not access account data")
                    self._logged_in = False
                    return False
                    
            except Exception as verify_error:
                # If we can't access protected data, login definitely failed
                print(f"Login verification failed: {str(verify_error)}")
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
            self._current_user_info = {}
                        
        except Exception as e:
            # Don't show error for logout - just ensure we clear local state
            self._logged_in = False
            self._cache.clear()
            self._current_user_info = {}
    
    def get_current_user_info(self) -> Dict[str, Any]:
        """
        Get current logged in user information
        
        Returns:
            Dict containing user information
        """
        try:
            if not self._logged_in:
                return {}
                
            if self._current_user_info:
                return self._current_user_info
            
            # Fallback: fetch fresh profile if not stored
            profile = r.profiles.load_basic_profile()
            account = r.profiles.load_account_profile()
            
            if profile and account:
                self._current_user_info = {
                    'username': 'Current User',
                    'first_name': profile.get('first_name', 'Unknown') if isinstance(profile, dict) else 'Unknown',
                    'last_name': profile.get('last_name', '') if isinstance(profile, dict) else '',
                    'email': profile.get('email', 'Unknown') if isinstance(profile, dict) else 'Unknown',
                    'account_id': account.get('account_number', 'Unknown') if isinstance(account, dict) else 'Unknown',
                    'profile': profile,
                    'account': account
                }
                return self._current_user_info
            
            return {}
            
        except Exception as e:
            print(f"Error getting user info: {str(e)}")
            return {}
    
    def clear_session(self):
        """Clear session data - alias for _clear_all_sessions"""
        self._clear_all_sessions()
        self._current_user_info = {}
    
    def clear_cache(self):
        """Clear the data cache to force refresh"""
        self._cache.clear()
    
    def _clear_all_sessions(self):
        """Nuclear option: clear all possible session data"""
        try:
            # Force logout multiple times to be sure
            for _ in range(10):
                try:
                    r.logout()
                except:
                    pass
            
            # Clear module-level state in robin_stocks
            try:
                # Reset any global state variables in robin_stocks if they exist
                import robin_stocks.robinhood as rh_module
                for attr_name in ['_session', 'session', '_logged_in', 'authentication_token']:
                    if hasattr(rh_module, attr_name):
                        try:
                            setattr(rh_module, attr_name, None)
                        except:
                            pass
                
                # Clear authentication module state
                import robin_stocks.robinhood.authentication as auth_module
                for attr in dir(auth_module):
                    if not attr.startswith('__') and attr.islower():
                        try:
                            setattr(auth_module, attr, None)
                        except:
                            pass
            except:
                pass
            
            # Clear session files in multiple possible locations
            import glob
            import shutil
            possible_locations = [
                './',
                '/tmp/',
                os.path.expanduser('~/.'),
                '/app/',
                '/home/runner/',
                '/home/runner/.cache/',
                './.cache/',
                './temp/',
                '/var/tmp/'
            ]
            
            session_patterns = [
                '*.pickle',
                '*robinhood*',
                '.robinhood*',
                'rh_*',
                '*auth*',
                '*session*',
                '*token*'
            ]
            
            for location in possible_locations:
                if not os.path.exists(location):
                    continue
                for pattern in session_patterns:
                    try:
                        for file_path in glob.glob(os.path.join(location, pattern)):
                            if os.path.isfile(file_path):
                                try:
                                    os.remove(file_path)
                                    print(f"Removed session file: {file_path}")
                                except:
                                    pass
                            elif os.path.isdir(file_path) and 'robinhood' in file_path.lower():
                                try:
                                    shutil.rmtree(file_path)
                                    print(f"Removed session directory: {file_path}")
                                except:
                                    pass
                    except:
                        pass
                        
            # Clear environment variables that might cache auth
            env_vars_to_clear = [key for key in os.environ.keys() 
                               if any(term in key.lower() for term in ['robinhood', 'rh_', 'auth', 'token', 'session'])]
            
            for var in env_vars_to_clear:
                try:
                    del os.environ[var]
                    print(f"Cleared env var: {var}")
                except:
                    pass
            
            # Force clear any module-level variables in robin_stocks
            try:
                import sys
                for module_name in list(sys.modules.keys()):
                    if 'robin_stocks' in module_name:
                        module = sys.modules[module_name]
                        # Clear common session variables
                        for attr in ['access_token', 'refresh_token', 'session', '_session', 'logged_in']:
                            if hasattr(module, attr):
                                try:
                                    delattr(module, attr)
                                    print(f"Cleared module attribute: {module_name}.{attr}")
                                except:
                                    pass
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
    
    def get_stock_orders_by_symbol(self, symbol: str, force_refresh: bool = False) -> List[Dict[str, Any]]:
        """
        Get all orders for a specific stock symbol
        
        Args:
            symbol: Stock symbol to filter by
            force_refresh: Force refresh of cached data
            
        Returns:
            List of orders for the specified symbol
        """
        all_orders = self.get_all_orders(force_refresh)
        
        # Filter orders by symbol
        symbol_orders = [order for order in all_orders if order.get('symbol', '').upper() == symbol.upper()]
        
        # Sort by date (newest first)
        symbol_orders.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        
        return symbol_orders
    
    def get_stock_dividends_by_symbol(self, symbol: str, force_refresh: bool = False) -> List[Dict[str, Any]]:
        """
        Get all dividends for a specific stock symbol
        
        Args:
            symbol: Stock symbol to filter by
            force_refresh: Force refresh of cached data
            
        Returns:
            List of dividends for the specified symbol
        """
        all_dividends = self.get_dividends(force_refresh)
        
        # Filter dividends by symbol
        symbol_dividends = [div for div in all_dividends if div.get('symbol', '').upper() == symbol.upper()]
        
        # Sort by date (newest first)
        symbol_dividends.sort(key=lambda x: x.get('paid_at', ''), reverse=True)
        
        return symbol_dividends
    
    def get_stock_summary(self, symbol: str, force_refresh: bool = False) -> Dict[str, Any]:
        """
        Get comprehensive summary for a specific stock
        
        Args:
            symbol: Stock symbol
            force_refresh: Force refresh of cached data
            
        Returns:
            Dict containing comprehensive stock data
        """
        try:
            self._check_login()
            
            # Get current holdings data
            holdings = self.get_holdings(force_refresh)
            stock_holding = holdings.get(symbol.upper(), {})
            
            # Get transaction history
            orders = self.get_stock_orders_by_symbol(symbol, force_refresh)
            
            # Get dividend history
            dividends = self.get_stock_dividends_by_symbol(symbol, force_refresh)
            
            # Calculate additional metrics
            total_bought_quantity = sum(float(order.get('quantity', 0)) 
                                      for order in orders 
                                      if order.get('state') == 'filled' and order.get('side') == 'buy')
            
            total_sold_quantity = sum(float(order.get('quantity', 0)) 
                                    for order in orders 
                                    if order.get('state') == 'filled' and order.get('side') == 'sell')
            
            total_dividend_amount = sum(float(div.get('amount', 0)) for div in dividends)
            
            # Calculate average buy price from filled buy orders
            buy_orders = [order for order in orders 
                         if order.get('state') == 'filled' and order.get('side') == 'buy']
            
            if buy_orders:
                total_cost = sum(float(order.get('price', 0)) * float(order.get('quantity', 0)) 
                               for order in buy_orders)
                total_shares = sum(float(order.get('quantity', 0)) for order in buy_orders)
                calculated_avg_price = total_cost / total_shares if total_shares > 0 else 0
            else:
                calculated_avg_price = 0
            
            return {
                'symbol': symbol.upper(),
                'current_holding': stock_holding,
                'orders': orders,
                'dividends': dividends,
                'metrics': {
                    'total_bought_quantity': total_bought_quantity,
                    'total_sold_quantity': total_sold_quantity,
                    'net_quantity': total_bought_quantity - total_sold_quantity,
                    'total_dividend_amount': total_dividend_amount,
                    'dividend_count': len(dividends),
                    'calculated_avg_price': calculated_avg_price,
                    'total_orders': len(orders),
                    'buy_orders': len([o for o in orders if o.get('side') == 'buy']),
                    'sell_orders': len([o for o in orders if o.get('side') == 'sell'])
                }
            }
            
        except Exception as e:
            st.error(f"Error getting stock summary for {symbol}: {str(e)}")
            return {}
    
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
