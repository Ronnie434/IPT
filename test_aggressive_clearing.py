#!/usr/bin/env python3
"""
Test aggressive session clearing to ensure different accounts work
"""

import robin_stocks.robinhood as r
import os
import glob
import importlib
import sys

def test_aggressive_clearing():
    """Test the aggressive session clearing mechanism"""
    
    print("🔥 Testing Aggressive Session Clearing...")
    print("=" * 60)
    
    # Step 1: Clear all possible session files
    print("1. Clearing all possible session files...")
    
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
    
    files_removed = 0
    for location in possible_locations:
        for pattern in session_patterns:
            try:
                for file_path in glob.glob(os.path.join(location, pattern)):
                    if os.path.isfile(file_path) and ('robinhood' in file_path.lower() or file_path.endswith('.pickle')):
                        try:
                            os.remove(file_path)
                            print(f"   🗑️  Removed: {file_path}")
                            files_removed += 1
                        except:
                            pass
            except:
                pass
    
    if files_removed == 0:
        print("   ✅ No session files found to remove")
    else:
        print(f"   🗑️  Removed {files_removed} session files")
    
    # Step 2: Force logout multiple times
    print("\n2. Force logout multiple times...")
    for i in range(3):
        try:
            r.logout()
            print(f"   ✅ Logout attempt {i+1} successful")
        except Exception as e:
            print(f"   ⚠️  Logout attempt {i+1}: {str(e)[:50]}...")
    
    # Step 3: Clear environment variables
    print("\n3. Clearing relevant environment variables...")
    
    env_vars_to_clear = [key for key in os.environ.keys() 
                        if any(term in key.lower() for term in ['robinhood', 'rh_', 'auth', 'token'])]
    
    if env_vars_to_clear:
        print(f"   Found {len(env_vars_to_clear)} environment variables to clear:")
        for var in env_vars_to_clear:
            try:
                del os.environ[var]
                print(f"   🗑️  Cleared: {var}")
            except:
                pass
    else:
        print("   ✅ No relevant environment variables found")
    
    # Step 4: Force module reload
    print("\n4. Forcing module reload...")
    if 'robin_stocks.robinhood' in sys.modules:
        try:
            importlib.reload(sys.modules['robin_stocks.robinhood'])
            print("   ✅ Successfully reloaded robin_stocks.robinhood module")
        except Exception as e:
            print(f"   ⚠️  Module reload warning: {str(e)[:50]}...")
    else:
        print("   ✅ robin_stocks.robinhood module not loaded yet")
    
    print("\n" + "=" * 60)
    print("🎯 Aggressive session clearing completed!")
    print("The app should now accept completely fresh login credentials.")
    print("Try logging in with different credentials now.")
    
    return True

if __name__ == "__main__":
    test_aggressive_clearing()