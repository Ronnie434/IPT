"""
Utility functions for the Robinhood Portfolio Analyzer
"""

def safe_float(value, default=0.0):
    """
    Safely convert a value to float with fallback
    
    Args:
        value: Value to convert
        default: Default value if conversion fails
        
    Returns:
        float: Converted value or default
    """
    try:
        if value is None or value == '':
            return default
        return float(value)
    except (ValueError, TypeError):
        return default

def format_currency(amount):
    """
    Format a number as currency
    
    Args:
        amount: Number to format
        
    Returns:
        str: Formatted currency string
    """
    try:
        if amount is None:
            return "$0.00"
        
        # Handle string inputs
        if isinstance(amount, str):
            amount = safe_float(amount)
        
        # Format as currency
        if amount >= 0:
            return f"${amount:,.2f}"
        else:
            return f"-${abs(amount):,.2f}"
    except:
        return "$0.00"

def format_percentage(percentage):
    """
    Format a number as percentage
    
    Args:
        percentage: Number to format as percentage
        
    Returns:
        str: Formatted percentage string
    """
    try:
        if percentage is None:
            return "0.00%"
        
        # Handle string inputs
        if isinstance(percentage, str):
            percentage = safe_float(percentage)
        
        # Format as percentage
        if percentage >= 0:
            return f"+{percentage:.2f}%"
        else:
            return f"{percentage:.2f}%"
    except:
        return "0.00%"

def format_quantity(quantity):
    """
    Format quantity with appropriate decimal places
    
    Args:
        quantity: Number to format
        
    Returns:
        str: Formatted quantity string
    """
    try:
        if quantity is None:
            return "0"
        
        # Handle string inputs
        if isinstance(quantity, str):
            quantity = safe_float(quantity)
        
        # Format based on quantity size
        if quantity == int(quantity):
            return str(int(quantity))
        elif quantity < 1:
            return f"{quantity:.6f}".rstrip('0').rstrip('.')
        else:
            return f"{quantity:.4f}".rstrip('0').rstrip('.')
    except:
        return "0"

def truncate_text(text, max_length=20):
    """
    Truncate text to specified length
    
    Args:
        text: Text to truncate
        max_length: Maximum length
        
    Returns:
        str: Truncated text
    """
    if text is None:
        return ""
    
    text = str(text)
    if len(text) <= max_length:
        return text
    
    return text[:max_length-3] + "..."

def calculate_return_percentage(current_value, cost_basis):
    """
    Calculate return percentage
    
    Args:
        current_value: Current value
        cost_basis: Original cost
        
    Returns:
        float: Return percentage
    """
    try:
        current_value = safe_float(current_value)
        cost_basis = safe_float(cost_basis)
        
        if cost_basis == 0:
            return 0.0
        
        return ((current_value - cost_basis) / cost_basis) * 100
    except:
        return 0.0

def get_color_for_value(value, positive_color="#00C851", negative_color="#FF4444", neutral_color="#6c757d"):
    """
    Get color based on positive/negative value
    
    Args:
        value: Numeric value to evaluate
        positive_color: Color for positive values
        negative_color: Color for negative values
        neutral_color: Color for zero/neutral values
        
    Returns:
        str: Color code
    """
    try:
        value = safe_float(value)
        
        if value > 0:
            return positive_color
        elif value < 0:
            return negative_color
        else:
            return neutral_color
    except:
        return neutral_color

def validate_credentials(username, password):
    """
    Basic validation for credentials
    
    Args:
        username: Username to validate
        password: Password to validate
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not username or not username.strip():
        return False, "Username is required"
    
    if not password or not password.strip():
        return False, "Password is required"
    
    # Basic email validation if username looks like email
    if '@' in username:
        if not username.count('@') == 1:
            return False, "Invalid email format"
        
        local, domain = username.split('@')
        if not local or not domain:
            return False, "Invalid email format"
        
        if not '.' in domain:
            return False, "Invalid email domain"
    
    # Password basic requirements
    if len(password) < 6:
        return False, "Password must be at least 6 characters"
    
    return True, ""

def format_date(date_string, input_format=None, output_format="%Y-%m-%d"):
    """
    Format date string
    
    Args:
        date_string: Date string to format
        input_format: Input date format (auto-detect if None)
        output_format: Desired output format
        
    Returns:
        str: Formatted date string
    """
    if not date_string:
        return "N/A"
    
    try:
        from datetime import datetime
        
        # Common input formats to try
        common_formats = [
            "%Y-%m-%dT%H:%M:%S.%fZ",
            "%Y-%m-%dT%H:%M:%SZ",
            "%Y-%m-%d %H:%M:%S",
            "%Y-%m-%d",
            "%m/%d/%Y",
            "%d/%m/%Y"
        ]
        
        # Try to parse with provided format first
        if input_format:
            try:
                dt = datetime.strptime(date_string, input_format)
                return dt.strftime(output_format)
            except ValueError:
                pass
        
        # Try common formats
        for fmt in common_formats:
            try:
                dt = datetime.strptime(date_string, fmt)
                return dt.strftime(output_format)
            except ValueError:
                continue
        
        # If all fails, return first 10 characters (assuming YYYY-MM-DD)
        return date_string[:10] if len(date_string) >= 10 else date_string
        
    except Exception:
        return date_string[:10] if len(date_string) >= 10 else "N/A"
