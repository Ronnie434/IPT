import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import os
from portfolio_analyzer import PortfolioAnalyzer
from utils import format_currency, format_percentage, safe_float

# Page configuration
st.set_page_config(
    page_title="Robinhood Portfolio Analyzer",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize session state
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False
if 'analyzer' not in st.session_state:
    st.session_state.analyzer = None
if 'last_refresh' not in st.session_state:
    st.session_state.last_refresh = None

def login_form():
    """Display login form for Robinhood credentials"""
    st.title("🔐 Robinhood Portfolio Analyzer")
    st.markdown("### Secure Login")
    
    with st.form("login_form"):
        col1, col2 = st.columns([1, 1])
        
        with col1:
            username = st.text_input(
                "Username/Email",
                placeholder="Enter your Robinhood username",
                help="Your Robinhood login credentials are not stored and only used for this session"
            )
        
        with col2:
            password = st.text_input(
                "Password", 
                type="password",
                placeholder="Enter your password",
                help="Password is securely handled and not stored"
            )
        
        # MFA token input
        mfa_code = st.text_input(
            "MFA Code (if required)",
            placeholder="Enter 6-digit MFA code",
            help="Leave empty if MFA is not enabled on your account"
        )
        
        submit_button = st.form_submit_button("🚀 Login & Analyze Portfolio")
        
        if submit_button:
            if not username or not password:
                st.error("Please enter both username and password")
                return False
            
            with st.spinner("Logging in to Robinhood..."):
                try:
                    # Clear any existing analyzer first
                    if 'analyzer' in st.session_state and st.session_state.analyzer:
                        try:
                            st.session_state.analyzer.logout()
                        except:
                            pass
                        del st.session_state.analyzer
                    
                    # Create completely fresh analyzer instance
                    analyzer = PortfolioAnalyzer()
                    success = analyzer.login(username, password, mfa_code if mfa_code else None)
                    
                    if success:
                        st.session_state.logged_in = True
                        st.session_state.analyzer = analyzer
                        st.session_state.username = username
                        st.success("✅ Successfully logged in!")
                        st.rerun()
                    else:
                        st.error("❌ Login failed. Please check your credentials.")
                        return False
                        
                except Exception as e:
                    st.error(f"❌ Login error: {str(e)}")
                    return False
    
    # Security notice
    st.info("🔒 **Security Notice**: Your credentials are only used for this session and are not stored anywhere.")
    
    return False

def display_portfolio_summary():
    """Display portfolio summary metrics"""
    try:
        holdings = st.session_state.analyzer.get_holdings()
        
        if not holdings:
            st.warning("No holdings data available")
            return
        
        # Calculate summary metrics
        total_equity = sum(safe_float(holding.get('equity', 0)) for holding in holdings.values())
        total_market_value = sum(safe_float(holding.get('market_value', 0)) for holding in holdings.values())
        
        # Display key metrics
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                label="💰 Total Portfolio Value",
                value=format_currency(total_equity)
            )
        
        with col2:
            st.metric(
                label="📈 Market Value",
                value=format_currency(total_market_value)
            )
        
        with col3:
            total_positions = len(holdings)
            st.metric(
                label="📊 Total Positions",
                value=total_positions
            )
        
        with col4:
            # Calculate total dividends
            total_divs = st.session_state.analyzer.get_total_dividends()
            st.metric(
                label="💵 Total Dividends",
                value=format_currency(safe_float(total_divs))
            )
        
    except Exception as e:
        st.error(f"Error loading portfolio summary: {str(e)}")

