FROM python:3.10-slim

WORKDIR /app

# Install system dependencies including GDAL
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gdal-bin \
    libgdal-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set GDAL environment variables
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]