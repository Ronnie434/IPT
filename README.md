# Robinhood Portfolio Analyzer

A secure, interactive web application for analyzing Robinhood investment portfolios with comprehensive visualizations and performance metrics.

## 🌟 Features

- **Secure Authentication**: Multi-factor authentication support with session-based security
- **Portfolio Overview**: Real-time portfolio value, market performance, and total returns
- **Holdings Analysis**: Detailed view of current positions with allocation charts
- **Dividend Tracking**: Complete dividend history and earnings summary
- **Order Management**: View open orders and transaction history
- **Stock-Level Analysis**: Individual stock performance with transaction and dividend details
- **Interactive Charts**: Dynamic visualizations using Plotly
- **Performance Metrics**: Total returns, cost basis, and profit calculations

## 🚀 Quick Start

### Prerequisites

- Python 3.11 or higher
- Robinhood trading account
- Valid Robinhood credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd IPT
   ```

2. **Install dependencies**
   ```bash
   pip install -e .
   ```
   
   Or using uv:
   ```bash
   uv pip install -e .
   ```

3. **Run the application**
   ```bash
   streamlit run app.py
   ```

4. **Access the application**
   - Open your browser to `http://localhost:8501`
   - Login with your Robinhood credentials

## 📋 Dependencies

- **streamlit**: Web application framework
- **pandas**: Data manipulation and analysis
- **plotly**: Interactive charts and visualizations
- **robin-stocks**: Robinhood API integration

## 🔐 Security Features

### Authentication System
- **Multi-layer credential validation**: Prevents unauthorized access through multiple verification checks
- **Session contamination prevention**: Ensures you access only your intended account
- **Account confirmation**: Mandatory verification popup showing account details before access
- **Fake credential detection**: Automatically rejects known test/fake domains and usernames
- **Cross-validation**: Matches login credentials with retrieved account profile

### Data Protection
- **No credential storage**: Credentials are only used during active session
- **Session-based authentication**: No persistent authentication data
- **Aggressive session clearing**: Complete cleanup of all authentication tokens and cache files
- **MFA support**: Two-factor authentication for enhanced security

## 🏗️ Architecture

### Core Components

```
app.py                 # Main Streamlit application
├── login_form()       # Secure authentication interface
├── user_confirmation_popup() # Account verification
├── display_portfolio_summary() # Portfolio metrics
├── display_holdings() # Holdings with stock selector
├── display_dividends() # Dividend history
├── display_orders()   # Order management
└── display_stock_details() # Individual stock analysis

portfolio_analyzer.py # Business logic and API integration
├── login()           # Robust authentication with validation
├── get_holdings()    # Portfolio positions with caching
├── get_dividends()   # Dividend data retrieval
├── get_orders()      # Transaction history
└── get_stock_summary() # Comprehensive stock analysis

utils.py              # Helper functions
├── format_currency() # Currency formatting
├── format_percentage() # Percentage formatting
├── safe_float()      # Type conversion with error handling
└── validate_credentials() # Basic credential validation
```

### Data Flow

1. **Authentication**: User credentials → Portfolio Analyzer → Robinhood API validation
2. **Data Retrieval**: API calls → Data processing → Caching (5-minute timeout)
3. **Visualization**: Processed data → Streamlit interface → Plotly charts
4. **User Interaction**: Stock selection → Detailed analysis → Transaction/dividend history

## 📊 Features Deep Dive

### Portfolio Dashboard
- **Real-time metrics**: Total value, market value, positions, dividends
- **Holdings table**: Complete position details with formatting
- **Allocation chart**: Visual portfolio distribution
- **Performance tracking**: Daily returns and percentage changes

### Stock Analysis
The application provides detailed stock-level analysis with three main sections:

#### 📈 Equity Transactions
- Complete transaction history with dates, quantities, prices
- Buy/sell order tracking
- Average cost calculations

#### 💰 Dividend History
- Dividend payment tracking with amounts and dates
- Position sizes at dividend payment
- Total dividend earnings per stock

