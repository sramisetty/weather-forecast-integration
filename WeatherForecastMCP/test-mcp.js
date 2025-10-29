// Simple test script to verify MCP server can connect to Weather API
import axios from 'axios';

const API_BASE_URL = process.env.WEATHER_API_URL || 'http://127.0.0.1:3000';

async function testWeatherAPI() {
  console.log('Testing Weather API connection...');
  console.log(`API Base URL: ${API_BASE_URL}\n`);

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/api/forecast/health`);
    console.log('✓ Health Check:', healthResponse.data);
    console.log();

    // Test 2: Get Forecast
    console.log('2. Testing Get Forecast (3 days)...');
    const forecastResponse = await axios.get(`${API_BASE_URL}/api/forecast?days=3`);
    console.log(`✓ Forecast: Retrieved ${forecastResponse.data.length} days`);
    console.log('  Sample:', forecastResponse.data[0]);
    console.log();

    // Test 3: Current Weather
    console.log('3. Testing Current Weather...');
    const currentResponse = await axios.get(`${API_BASE_URL}/api/forecast/current`);
    console.log('✓ Current Weather:', {
      temp_c: currentResponse.data.temperature_c,
      summary: currentResponse.data.summary
    });
    console.log();

    // Test 4: City Forecast
    console.log('4. Testing City Forecast (London)...');
    const cityResponse = await axios.get(`${API_BASE_URL}/api/forecast/city/London?days=2`);
    console.log(`✓ City Forecast: Retrieved ${cityResponse.data.length} days for London`);
    console.log();

    // Test 5: Weather Alerts
    console.log('5. Testing Weather Alerts...');
    const alertsResponse = await axios.get(`${API_BASE_URL}/api/forecast/alerts`);
    console.log(`✓ Weather Alerts: Retrieved ${alertsResponse.data.length} alerts`);
    console.log();

    // Test 6: Weather Statistics
    console.log('6. Testing Weather Statistics...');
    const statsResponse = await axios.get(`${API_BASE_URL}/api/forecast/statistics?days=7`);
    console.log('✓ Weather Statistics:', statsResponse.data);
    console.log();

    console.log('========================================');
    console.log('✓ All tests passed! MCP server is ready to use.');
    console.log('========================================');

  } catch (error) {
    console.error('✗ Test failed:', error.message);
    if (error.response) {
      console.error('  Response:', error.response.data);
    }
    process.exit(1);
  }
}

testWeatherAPI();