def display_holdings():
    """Display current holdings in a detailed table"""
    try:
        holdings = st.session_state.analyzer.get_holdings()
        
        if not holdings:
            st.warning("No holdings data available")
            return
        
        # Convert holdings to DataFrame for better display
        holdings_data = []
        for symbol, data in holdings.items():
            holdings_data.append({
                'Symbol': symbol,
                'Quantity': safe_float(data.get('quantity', 0)),
                'Average Cost': safe_float(data.get('average_buy_price', 0)),
                'Current Price': safe_float(data.get('price', 0)),
                'Market Value': safe_float(data.get('market_value', 0)),
                'Equity': safe_float(data.get('equity', 0)),
                'Percent Change': safe_float(data.get('percent_change', 0)),
                'Total Return': safe_float(data.get('total_return_today', 0))
            })
        
        df = pd.DataFrame(holdings_data)
        
        if not df.empty:
            # Format the DataFrame for display
            df['Average Cost'] = df['Average Cost'].apply(format_currency)
            df['Current Price'] = df['Current Price'].apply(format_currency)
            df['Market Value'] = df['Market Value'].apply(format_currency)
            df['Equity'] = df['Equity'].apply(format_currency)
            df['Percent Change'] = df['Percent Change'].apply(format_percentage)
            df['Total Return'] = df['Total Return'].apply(format_currency)
            
            st.dataframe(
                df,
                use_container_width=True,
                hide_index=True,
                column_config={
                    "Symbol": st.column_config.TextColumn("Symbol", width="small"),
                    "Quantity": st.column_config.NumberColumn("Quantity", format="%.4f"),
                    "Percent Change": st.column_config.TextColumn("% Change"),
                }
            )
            
            # Portfolio allocation chart
            if len(holdings_data) > 1:
                fig = px.pie(
                    values=[item['Market Value'] for item in holdings_data],
                    names=[item['Symbol'] for item in holdings_data],
                    title="Portfolio Allocation"
                )
                fig.update_traces(textposition='inside', textinfo='percent+label')
                st.plotly_chart(fig, use_container_width=True)
        
    except Exception as e:
        st.error(f"Error loading holdings: {str(e)}")

def display_dividends():
    """Display dividend information"""
    try:
        dividends = st.session_state.analyzer.get_dividends()
        total_dividends = st.session_state.analyzer.get_total_dividends()
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("💰 Dividend History")
            
            if dividends:
                div_data = []
                for div in dividends:
                    div_data.append({
                        'Date': div.get('paid_at', div.get('payable_date', 'N/A')),
                        'Symbol': div.get('symbol', div.get('instrument', 'N/A')),
                        'Amount': safe_float(div.get('amount', 0)),
                        'Rate': safe_float(div.get('rate', 0)),
                        'Position': safe_float(div.get('position', 0))
                    })
                
                df_div = pd.DataFrame(div_data)
                
                if not df_div.empty:
                    df_div['Amount'] = df_div['Amount'].apply(format_currency)
                    df_div['Rate'] = df_div['Rate'].apply(format_currency)
                    
                    st.dataframe(df_div, use_container_width=True, hide_index=True)
                    
                    # Dividend timeline chart
                    if len(div_data) > 1:
                        fig = px.bar(
                            x=[item['Date'] for item in div_data],
                            y=[item['Amount'] for item in div_data],
                            title="Dividend Payments Over Time"
                        )
                        st.plotly_chart(fig, use_container_width=True)
                else:
                    st.info("No dividend history available")
            else:
                st.info("No dividend data available")
        
        with col2:
            st.subheader("📊 Dividend Summary")
            st.metric(
                "Total Dividends Earned",
                format_currency(safe_float(total_dividends))
            )
            
    except Exception as e:
        st.error(f"Error loading dividend data: {str(e)}")