#### 📋 Summary Metrics
- Current equity value and market position
- Total quantity and calculated averages
- Comprehensive profit calculations including dividends
- Current price and market value information

### Order Management
- **Open orders**: Real-time view of pending transactions
- **Order history**: Complete transaction record with filtering
- **Order details**: Price, quantity, type, and execution status

## 🛡️ Security Enhancements (Latest Updates)

### July 2025 Security Overhaul
The application has undergone a comprehensive security enhancement:

- **Enhanced Credential Validation**: Multiple layers of fake credential detection
- **Domain-Based Security**: Automatic rejection of known fake domains
- **Session Contamination Detection**: Cross-validation of login vs. profile data
- **User Account Verification**: Mandatory confirmation popup before data access
- **Nuclear Session Clearing**: Complete authentication state cleanup
- **Profile Cross-Validation**: Ensures accessed account matches intended login

### Authentication Workflow
1. User enters credentials
2. System validates against fake patterns and domains
3. Robinhood API authentication
4. Profile data retrieval and cross-validation
5. User confirmation popup with account details
6. Access granted only after manual verification

## 🔧 Configuration

### Environment Variables
No environment variables are required. The application uses session-based configuration.

### Caching
- **Cache timeout**: 5 minutes for API responses
- **Cache types**: Holdings, dividends, orders, account info
- **Cache clearing**: Manual refresh button available

### Page Configuration
```python
st.set_page_config(
    page_title="Robinhood Portfolio Analyzer",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)
```

## 🐛 Troubleshooting

### Common Issues

**Login Failed**
- Verify credentials are correct
- Check if MFA is required
- Ensure stable internet connection
- Try refreshing the page

**Data Not Loading**
- Use the "Refresh Data" button in sidebar
- Check if you're still logged in
- Verify Robinhood account is active

**Session Issues**
- The app automatically clears sessions between logins
- Complete browser refresh may be needed
- Check browser console for errors

### Error Messages
- **"Not logged in"**: Authentication expired, please login again
- **"No holdings data"**: Account may not have positions or API timeout
- **"Login verification failed"**: Credential validation failed

## 📈 Performance

### Optimization Features
- **Caching system**: 5-minute cache for API responses
- **Minimal data persistence**: Session state only
- **Efficient processing**: Pandas operations for data manipulation
- **Lazy loading**: Data fetched only when needed

### Rate Limiting
- Automatic caching prevents excessive API calls
- Robinhood API rate limits respected
- Efficient data processing reduces load times

## 🔄 Recent Updates

### Stock-Level Detail Analysis (July 2025)
- Added comprehensive individual stock tracking
- Three-column layout: Equity Transactions, Dividend History, Summary
- Interactive stock selector for detailed analysis
- Complete transaction and dividend history per stock

### Authentication System Overhaul (July 2025)
- Fixed critical session persistence bug
- Enhanced credential validation with multiple verification layers
- Implemented account confirmation system
- Added comprehensive security warnings and cross-validation

## 📝 Contributing

When contributing to this project:

1. **Security First**: All changes must maintain the security standards
2. **Code Style**: Follow existing patterns and conventions
3. **Testing**: Verify authentication and data retrieval work correctly
4. **Documentation**: Update README for significant changes

## ⚠️ Disclaimers

- **Educational Purpose**: This tool is for portfolio analysis and educational purposes
- **No Investment Advice**: Does not provide investment recommendations
- **Data Accuracy**: Data accuracy depends on Robinhood API availability
- **Security**: Users are responsible for protecting their credentials
- **API Limitations**: Subject to Robinhood API terms and rate limits

## 📜 License

This project is for educational and personal use. Please respect Robinhood's API terms of service.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify your Robinhood account status
3. Ensure all dependencies are installed correctly
4. Check for any browser console errors

---

**Note**: This application requires valid Robinhood credentials and does not store any sensitive information. All authentication is session-based for security.