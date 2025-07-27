FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    software-properties-common \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create .streamlit directory and copy config
RUN mkdir -p .streamlit
COPY .streamlit/config.toml .streamlit/

# Expose port
EXPOSE 10000

# Health check
HEALTHCHECK CMD curl --fail http://localhost:10000/_stcore/health

# Run the application
CMD ["streamlit", "run", "app.py", "--server.port=10000", "--server.address=0.0.0.0", "--server.headless=true", "--server.enableCORS=false", "--server.enableXsrfProtection=false"]