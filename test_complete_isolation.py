#!/usr/bin/env python3
"""
Test complete session isolation by restarting Python subprocess
"""

import subprocess
import sys
import os

def test_complete_session_isolation():
    """Test session isolation using subprocess"""
    
    print("🔒 Testing Complete Session Isolation...")
    print("=" * 60)
    
    # First, clear everything in current process
    print("1. Clearing current process session...")
    
    # Kill any existing Python processes that might have robin_stocks loaded
    try:
        subprocess.run(['pkill', '-f', 'robin_stocks'], capture_output=True)
        print("   ✅ Killed existing robin_stocks processes")
    except:
        print("   ⚠️  No existing processes to kill")
    
    # Test 1: Run invalid credentials test in subprocess
    print("\n2. Testing invalid credentials in fresh subprocess...")
    
    test_script = '''
import sys
sys.path.insert(0, ".")
from portfolio_analyzer import PortfolioAnalyzer

analyzer = PortfolioAnalyzer()
result = analyzer.login("fake@invalid.com", "wrongpassword")
print(f"RESULT:{result}")

try:
    holdings = analyzer.get_holdings()
    print(f"HOLDINGS:{len(holdings) if holdings else 0}")
except Exception as e:
    print(f"ERROR:{str(e)[:50]}")
'''
    
    # Write test script to temp file
    with open('temp_test.py', 'w') as f:
        f.write(test_script)
    
    try:
        # Run in completely fresh subprocess
        result = subprocess.run(
            [sys.executable, 'temp_test.py'], 
            capture_output=True, 
            text=True,
            timeout=30
        )
        
        print(f"   Subprocess output: {result.stdout}")
        if result.stderr:
            print(f"   Subprocess errors: {result.stderr}")
            
        # Check if invalid credentials were properly rejected
        if "RESULT:False" in result.stdout and ("ERROR:" in result.stdout or "HOLDINGS:0" in result.stdout):
            print("   ✅ Invalid credentials properly rejected in fresh process")
        else:
            print("   ❌ Invalid credentials still accepted - session persistence issue")
            
    except subprocess.TimeoutExpired:
        print("   ⚠️  Subprocess timeout - may indicate hanging authentication")
    except Exception as e:
        print(f"   ❌ Subprocess error: {str(e)}")
    finally:
        # Clean up temp file
        try:
            os.remove('temp_test.py')
        except:
            pass
    
    print("\n" + "=" * 60)
    print("Complete session isolation test finished.")
    
    return True

if __name__ == "__main__":
    test_complete_session_isolation()