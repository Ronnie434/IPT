# Robinhood Portfolio Analyzer

## Overview

This project is a Streamlit-based web application that provides portfolio analysis for Robinhood trading accounts. The application allows users to securely log into their Robinhood accounts and analyze their investment portfolios through an interactive dashboard with visualizations and performance metrics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a simple three-tier architecture:

1. **Presentation Layer**: Streamlit web interface (`app.py`)
2. **Business Logic Layer**: Portfolio analysis functionality (`portfolio_analyzer.py`)
3. **Utility Layer**: Helper functions and data formatting (`utils.py`)

The architecture emphasizes simplicity and security, with session-based authentication and no persistent data storage of user credentials.

## Key Components

### Frontend (Streamlit Application)
- **Main Application** (`app.py`): Handles the web interface, user interactions, and data visualization
- **Authentication Flow**: Secure login form with MFA support
- **Dashboard**: Interactive portfolio visualization using Plotly charts
- **Session Management**: Maintains user state during the session without persistent storage

### Backend Services
- **Portfolio Analyzer** (`portfolio_analyzer.py`): Core business logic class that interfaces with Robinhood API
- **API Integration**: Uses robin-stocks library for Robinhood API interactions
- **Caching Layer**: Implements temporary data caching to reduce API calls (5-minute timeout)

### Utility Functions
- **Data Formatting** (`utils.py`): Currency and percentage formatting utilities
- **Safe Type Conversion**: Error-handling functions for data type conversions

## Data Flow

1. **Authentication**: User enters credentials → Portfolio Analyzer validates with Robinhood API
2. **Data Retrieval**: Portfolio Analyzer fetches account data via robin-stocks library
3. **Processing**: Raw data is processed and formatted using utility functions
4. **Visualization**: Processed data is displayed through Streamlit interface with Plotly charts
5. **Caching**: API responses are temporarily cached to improve performance

## External Dependencies

### Core Libraries
- **Streamlit**: Web application framework for the user interface
- **robin-stocks**: Python library for Robinhood API integration
- **Plotly**: Interactive charting and visualization library
- **Pandas**: Data manipulation and analysis

### API Integration
- **Robinhood API**: Primary data source for portfolio information
- **Authentication**: Session-based login with MFA support
- **Rate Limiting**: Implemented through caching to respect API limits

## Deployment Strategy

### Local Development
- Direct Streamlit execution with `streamlit run app.py`
- Environment-based configuration
- Session state management for user data

### Security Considerations
- No persistent storage of user credentials
- Session-based authentication only
- MFA support for enhanced security
- Credentials are only used during active session

### Performance Optimization
- 5-minute cache timeout for API responses
- Minimal data persistence (session state only)
- Efficient data processing with pandas operations

### Configuration
- Page configuration optimized for wide layout
- Sidebar navigation for better UX
- Responsive design considerations

The application prioritizes user security by avoiding credential storage while providing real-time portfolio analysis through efficient API integration and caching mechanisms.

## Recent Changes (July 27, 2025)

### Authentication System Overhaul
- **Fixed Critical Issue**: Resolved session persistence bug where invalid credentials would access cached account data
- **Enhanced Session Clearing**: Implemented aggressive session clearing that removes all possible authentication tokens and files
- **Improved Validation**: Added multiple API verification calls to ensure authentic login before granting access
- **Workflow Restart**: Required complete environment restart to clear persistent robin_stocks authentication cache
- **Result**: Invalid credentials are now properly rejected, ensuring secure account access

### Technical Improvements
- Added module-level variable clearing for robin_stocks library
- Enhanced environment variable cleanup for authentication tokens
- Implemented subprocess isolation testing for credential validation
- Added extensive file system cleanup for session persistence files

The authentication system now properly validates credentials and prevents unauthorized access to account data.

### Stock-Level Detail Analysis Feature
- **Individual Stock Tracking**: Added comprehensive tracking at individual stock level with transaction history
- **Three-Column Layout**: Implemented Equity Transactions, Dividend History, and Summary columns matching user requirements
- **Transaction Details**: Shows quantity, price, amount, and dates for all equity transactions
- **Dividend Tracking**: Displays dividend payments with quantities, amounts, and payment dates
- **Comprehensive Metrics**: Calculates total profit, net quantity, average prices, and dividend totals
- **Interactive Selection**: Added stock selector for detailed analysis of any holding in the portfolio

This enhancement provides the detailed stock-level analysis requested, showing complete transaction and dividend history for each individual stock position.