# Weather Forecast FastAPI

A comprehensive Weather Forecast API built with FastAPI featuring automatic Swagger/OpenAPI documentation.

## Features

- **10 Comprehensive Endpoints** for weather data operations
- **Automatic Interactive Documentation** with Swagger UI and ReDoc
- **Type Safety** with Pydantic models
- **Input Validation** built-in with FastAPI
- **Rich Weather Data** including temperature, humidity, wind, precipitation, alerts
- **Weather Statistics** with aggregations and analytics
- **Health Check** endpoint for monitoring

## Project Structure

```
WeatherForecastFastAPI/
├── main.py              # FastAPI application and endpoints
├── models.py            # Pydantic data models
├── service.py           # Business logic layer
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd WeatherForecastFastAPI
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

### Method 1: Using Uvicorn directly

```bash
uvicorn main:app --reload
```

### Method 2: Running the main.py file

```bash
python main.py
```

The application will start on `http://localhost:8000`

## API Documentation

Once running, you can access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Both provide:
- Complete API documentation
- Interactive testing interface
- Request/response schemas
- Example data

## API Endpoints

### Weather Forecast Endpoints

#### 1. **GET /api/forecast**
Get weather forecast for specified days
- **Query Parameters:**
  - `days` (optional, default: 5, range: 1-30)
- **Response:** List of weather forecasts

#### 2. **GET /api/forecast/current**
Get current weather conditions
- **Query Parameters:**
  - `city` (optional)
- **Response:** Current weather forecast

#### 3. **GET /api/forecast/city/{city}**
Get forecast for a specific city
- **Path Parameters:**
  - `city` (required)
- **Query Parameters:**
  - `days` (optional, default: 5, range: 1-30)
- **Response:** List of weather forecasts

#### 4. **GET /api/forecast/detailed**
Get detailed forecast for a specific date
- **Query Parameters:**
  - `date` (required, ISO format: YYYY-MM-DDTHH:MM:SS)
  - `city` (optional)
- **Response:** Detailed weather forecast

#### 5. **GET /api/forecast/detailed/multi**
Get detailed forecasts for multiple days
- **Query Parameters:**
  - `days` (optional, default: 5, range: 1-30)
- **Response:** List of detailed forecasts

#### 6. **GET /api/forecast/alerts**
Get active weather alerts
- **Query Parameters:**
  - `city` (optional)
- **Response:** List of weather alerts

#### 7. **GET /api/forecast/statistics**
Get weather statistics
- **Query Parameters:**
  - `days` (optional, default: 7, range: 1-365)
- **Response:** Weather statistics

#### 8. **POST /api/forecast/request**
Create custom forecast request
- **Request Body:**
  ```json
  {
    "city": "London",
    "days": 7
  }
  ```
- **Response:** List of weather forecasts

#### 9. **GET /api/forecast/health**
Health check endpoint
- **Response:** Service health status

## Example Usage

### Using curl

```bash
# Get 7-day forecast
curl "http://localhost:8000/api/forecast?days=7"

# Get current weather for London
curl "http://localhost:8000/api/forecast/current?city=London"

# Get forecast for Tokyo
curl "http://localhost:8000/api/forecast/city/Tokyo?days=5"

# Get weather alerts
curl "http://localhost:8000/api/forecast/alerts?city=NewYork"

# Get weather statistics
curl "http://localhost:8000/api/forecast/statistics?days=7"

# POST custom request
curl -X POST "http://localhost:8000/api/forecast/request" \
  -H "Content-Type: application/json" \
  -d '{"city":"Paris","days":3}'

# Health check
curl "http://localhost:8000/api/forecast/health"
```

### Using Python requests

```python
import requests

# Get forecast
response = requests.get("http://localhost:8000/api/forecast?days=5")
print(response.json())

# Get current weather
response = requests.get("http://localhost:8000/api/forecast/current?city=London")
print(response.json())

# POST custom request
response = requests.post(
    "http://localhost:8000/api/forecast/request",
    json={"city": "Tokyo", "days": 7}
)
print(response.json())
```

### Using JavaScript fetch

```javascript
// Get forecast
fetch('http://localhost:8000/api/forecast?days=5')
  .then(response => response.json())
  .then(data => console.log(data));

// POST custom request
fetch('http://localhost:8000/api/forecast/request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    city: 'London',
    days: 7
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

## Data Models

### WeatherForecast
- `date`: DateTime
- `temperature_c`: Integer (-50 to 60)
- `temperature_f`: Integer (calculated)
- `summary`: String (weather condition)
- `humidity`: Integer (0-100%)
- `wind_speed`: Float (km/h)
- `wind_direction`: Enum (N, NE, E, SE, S, SW, W, NW)
- `precipitation`: Float (mm)
- `pressure`: Integer (hPa)

### DetailedWeatherForecast
Includes all WeatherForecast fields plus:
- `cloud_cover`: Integer (0-100%)
- `uv_index`: Float (0-11)
- `visibility`: Integer (km)
- `alerts`: List of WeatherAlert (optional)

### WeatherAlert
- `alert_type`: Enum (Thunderstorm, Heavy Rain, Snow, etc.)
- `severity`: Enum (Low, Moderate, High, Severe)
- `description`: String
- `start_time`: DateTime
- `end_time`: DateTime

### WeatherStatistics
- `average_temperature_c`: Float
- `max_temperature_c`: Integer
- `min_temperature_c`: Integer
- `average_humidity`: Float
- `total_precipitation`: Float
- `average_wind_speed`: Float
- `days_analyzed`: Integer

## Features of FastAPI

This project demonstrates key FastAPI features:

1. **Automatic Documentation**: Swagger UI and ReDoc generated automatically
2. **Type Safety**: Pydantic models ensure type checking
3. **Input Validation**: Automatic validation of request parameters
4. **Async Support**: Built-in async/await support
5. **Dependency Injection**: Clean service layer architecture
6. **Error Handling**: Automatic error responses with proper status codes
7. **Request/Response Models**: Clear data contracts
8. **Tags**: Organized endpoint groups in documentation

## Development

### Run with auto-reload
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Run on different port
```bash
uvicorn main:app --port 3000
```

## Production Deployment

For production, use:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

Or use Gunicorn with Uvicorn workers:

```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Technologies Used

- **FastAPI**: Modern, fast web framework for building APIs
- **Uvicorn**: Lightning-fast ASGI server
- **Pydantic**: Data validation using Python type hints
- **Python 3.8+**: Modern Python features

## Notes

- This is a demo API using mock data
- In production, integrate with a real weather data provider
- All data is randomly generated for demonstration
- Swagger UI provides the best interactive experience

## License

MIT License