def display_orders():
    """Display order history"""
    try:
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("📋 Open Orders")
            open_orders = st.session_state.analyzer.get_open_orders()
            
            if open_orders:
                open_data = []
                for order in open_orders:
                    open_data.append({
                        'Symbol': order.get('symbol', 'N/A'),
                        'Side': order.get('side', 'N/A'),
                        'Type': order.get('type', 'N/A'),
                        'Quantity': safe_float(order.get('quantity', 0)),
                        'Price': safe_float(order.get('price', 0)),
                        'State': order.get('state', 'N/A'),
                        'Created': order.get('created_at', 'N/A')[:10] if order.get('created_at') else 'N/A'
                    })
                
                if open_data:
                    df_open = pd.DataFrame(open_data)
                    df_open['Price'] = df_open['Price'].apply(format_currency)
                    st.dataframe(df_open, use_container_width=True, hide_index=True)
                else:
                    st.info("No open orders")
            else:
                st.info("No open orders")
        
        with col2:
            st.subheader("📜 Recent Orders")
            all_orders = st.session_state.analyzer.get_all_orders()
            
            if all_orders:
                # Show only recent orders (last 10)
                recent_orders = all_orders[:10] if len(all_orders) > 10 else all_orders
                
                recent_data = []
                for order in recent_orders:
                    recent_data.append({
                        'Symbol': order.get('symbol', 'N/A'),
                        'Side': order.get('side', 'N/A'),
                        'Quantity': safe_float(order.get('quantity', 0)),
                        'Price': safe_float(order.get('price', 0)),
                        'State': order.get('state', 'N/A'),
                        'Date': order.get('created_at', 'N/A')[:10] if order.get('created_at') else 'N/A'
                    })
                
                if recent_data:
                    df_recent = pd.DataFrame(recent_data)
                    df_recent['Price'] = df_recent['Price'].apply(format_currency)
                    st.dataframe(df_recent, use_container_width=True, hide_index=True)
                else:
                    st.info("No recent orders")
            else:
                st.info("No order history available")
                
    except Exception as e:
        st.error(f"Error loading order data: {str(e)}")

def main():
    """Main application function"""
    
    if not st.session_state.logged_in:
        login_form()
        return
    
    # Main application layout
    st.title("📊 Robinhood Portfolio Dashboard")
    
    # Sidebar with user info and controls
    with st.sidebar:
        st.markdown(f"### Welcome!")
        st.markdown(f"**User:** {st.session_state.get('username', 'Unknown')}")
        
        if st.session_state.last_refresh:
            st.markdown(f"**Last Updated:** {st.session_state.last_refresh.strftime('%H:%M:%S')}")
        
        if st.button("🔄 Refresh Data"):
            with st.spinner("Refreshing portfolio data..."):
                try:
                    # Clear any cached data in analyzer
                    st.session_state.analyzer.clear_cache()
                    st.session_state.last_refresh = datetime.now()
                    st.success("Data refreshed!")
                    st.rerun()
                except Exception as e:
                    st.error(f"Refresh failed: {str(e)}")
        
        if st.button("🚪 Logout"):
            # Properly logout from Robinhood first
            if st.session_state.analyzer:
                st.session_state.analyzer.logout()
            
            # Clear all session state
            for key in list(st.session_state.keys()):
                del st.session_state[key]
            
            # Show logout message
            st.success("Logged out successfully!")
            st.rerun()
    
    # Portfolio summary at the top
    display_portfolio_summary()
    
    # Main content tabs
    tabs = st.tabs(["📈 Holdings", "💰 Dividends", "📋 Orders", "📊 Analytics"])
    
    with tabs[0]:
        display_holdings()
    
    with tabs[1]:
        display_dividends()
    
    with tabs[2]:
        display_orders()
    
    with tabs[3]:
        st.subheader("📊 Portfolio Analytics")
        st.info("Advanced analytics features coming soon...")
        
        # Basic performance metrics
        try:
            holdings = st.session_state.analyzer.get_holdings()
            if holdings:
                # Calculate some basic metrics
                total_value = sum(safe_float(holding.get('equity', 0)) for holding in holdings.values())
                total_cost = sum(
                    safe_float(holding.get('average_buy_price', 0)) * safe_float(holding.get('quantity', 0)) 
                    for holding in holdings.values()
                )
                
                if total_cost > 0:
                    total_return = total_value - total_cost
                    total_return_pct = (total_return / total_cost) * 100
                    
                    col1, col2 = st.columns(2)
                    with col1:
                        st.metric(
                            "💹 Total Return",
                            format_currency(total_return),
                            f"{format_percentage(total_return_pct)}"
                        )
                    
                    with col2:
                        st.metric(
                            "💵 Total Cost Basis",
                            format_currency(total_cost)
                        )
        except Exception as e:
            st.error(f"Error calculating analytics: {str(e)}")
    
    # Update last refresh time
    if not st.session_state.last_refresh:
        st.session_state.last_refresh = datetime.now()

if __name__ == "__main__":
    main()
