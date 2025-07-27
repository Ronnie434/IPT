#!/usr/bin/env python3
"""
Test credential validation to ensure invalid credentials are rejected
"""

from portfolio_analyzer import PortfolioAnalyzer

def test_credential_validation():
    """Test that invalid credentials are properly rejected"""
    
    print("🔐 Testing Credential Validation...")
    print("=" * 50)
    
    # Test 1: Invalid credentials should be rejected
    print("1. Testing with invalid credentials...")
    analyzer = PortfolioAnalyzer()
    
    invalid_credentials = [
        ("fake@email.com", "wrongpassword"),
        ("test@test.com", "123456"),
        ("invalid", "invalid"),
        ("", ""),
    ]
    
    for username, password in invalid_credentials:
        print(f"   Testing: {username} / {'*' * len(password)}")
        try:
            result = analyzer.login(username, password)
            if result:
                print(f"   ❌ ERROR: Invalid credentials were accepted!")
                return False
            else:
                print(f"   ✅ Correctly rejected invalid credentials")
        except Exception as e:
            print(f"   ✅ Correctly rejected with error: {str(e)[:50]}...")
    
    # Test 2: Verify no session exists after failed attempts
    print("\n2. Verifying no session exists after failed attempts...")
    try:
        # Try to get holdings without valid login
        holdings = analyzer.get_holdings()
        if holdings:
            print(f"   ❌ ERROR: Got holdings without valid login!")
            return False
        else:
            print(f"   ✅ No holdings returned without valid login")
    except Exception as e:
        print(f"   ✅ Correctly blocked access: {str(e)[:50]}...")
    
    print("\n" + "=" * 50)
    print("✅ Credential validation test completed!")
    print("Invalid credentials are now properly rejected.")
    
    return True

if __name__ == "__main__":
    test_credential_validation()