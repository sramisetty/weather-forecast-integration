import random
from datetime import datetime, timedelta
from typing import List, Optional
from models import (
    WeatherForecast,
    DetailedWeatherForecast,
    WeatherAlert,
    WeatherStatistics,
    WindDirection,
    AlertType,
    Severity
)


class WeatherForecastService:
    """Service layer for weather forecast operations"""

    SUMMARIES = [
        "Freezing", "Bracing", "Chilly", "Cool", "Mild",
        "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    ]

    CITIES = [
        "New York", "London", "Tokyo", "Paris", "Sydney",
        "Mumbai", "Toronto", "Berlin", "Singapore", "Dubai"
    ]

    @staticmethod
    def _celsius_to_fahrenheit(celsius: int) -> int:
        """Convert Celsius to Fahrenheit"""
        return int(32 + (celsius * 9 / 5))

    def get_forecast(self, days: int = 5) -> List[WeatherForecast]:
        """
        Get weather forecast for the specified number of days

        Args:
            days: Number of days to forecast (1-30)

        Returns:
            List of weather forecasts
        """
        forecasts = []
        for i in range(1, days + 1):
            temp_c = random.randint(-20, 55)
            forecast = WeatherForecast(
                date=datetime.now() + timedelta(days=i),
                temperature_c=temp_c,
                temperature_f=self._celsius_to_fahrenheit(temp_c),
                summary=random.choice(self.SUMMARIES),
                humidity=random.randint(30, 100),
                wind_speed=round(random.uniform(0, 50), 2),
                wind_direction=random.choice(list(WindDirection)),
                precipitation=round(random.uniform(0, 100), 2),
                pressure=random.randint(980, 1040)
            )
            forecasts.append(forecast)
        return forecasts

    def get_forecast_by_city(self, city: str, days: int = 5) -> List[WeatherForecast]:
        """
        Get weather forecast for a specific city

        Args:
            city: City name
            days: Number of days to forecast (1-30)

        Returns:
            List of weather forecasts for the city
        """
        # In production, this would fetch city-specific data
        return self.get_forecast(days)

    def get_current_weather(self, city: Optional[str] = None) -> WeatherForecast:
        """
        Get current weather conditions

        Args:
            city: Optional city name

        Returns:
            Current weather forecast
        """
        temp_c = random.randint(-20, 55)
        return WeatherForecast(
            date=datetime.now(),
            temperature_c=temp_c,
            temperature_f=self._celsius_to_fahrenheit(temp_c),
            summary=random.choice(self.SUMMARIES),
            humidity=random.randint(30, 100),
            wind_speed=round(random.uniform(0, 50), 2),
            wind_direction=random.choice(list(WindDirection)),
            precipitation=round(random.uniform(0, 100), 2),
            pressure=random.randint(980, 1040)
        )

    def get_detailed_forecast(
        self,
        date: datetime,
        city: Optional[str] = None
    ) -> DetailedWeatherForecast:
        """
        Get detailed weather forecast for a specific date

        Args:
            date: Date for the forecast
            city: Optional city name

        Returns:
            Detailed weather forecast
        """
        temp_c = random.randint(-20, 55)
        has_alert = random.random() > 0.7

        alerts = None
        if has_alert:
            alerts = [
                WeatherAlert(
                    alert_type=random.choice(list(AlertType)),
                    severity=random.choice(list(Severity)),
                    description="Weather alert in effect",
                    start_time=date,
                    end_time=date + timedelta(hours=random.randint(3, 24))
                )
            ]

        return DetailedWeatherForecast(
            date=date,
            temperature_c=temp_c,
            temperature_f=self._celsius_to_fahrenheit(temp_c),
            summary=random.choice(self.SUMMARIES),
            humidity=random.randint(30, 100),
            wind_speed=round(random.uniform(0, 50), 2),
            wind_direction=random.choice(list(WindDirection)),
            precipitation=round(random.uniform(0, 100), 2),
            pressure=random.randint(980, 1040),
            cloud_cover=random.randint(0, 100),
            uv_index=round(random.uniform(0, 11), 1),
            visibility=random.randint(1, 20),
            alerts=alerts
        )

    def get_detailed_forecasts(self, days: int = 5) -> List[DetailedWeatherForecast]:
        """
        Get detailed weather forecasts for multiple days

        Args:
            days: Number of days to forecast (1-30)

        Returns:
            List of detailed weather forecasts
        """
        forecasts = []
        for i in range(1, days + 1):
            forecast = self.get_detailed_forecast(
                datetime.now() + timedelta(days=i)
            )
            forecasts.append(forecast)
        return forecasts

    def get_weather_alerts(self, city: Optional[str] = None) -> List[WeatherAlert]:
        """
        Get active weather alerts

        Args:
            city: Optional city name

        Returns:
            List of active weather alerts
        """
        alert_count = random.randint(0, 4)
        alerts = []

        for i in range(alert_count):
            alert = WeatherAlert(
                alert_type=random.choice(list(AlertType)),
                severity=random.choice(list(Severity)),
                description=f"Weather alert {i + 1} for {city or 'your area'}",
                start_time=datetime.now() + timedelta(hours=random.randint(-2, 4)),
                end_time=datetime.now() + timedelta(hours=random.randint(4, 24))
            )
            alerts.append(alert)

        return alerts

    def get_weather_statistics(self, days: int = 7) -> WeatherStatistics:
        """
        Get weather statistics for a specified period

        Args:
            days: Number of days to analyze (1-365)

        Returns:
            Weather statistics including averages and extremes
        """
        forecasts = self.get_forecast(days)

        temps = [f.temperature_c for f in forecasts]
        humidities = [f.humidity for f in forecasts]
        precipitations = [f.precipitation for f in forecasts]
        wind_speeds = [f.wind_speed for f in forecasts]

        return WeatherStatistics(
            average_temperature_c=round(sum(temps) / len(temps), 2),
            max_temperature_c=max(temps),
            min_temperature_c=min(temps),
            average_humidity=round(sum(humidities) / len(humidities), 2),
            total_precipitation=round(sum(precipitations), 2),
            average_wind_speed=round(sum(wind_speeds) / len(wind_speeds), 2),
            days_analyzed=days
        )
