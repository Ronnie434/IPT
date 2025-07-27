#!/usr/bin/env python3
"""
Test script to validate Robinhood API connection and data retrieval
"""

import robin_stocks.robinhood as r
import json
from datetime import datetime

def test_robinhood_connection():
    """Test Robinhood API connection and data retrieval"""
    
    print("🔐 Starting Robinhood API Test...")
    print("=" * 50)
    
    # Login credentials - replace with your actual credentials
    username = 'p.ronak00000@gmail.com'
    password = 'rppateL1@hrpateL1@'
    
    try:
        print("🔄 Attempting login...")
        # Login (supports MFA)
        login_result = r.login(username, password)
        
        if login_result:
            print("✅ Login successful!")
        else:
            print("❌ Login failed - check credentials or MFA requirement")
            return False
            
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        if "challenge" in str(e).lower() or "verification" in str(e).lower():
            print("💡 MFA verification may be required. Check your device for approval.")
        return False
    
    try:
        # Test 1: Get Holdings
        print("\n📊 Testing Holdings Data...")
        holdings = r.account.build_holdings(with_dividends=True)
        
        if holdings:
            print(f"✅ Found {len(holdings)} holdings")
            print("Holdings Summary:")
            for symbol, data in list(holdings.items())[:3]:  # Show first 3
                print(f"  • {symbol}: {data.get('quantity', 'N/A')} shares @ ${data.get('price', 'N/A')}")
        else:
            print("⚠️  No holdings found")
        
        # Test 2: Get Open Orders
        print("\n📋 Testing Open Orders...")
        open_orders = r.orders.get_all_open_stock_orders()
        
        if open_orders:
            print(f"✅ Found {len(open_orders)} open orders")
        else:
            print("✅ No open orders (this is normal)")
        
        # Test 3: Get All Orders
        print("\n📜 Testing Order History...")
        all_orders = r.orders.get_all_stock_orders()
        
        if all_orders:
            print(f"✅ Found {len(all_orders)} total orders")
            # Show recent orders
            recent = all_orders[:3] if len(all_orders) >= 3 else all_orders
            print("Recent Orders:")
            for order in recent:
                symbol = order.get('symbol', 'N/A')
                side = order.get('side', 'N/A')
                state = order.get('state', 'N/A')
                created = order.get('created_at', 'N/A')[:10] if order.get('created_at') else 'N/A'
                print(f"  • {symbol} {side} - {state} ({created})")
        else:
            print("⚠️  No order history found")
        
        # Test 4: Get Dividends
        print("\n💰 Testing Dividend Data...")
        divs = r.account.get_dividends()
        total_divs = r.account.get_total_dividends()
        
        if divs:
            print(f"✅ Found {len(divs)} dividend records")
        else:
            print("✅ No dividend records (normal if no dividend stocks)")
            
        print(f"✅ Total dividends earned: ${total_divs}")
        
        # Test 5: Account Info
        print("\n👤 Testing Account Information...")
        try:
            profile = r.profiles.load_basic_profile()
            account = r.profiles.load_account_profile()
            
            if profile:
                print("✅ Profile data retrieved")
            if account:
                print("✅ Account data retrieved")
                
        except Exception as e:
            print(f"⚠️  Account info error: {str(e)}")
        
        print("\n" + "=" * 50)
        print("🎉 All API tests completed successfully!")
        print("Your Robinhood connection is working properly.")
        
        # Generate summary for Streamlit app
        summary = {
            'holdings_count': len(holdings) if holdings else 0,
            'open_orders_count': len(open_orders) if open_orders else 0,
            'total_orders_count': len(all_orders) if all_orders else 0,
            'dividend_records': len(divs) if divs else 0,
            'total_dividends': str(total_divs),
            'test_timestamp': datetime.now().isoformat()
        }
        
        print(f"\n📊 Summary for Dashboard:")
        print(json.dumps(summary, indent=2))
        
        return True
        
    except Exception as e:
        print(f"❌ API test error: {str(e)}")
        return False
    
    finally:
        # Logout
        try:
            r.logout()
            print("\n🚪 Logged out successfully")
        except:
            pass

if __name__ == "__main__":
    test_robinhood_connection()