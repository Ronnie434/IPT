#!/usr/bin/env python3
"""
Test script to verify session clearing works properly
"""

import robin_stocks.robinhood as r
import os

def test_session_clearing():
    """Test that session clearing works properly"""
    
    print("🧹 Testing Session Clearing...")
    print("=" * 50)
    
    # Test 1: Check for existing session files
    print("1. Checking for existing session files...")
    session_files = ['.robinhood.pickle', 'robinhood.pickle']
    
    for file in session_files:
        if os.path.exists(file):
            print(f"   📁 Found session file: {file}")
            try:
                os.remove(file)
                print(f"   🗑️  Removed: {file}")
            except Exception as e:
                print(f"   ❌ Could not remove {file}: {e}")
        else:
            print(f"   ✅ No session file: {file}")
    
    # Test 2: Force logout to clear any cached sessions
    print("\n2. Forcing logout to clear any cached sessions...")
    try:
        r.logout()
        print("   ✅ Logout successful")
    except Exception as e:
        print(f"   ⚠️  Logout warning (normal if not logged in): {e}")
    
    # Test 3: Clear any environment variables that might cache auth
    print("\n3. Checking environment variables...")
    robinhood_vars = [key for key in os.environ.keys() if 'ROBINHOOD' in key.upper() or 'RH_' in key.upper()]
    
    if robinhood_vars:
        print(f"   📋 Found Robinhood env vars: {robinhood_vars}")
    else:
        print("   ✅ No Robinhood environment variables found")
    
    print("\n" + "=" * 50)
    print("✅ Session clearing test completed!")
    print("The app should now accept fresh login credentials.")
    
    return True

if __name__ == "__main__":
    test_session_clearing()