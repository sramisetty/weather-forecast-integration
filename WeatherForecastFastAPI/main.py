from fastapi import FastAPI, HTTPException, Query, Path, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List, Optional
from models import (
    WeatherForecast,
    DetailedWeatherForecast,
    WeatherAlert,
    WeatherForecastRequest,
    WeatherStatistics,
    HealthCheck
)
from service import WeatherForecastService

# Create FastAPI application
app = FastAPI(
    title="Weather Forecast API",
    description="""
    A comprehensive Weather Forecast API built with FastAPI.

    ## Features

    * **No Authentication Required**: All endpoints are publicly accessible
    * **Multiple Endpoints**: 10+ endpoints for various weather data needs
    * **Rich Data Models**: Detailed weather information including temperature, humidity, wind, precipitation
    * **Weather Alerts**: Get active weather alerts with severity levels
    * **Statistics**: Weather analytics and aggregations
    * **Validation**: Automatic input validation with Pydantic
    * **Interactive Documentation**: Swagger UI and ReDoc

    ## Endpoints

    * **GET /api/forecast** - Get weather forecast for X days
    * **GET /api/forecast/current** - Get current weather
    * **GET /api/forecast/city/{city}** - Get city-specific forecast
    * **GET /api/forecast/detailed** - Get detailed forecast for a date
    * **GET /api/forecast/detailed/multi** - Get detailed multi-day forecasts
    * **GET /api/forecast/alerts** - Get weather alerts
    * **GET /api/forecast/statistics** - Get weather statistics
    * **POST /api/forecast/request** - Custom forecast request
    * **GET /api/forecast/health** - Health check
    """,
    version="1.0.0",
    contact={
        "name": "Weather API Team",
        "email": "weather@example.com"
    },
    license_info={
        "name": "MIT",
    },
    openapi_tags=[
        {"name": "Weather Forecast", "description": "Basic weather forecast operations"},
        {"name": "Detailed Forecast", "description": "Detailed weather forecasts with extended data"},
        {"name": "Weather Alerts", "description": "Weather alert operations"},
        {"name": "Statistics", "description": "Weather statistics and analytics"},
        {"name": "Health", "description": "API health monitoring"}
    ],
    swagger_ui_parameters={
        "persistAuthorization": False,
        "displayRequestDuration": True,
        "filter": True,
    },
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Add CORS middleware to allow all origins (completely open)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Initialize service
weather_service = WeatherForecastService()


@app.get(
    "/api/forecast",
    response_model=List[WeatherForecast],
    summary="Get weather forecast",
    description="Get weather forecast for the specified number of days (1-30)",
    tags=["Weather Forecast"]
)
async def get_forecast(
    days: int = Query(
        5,
        ge=1,
        le=30,
        description="Number of days to forecast"
    )
):
    """
    Get weather forecast for multiple days.

    - **days**: Number of days to forecast (default: 5, range: 1-30)

    Returns a list of weather forecasts with:
    - Temperature (Celsius and Fahrenheit)
    - Weather summary
    - Humidity, wind speed, precipitation
    - Atmospheric pressure
    """
    return weather_service.get_forecast(days)


@app.get(
    "/api/forecast/current",
    response_model=WeatherForecast,
    summary="Get current weather",
    description="Get current weather conditions for a specific city or default location",
    tags=["Weather Forecast"]
)
async def get_current_weather(
    city: Optional[str] = Query(
        None,
        description="City name (optional)"
    )
):
    """
    Get current weather conditions.

    - **city**: Optional city name

    Returns current weather including temperature, humidity, wind, and more.
    """
    return weather_service.get_current_weather(city)


@app.get(
    "/api/forecast/city/{city}",
    response_model=List[WeatherForecast],
    summary="Get forecast by city",
    description="Get weather forecast for a specific city",
    tags=["Weather Forecast"]
)
async def get_forecast_by_city(
    city: str = Path(
        ...,
        description="City name",
        min_length=1
    ),
    days: int = Query(
        5,
        ge=1,
        le=30,
        description="Number of days to forecast"
    )
):
    """
    Get weather forecast for a specific city.

    - **city**: City name (required, path parameter)
    - **days**: Number of days to forecast (default: 5, range: 1-30)

    Returns city-specific weather forecast for multiple days.
    """
    if not city or city.strip() == "":
        raise HTTPException(status_code=400, detail="City name cannot be empty")

    return weather_service.get_forecast_by_city(city, days)


@app.get(
    "/api/forecast/detailed",
    response_model=DetailedWeatherForecast,
    summary="Get detailed forecast",
    description="Get detailed weather forecast for a specific date",
    tags=["Detailed Forecast"]
)
async def get_detailed_forecast(
    date: datetime = Query(
        ...,
        description="Date for the forecast (ISO format: YYYY-MM-DDTHH:MM:SS)"
    ),
    city: Optional[str] = Query(
        None,
        description="City name (optional)"
    )
):
    """
    Get detailed weather forecast for a specific date.

    - **date**: Date for the forecast (required, ISO format)
    - **city**: Optional city name

    Returns detailed forecast including:
    - All basic weather data
    - Cloud cover percentage
    - UV index
    - Visibility
    - Active weather alerts (if any)
    """
    if date < datetime.now():
        raise HTTPException(status_code=400, detail="Date cannot be in the past")

    return weather_service.get_detailed_forecast(date, city)


@app.get(
    "/api/forecast/detailed/multi",
    response_model=List[DetailedWeatherForecast],
    summary="Get detailed forecasts",
    description="Get detailed weather forecasts for multiple days",
    tags=["Detailed Forecast"]
)
async def get_detailed_forecasts(
    days: int = Query(
        5,
        ge=1,
        le=30,
        description="Number of days to forecast"
    )
):
    """
    Get detailed weather forecasts for multiple days.

    - **days**: Number of days to forecast (default: 5, range: 1-30)

    Returns a list of detailed forecasts with extended information including
    cloud cover, UV index, visibility, and potential weather alerts.
    """
    return weather_service.get_detailed_forecasts(days)


@app.get(
    "/api/forecast/alerts",
    response_model=List[WeatherAlert],
    summary="Get weather alerts",
    description="Get active weather alerts for a specific area",
    tags=["Weather Alerts"]
)
async def get_weather_alerts(
    city: Optional[str] = Query(
        None,
        description="City name (optional)"
    )
):
    """
    Get active weather alerts.

    - **city**: Optional city name

    Returns a list of active weather alerts including:
    - Alert type (thunderstorm, heavy rain, etc.)
    - Severity level (low, moderate, high, severe)
    - Description
    - Start and end times
    """
    return weather_service.get_weather_alerts(city)


@app.get(
    "/api/forecast/statistics",
    response_model=WeatherStatistics,
    summary="Get weather statistics",
    description="Get weather statistics and aggregations for a specified period",
    tags=["Statistics"]
)
async def get_weather_statistics(
    days: int = Query(
        7,
        ge=1,
        le=365,
        description="Number of days to analyze"
    )
):
    """
    Get weather statistics for a specified period.

    - **days**: Number of days to analyze (default: 7, range: 1-365)

    Returns comprehensive statistics including:
    - Average, maximum, and minimum temperatures
    - Average humidity
    - Total precipitation
    - Average wind speed
    """
    return weather_service.get_weather_statistics(days)


@app.post(
    "/api/forecast/request",
    response_model=List[WeatherForecast],
    summary="Create custom forecast request",
    description="Create a custom weather forecast request with city and days parameters",
    tags=["Weather Forecast"]
)
async def create_forecast_request(
    request: WeatherForecastRequest = Body(
        ...,
        description="Weather forecast request parameters"
    )
):
    """
    Create a custom weather forecast request.

    Request body:
    - **city**: Optional city name
    - **days**: Number of days to forecast (default: 5, range: 1-30)

    Returns weather forecast based on the request parameters.
    """
    if request.days < 1 or request.days > 30:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 30")

    if request.city and request.city.strip() != "":
        return weather_service.get_forecast_by_city(request.city, request.days)
    else:
        return weather_service.get_forecast(request.days)


@app.get(
    "/api/forecast/health",
    response_model=HealthCheck,
    summary="Health check",
    description="Check API health status",
    tags=["Health"]
)
async def get_health():
    """
    Health check endpoint.

    Returns the current status of the API service.
    """
    return HealthCheck(
        status="Healthy",
        timestamp=datetime.now(),
        service="Weather Forecast API"
    )


@app.get(
    "/",
    include_in_schema=False
)
async def root():
    """Redirect to API documentation"""
    return JSONResponse(
        content={
            "message": "Welcome to Weather Forecast API",
            "documentation": "/docs",
            "alternative_docs": "/redoc"
        }
    )


# Exception handlers
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
