from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from enum import Enum


class Severity(str, Enum):
    """Weather alert severity levels"""
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"
    SEVERE = "Severe"


class AlertType(str, Enum):
    """Types of weather alerts"""
    THUNDERSTORM = "Thunderstorm"
    HEAVY_RAIN = "Heavy Rain"
    SNOW = "Snow"
    HEAT_WAVE = "Heat Wave"
    COLD_WAVE = "Cold Wave"
    HIGH_WIND = "High Wind"


class WindDirection(str, Enum):
    """Wind direction compass points"""
    N = "N"
    NE = "NE"
    E = "E"
    SE = "SE"
    S = "S"
    SW = "SW"
    W = "W"
    NW = "NW"


class WeatherForecast(BaseModel):
    """Basic weather forecast model"""
    date: datetime = Field(..., description="Date and time of the forecast")
    temperature_c: int = Field(..., description="Temperature in Celsius", ge=-50, le=60)
    temperature_f: int = Field(..., description="Temperature in Fahrenheit")
    summary: str = Field(..., description="Weather summary (e.g., Sunny, Rainy)")
    humidity: int = Field(..., description="Humidity percentage", ge=0, le=100)
    wind_speed: float = Field(..., description="Wind speed in km/h", ge=0)
    wind_direction: WindDirection = Field(..., description="Wind direction")
    precipitation: float = Field(..., description="Precipitation in mm", ge=0)
    pressure: int = Field(..., description="Atmospheric pressure in hPa", ge=900, le=1100)

    class Config:
        json_schema_extra = {
            "example": {
                "date": "2025-10-30T10:00:00",
                "temperature_c": 22,
                "temperature_f": 72,
                "summary": "Sunny",
                "humidity": 65,
                "wind_speed": 15.5,
                "wind_direction": "NW",
                "precipitation": 0.0,
                "pressure": 1013
            }
        }


class WeatherAlert(BaseModel):
    """Weather alert model"""
    alert_type: AlertType = Field(..., description="Type of weather alert")
    severity: Severity = Field(..., description="Severity level of the alert")
    description: str = Field(..., description="Detailed description of the alert")
    start_time: datetime = Field(..., description="Alert start time")
    end_time: datetime = Field(..., description="Alert end time")

    class Config:
        json_schema_extra = {
            "example": {
                "alert_type": "Thunderstorm",
                "severity": "Moderate",
                "description": "Thunderstorms expected in the area",
                "start_time": "2025-10-30T14:00:00",
                "end_time": "2025-10-30T18:00:00"
            }
        }


class DetailedWeatherForecast(BaseModel):
    """Detailed weather forecast with extended information"""
    date: datetime = Field(..., description="Date and time of the forecast")
    temperature_c: int = Field(..., description="Temperature in Celsius", ge=-50, le=60)
    temperature_f: int = Field(..., description="Temperature in Fahrenheit")
    summary: str = Field(..., description="Weather summary")
    humidity: int = Field(..., description="Humidity percentage", ge=0, le=100)
    wind_speed: float = Field(..., description="Wind speed in km/h", ge=0)
    wind_direction: WindDirection = Field(..., description="Wind direction")
    precipitation: float = Field(..., description="Precipitation in mm", ge=0)
    pressure: int = Field(..., description="Atmospheric pressure in hPa", ge=900, le=1100)
    cloud_cover: int = Field(..., description="Cloud cover percentage", ge=0, le=100)
    uv_index: float = Field(..., description="UV index", ge=0, le=11)
    visibility: int = Field(..., description="Visibility in km", ge=0)
    alerts: Optional[List[WeatherAlert]] = Field(None, description="Active weather alerts")

    class Config:
        json_schema_extra = {
            "example": {
                "date": "2025-10-30T10:00:00",
                "temperature_c": 22,
                "temperature_f": 72,
                "summary": "Partly Cloudy",
                "humidity": 65,
                "wind_speed": 15.5,
                "wind_direction": "NW",
                "precipitation": 0.0,
                "pressure": 1013,
                "cloud_cover": 45,
                "uv_index": 6.5,
                "visibility": 10,
                "alerts": []
            }
        }


class WeatherForecastRequest(BaseModel):
    """Request model for custom weather forecast"""
    city: Optional[str] = Field(None, description="City name for the forecast")
    days: int = Field(5, description="Number of days to forecast", ge=1, le=30)

    class Config:
        json_schema_extra = {
            "example": {
                "city": "London",
                "days": 7
            }
        }


class WeatherStatistics(BaseModel):
    """Weather statistics model"""
    average_temperature_c: float = Field(..., description="Average temperature in Celsius")
    max_temperature_c: int = Field(..., description="Maximum temperature in Celsius")
    min_temperature_c: int = Field(..., description="Minimum temperature in Celsius")
    average_humidity: float = Field(..., description="Average humidity percentage")
    total_precipitation: float = Field(..., description="Total precipitation in mm")
    average_wind_speed: float = Field(..., description="Average wind speed in km/h")
    days_analyzed: int = Field(..., description="Number of days analyzed")

    class Config:
        json_schema_extra = {
            "example": {
                "average_temperature_c": 18.5,
                "max_temperature_c": 25,
                "min_temperature_c": 12,
                "average_humidity": 68.3,
                "total_precipitation": 15.6,
                "average_wind_speed": 12.4,
                "days_analyzed": 7
            }
        }


class HealthCheck(BaseModel):
    """Health check response model"""
    status: str = Field(..., description="Service status")
    timestamp: datetime = Field(..., description="Current timestamp")
    service: str = Field(..., description="Service name")

    class Config:
        json_schema_extra = {
            "example": {
                "status": "Healthy",
                "timestamp": "2025-10-30T10:00:00",
                "service": "Weather Forecast API"
            }
        }
