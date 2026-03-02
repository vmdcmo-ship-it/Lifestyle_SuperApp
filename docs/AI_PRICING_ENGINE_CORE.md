# AI Pricing Engine - Core System

> **Bộ não định giá thông minh** - Tính giá động dựa trên AI, traffic, weather

---

## 📋 Overview

**Components:**
1. Dynamic Pricing Engine with ML
2. External API Integration (Traffic & Weather)
3. Multi-parameter calculation
4. Real-time price optimization

**Tech Stack:**
- NestJS (API services)
- Python FastAPI (ML models)
- TensorFlow / PyTorch (Deep Learning)
- Redis (caching external API data)
- PostgreSQL (pricing configs, historical data)
- MongoDB (ML training data)

---

## 💰 Pricing Formula

### Base Formula

```typescript
FinalPrice = (
  BaseFare 
  + (Distance × PricePerKm)
  + (Time × PricePerMinute)
  + (Weight × PricePerKg) // For delivery
) × TimeMultiplier
  × WeatherMultiplier
  × TrafficMultiplier
  × DemandMultiplier
  - MembershipDiscount
  - PromoDiscount
```

**Constraints:**
```typescript
// Safety bounds
FinalPrice = Math.max(MinFare, Math.min(MaxFare, FinalPrice));

// Driver earning guarantee
DriverEarning = FinalPrice × (1 - Commission);
if (DriverEarning < MinDriverEarning) {
  FinalPrice = MinDriverEarning / (1 - Commission);
}
```

### Example Calculation

**Scenario:** Food delivery, 5.2km, 18 minutes, heavy rain, peak hour

```typescript
// Input
const request = {
  serviceType: ServiceType.FOOD_DELIVERY,
  distance: 5.2, // km
  estimatedDuration: 18, // minutes
  origin: { lat: 10.8231, lng: 106.6297 },
  destination: { lat: 10.7629, lng: 106.6821 },
  scheduledTime: new Date('2024-02-14T18:30:00'), // Peak hour
  userId: 'user123',
  membershipTier: 'GOLD'
};

// Step 1: Base calculation
const baseFare = 15_000; // VND
const distanceFee = 5.2 × 5_000 = 26_000; // VND
const timeFee = 18 × 500 = 9_000; // VND
const subtotal = 15_000 + 26_000 + 9_000 = 50_000; // VND

// Step 2: Fetch external data
const traffic = await getTrafficData(origin, destination);
// → TrafficLevel.MODERATE (delay: 8 minutes)

const weather = await getWeatherData(destination.lat, destination.lng);
// → WeatherCondition.RAIN_HEAVY (15mm/hour)

const demandSupply = await getDemandSupplyData('District 7', ServiceType.FOOD_DELIVERY);
// → demandSupplyRatio: 0.85 (normal demand)

// Step 3: Apply multipliers
const timeMultiplier = getTimeMultiplier(request.scheduledTime);
// → 1.3 (peak hour 5-7 PM)

const weatherMultiplier = getWeatherMultiplier(weather);
// → 1.3 (heavy rain)

const trafficMultiplier = getTrafficMultiplier(traffic);
// → 1.1 (moderate congestion)

const demandMultiplier = getDemandMultiplier(demandSupply);
// → 1.0 (normal demand)

const totalMultiplier = 1.3 × 1.3 × 1.1 × 1.0 = 1.859;

// Step 4: Apply multipliers
const priceBeforeDiscount = 50_000 × 1.859 = 92_950; // VND

// Step 5: Discounts
const membershipDiscount = getMembershipDiscount('GOLD', priceBeforeDiscount);
// → 10% = -9_295 VND

const promoDiscount = await getPromoDiscount(request.userId, request.promoCode);
// → -10_000 VND (promo code)

// Step 6: Final price
const finalPrice = 92_950 - 9_295 - 10_000 = 73_655;
const roundedPrice = Math.round(finalPrice / 1000) × 1000 = 74_000; // VND

// Step 7: Driver earning
const commission = 0.15; // 15%
const driverEarning = 74_000 × (1 - 0.15) = 62_900; // VND
const platformFee = 11_100; // VND

// Result
return {
  totalPrice: 74_000,
  breakdown: {
    baseFare: 15_000,
    distanceFee: 26_000,
    timeFee: 9_000,
    peakHourSurcharge: 15_000, // (1.3 - 1.0) × 50_000
    weatherSurcharge: 15_000,
    trafficSurcharge: 5_000,
    subtotal: 92_950,
    membershipDiscount: -9_295,
    promoDiscount: -10_000,
    total: 74_000
  },
  appliedMultipliers: [
    { name: "Peak Hour (5-7 PM)", multiplier: 1.3, reason: "High demand dinner time" },
    { name: "Heavy Rain", multiplier: 1.3, reason: "Dangerous weather conditions" },
    { name: "Moderate Traffic", multiplier: 1.1, reason: "8 minutes delay" }
  ],
  driverEarning: 62_900,
  platformFee: 11_100,
  validUntil: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  explanation: "Giá tăng do giờ cao điểm (+30%), mưa to (+30%), và giao thông (+10%). Bạn được giảm 10% (Gold member) và 10,000đ (mã khuyến mãi)."
};
```

---

## 🌍 External API Integration

### Traffic API

**Providers:**
- **Google Maps Platform** (recommended for accuracy)
- HERE Maps
- TomTom Traffic
- OpenStreetMap (free, limited accuracy)

**Implementation:**

```typescript
// services/pricing-service/src/integrations/traffic.service.ts

import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class TrafficService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  
  async getTrafficData(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<TrafficData> {
    // 1. Check cache first
    const cacheKey = `traffic:${origin.lat},${origin.lng}:${destination.lat},${destination.lng}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // 2. Call Google Maps API
    const url = 'https://maps.googleapis.com/maps/api/directions/json';
    const response = await axios.get(url, {
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        departure_time: 'now',
        traffic_model: 'best_guess',
        key: process.env.GOOGLE_MAPS_API_KEY
      },
      timeout: 5000 // 5 seconds timeout
    });
    
    if (response.data.status !== 'OK') {
      throw new Error(`Traffic API error: ${response.data.status}`);
    }
    
    const route = response.data.routes[0];
    const leg = route.legs[0];
    
    // 3. Parse response
    const normalDuration = leg.duration.value; // seconds
    const trafficDuration = leg.duration_in_traffic?.value || normalDuration;
    const delayMinutes = (trafficDuration - normalDuration) / 60;
    
    // Determine traffic level
    let trafficLevel: TrafficLevel;
    if (delayMinutes < 3) trafficLevel = TrafficLevel.FREE_FLOW;
    else if (delayMinutes < 8) trafficLevel = TrafficLevel.LIGHT;
    else if (delayMinutes < 15) trafficLevel = TrafficLevel.MODERATE;
    else if (delayMinutes < 25) trafficLevel = TrafficLevel.HEAVY;
    else trafficLevel = TrafficLevel.CONGESTED;
    
    const trafficData: TrafficData = {
      sourceAPI: 'GOOGLE_MAPS',
      timestamp: new Date(),
      origin,
      destination,
      currentTrafficLevel: trafficLevel,
      speedKmh: (leg.distance.value / 1000) / (trafficDuration / 3600),
      delayMinutes: Math.max(0, delayMinutes)
    };
    
    // 4. Cache for 5 minutes
    await this.redis.setex(cacheKey, 5 * 60, JSON.stringify(trafficData));
    
    return trafficData;
  }
  
  // Fallback if API fails
  async getTrafficDataFallback(): Promise<TrafficData> {
    const hour = new Date().getHours();
    
    // Simple heuristic based on time
    let trafficLevel: TrafficLevel;
    if ([7, 8, 17, 18].includes(hour)) {
      trafficLevel = TrafficLevel.HEAVY; // Peak hours
    } else if ([11, 12, 19].includes(hour)) {
      trafficLevel = TrafficLevel.MODERATE;
    } else {
      trafficLevel = TrafficLevel.LIGHT;
    }
    
    return {
      sourceAPI: 'INTERNAL',
      timestamp: new Date(),
      origin: { latitude: 0, longitude: 0 },
      destination: { latitude: 0, longitude: 0 },
      currentTrafficLevel: trafficLevel,
      speedKmh: 30, // Assume average
      delayMinutes: 5
    };
  }
}
```

**Cost Optimization:**

```typescript
// Batch requests for nearby orders
class TrafficBatcher {
  private batch: Map<string, Promise<TrafficData>> = new Map();
  private batchTimer: NodeJS.Timeout | null = null;
  
  async getTraffic(origin, destination): Promise<TrafficData> {
    // Round coordinates to reduce unique requests
    const roundedOrigin = {
      lat: Math.round(origin.lat * 100) / 100,
      lng: Math.round(origin.lng * 100) / 100
    };
    const roundedDest = {
      lat: Math.round(destination.lat * 100) / 100,
      lng: Math.round(destination.lng * 100) / 100
    };
    
    const key = `${roundedOrigin.lat},${roundedOrigin.lng}-${roundedDest.lat},${roundedDest.lng}`;
    
    // Return existing promise if same request in flight
    if (this.batch.has(key)) {
      return this.batch.get(key)!;
    }
    
    // Create new promise
    const promise = this.fetchTrafficData(roundedOrigin, roundedDest);
    this.batch.set(key, promise);
    
    // Clean up after 100ms
    if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => {
        this.batch.clear();
        this.batchTimer = null;
      }, 100);
    }
    
    return promise;
  }
}
```

### Weather API

**Providers:**
- **OpenWeatherMap** (free tier: 1,000 calls/day)
- WeatherAPI.com
- AccuWeather

**Implementation:**

```typescript
// services/pricing-service/src/integrations/weather.service.ts

@Injectable()
export class WeatherService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  
  async getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
    // 1. Round coordinates to reduce API calls
    const lat = Math.round(latitude * 10) / 10; // 1 decimal place (~11km precision)
    const lng = Math.round(longitude * 10) / 10;
    
    // 2. Check cache (15 minutes)
    const cacheKey = `weather:${lat},${lng}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // 3. Call OpenWeatherMap API
    const url = 'https://api.openweathermap.org/data/2.5/weather';
    const response = await axios.get(url, {
      params: {
        lat,
        lon: lng,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric'
      },
      timeout: 3000
    });
    
    // 4. Get forecast
    const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    const forecastResponse = await axios.get(forecastUrl, {
      params: {
        lat,
        lon: lng,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
        cnt: 3 // Next 9 hours (3-hour intervals)
      }
    });
    
    // 5. Parse
    const weatherData: WeatherData = {
      sourceAPI: 'OPENWEATHER',
      timestamp: new Date(),
      city: response.data.name,
      latitude: lat,
      longitude: lng,
      condition: this.mapWeatherCondition(response.data.weather[0]),
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      windSpeedKmh: response.data.wind.speed * 3.6, // m/s to km/h
      precipitationMm: response.data.rain?.['1h'] || 0,
      forecast: forecastResponse.data.list.map(item => ({
        time: new Date(item.dt * 1000),
        condition: this.mapWeatherCondition(item.weather[0]),
        precipitationProbability: item.pop,
        precipitationMm: item.rain?.['3h'] || 0
      })),
      alerts: response.data.alerts || []
    };
    
    // 6. Cache for 15 minutes
    await this.redis.setex(cacheKey, 15 * 60, JSON.stringify(weatherData));
    
    return weatherData;
  }
  
  private mapWeatherCondition(weather: any): WeatherCondition {
    const main = weather.main.toLowerCase();
    const id = weather.id;
    
    if (main.includes('clear')) return WeatherCondition.CLEAR;
    if (main.includes('cloud')) return WeatherCondition.CLOUDY;
    
    if (main.includes('rain') || main.includes('drizzle')) {
      // Light rain: 200-500, Heavy rain: 501-531
      if (id >= 501) return WeatherCondition.RAIN_HEAVY;
      return WeatherCondition.RAIN_LIGHT;
    }
    
    if (main.includes('storm') || main.includes('thunderstorm')) {
      return WeatherCondition.STORM;
    }
    
    return WeatherCondition.CLEAR;
  }
}
```

**Weather Alerts Integration:**

```typescript
// Subscribe to weather alerts (webhook)
@Injectable()
export class WeatherAlertService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly notificationService: NotificationService
  ) {
    // Poll for alerts every 5 minutes
    setInterval(() => this.checkAlerts(), 5 * 60 * 1000);
  }
  
  async checkAlerts() {
    const cities = ['TP.HCM', 'Hà Nội', 'Đà Nẵng'];
    
    for (const city of cities) {
      const coords = this.getCityCoordinates(city);
      const weather = await this.weatherService.getWeatherData(coords.lat, coords.lng);
      
      if (weather.alerts && weather.alerts.length > 0) {
        for (const alert of weather.alerts) {
          if (alert.severity === 'SEVERE' || alert.severity === 'EXTREME') {
            // Notify ops team
            await this.notificationService.sendAlert({
              type: 'WEATHER_ALERT',
              severity: alert.severity,
              city,
              message: alert.description,
              action: 'INCREASE_MULTIPLIERS' // Suggest action
            });
            
            // Auto-increase multipliers if extreme
            if (alert.severity === 'EXTREME') {
              await this.autoAdjustMultipliers(city, alert.type);
            }
          }
        }
      }
    }
  }
  
  private async autoAdjustMultipliers(city: string, alertType: string) {
    // Auto-increase storm multiplier to 1.8x
    if (alertType === 'STORM' || alertType === 'TYPHOON') {
      await this.pricingService.updateMultiplier({
        zone: city,
        parameter: 'stormMultiplier',
        value: 1.8,
        reason: `Auto-adjusted for ${alertType} alert`,
        duration: 24 // hours
      });
      
      // Notify drivers
      await this.notificationService.notifyDrivers({
        zone: city,
        message: 'Cảnh báo thời tiết nguy hiểm! Giá đơn tăng 80%. Ưu tiên an toàn.',
        priority: 'HIGH'
      });
    }
  }
}
```

---

## 🤖 ML Models

### 1. Price Optimization Model

**Goal:** Find optimal price for each order to maximize objective

**Algorithm:** Deep Q-Network (DQN) - Reinforcement Learning

**Architecture:**

```python
# ml-service/models/price_optimizer.py

import tensorflow as tf
from tensorflow import keras
import numpy as np

class PriceOptimizerDQN:
    def __init__(self, state_size=15, action_size=7):
        self.state_size = state_size
        self.action_size = action_size
        
        # Hyperparameters
        self.gamma = 0.95 # Discount factor
        self.epsilon = 1.0 # Exploration rate
        self.epsilon_min = 0.01
        self.epsilon_decay = 0.995
        self.learning_rate = 0.001
        
        # Build models
        self.model = self._build_model()
        self.target_model = self._build_model()
        self.update_target_model()
        
        # Experience replay
        self.memory = []
        self.memory_size = 10000
    
    def _build_model(self):
        """Neural network for Q-value estimation"""
        model = keras.Sequential([
            keras.layers.Dense(128, activation='relu', input_shape=(self.state_size,)),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(self.action_size, activation='linear') # Q-values
        ])
        
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=self.learning_rate),
            loss='mse'
        )
        
        return model
    
    def update_target_model(self):
        """Copy weights from model to target_model"""
        self.target_model.set_weights(self.model.get_weights())
    
    def remember(self, state, action, reward, next_state, done):
        """Store experience in replay memory"""
        self.memory.append((state, action, reward, next_state, done))
        if len(self.memory) > self.memory_size:
            self.memory.pop(0)
    
    def act(self, state):
        """Choose action (epsilon-greedy)"""
        if np.random.rand() <= self.epsilon:
            return np.random.randint(self.action_size) # Explore
        
        q_values = self.model.predict(state, verbose=0)
        return np.argmax(q_values[0]) # Exploit
    
    def replay(self, batch_size=32):
        """Train on batch of experiences"""
        if len(self.memory) < batch_size:
            return
        
        # Sample batch
        batch = np.random.choice(len(self.memory), batch_size, replace=False)
        
        for i in batch:
            state, action, reward, next_state, done = self.memory[i]
            
            # Target Q-value
            target = reward
            if not done:
                target += self.gamma * np.amax(self.target_model.predict(next_state, verbose=0)[0])
            
            # Current Q-values
            target_vec = self.model.predict(state, verbose=0)
            target_vec[0][action] = target
            
            # Train
            self.model.fit(state, target_vec, epochs=1, verbose=0)
        
        # Decay epsilon
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay
    
    def optimize_price(self, state):
        """Get optimized price for current state"""
        q_values = self.model.predict(state, verbose=0)
        best_action = np.argmax(q_values)
        
        # Map action to price multiplier
        actions = [-0.10, -0.05, 0.0, +0.05, +0.10, +0.15, +0.20]
        multiplier = 1.0 + actions[best_action]
        
        return {
            'multiplier': multiplier,
            'confidence': np.max(tf.nn.softmax(q_values)),
            'q_value': np.max(q_values)
        }

# Training loop
def train_optimizer(historical_orders, num_episodes=1000):
    optimizer = PriceOptimizerDQN()
    
    for episode in range(num_episodes):
        # Sample random order from history
        order = historical_orders.sample(1).iloc[0]
        state = prepare_state(order)
        
        total_reward = 0
        for step in range(10): # Max 10 price adjustments
            # Choose action
            action = optimizer.act(state)
            
            # Simulate outcome
            next_state, reward, done = simulate_outcome(state, action)
            
            # Remember
            optimizer.remember(state, action, reward, next_state, done)
            
            # Learn
            optimizer.replay()
            
            total_reward += reward
            state = next_state
            
            if done:
                break
        
        # Update target network every 10 episodes
        if episode % 10 == 0:
            optimizer.update_target_model()
            print(f"Episode {episode}, Total Reward: {total_reward:.2f}, Epsilon: {optimizer.epsilon:.4f}")
    
    # Save model
    optimizer.model.save('price_optimizer_v1.h5')
    
    return optimizer
```

**State Representation:**

```python
def prepare_state(order):
    """Convert order to state vector for ML model"""
    return np.array([
        order['distance'] / 50.0, # Normalized (max 50km)
        order['duration'] / 120.0, # Normalized (max 120 min)
        order['hour_of_day'] / 24.0,
        order['day_of_week'] / 7.0,
        order['is_peak_hour'], # 0 or 1
        order['is_weekend'], # 0 or 1
        order['weather_code'] / 5.0, # 0=clear, 5=storm
        order['rain_mm'] / 50.0, # Normalized
        order['traffic_level'] / 5.0, # 0=free, 5=congested
        order['demand_supply_ratio'] / 3.0, # Normalized
        order['competitor_avg_price'] / 100_000.0, # Normalized
        order['current_price'] / 100_000.0,
        order['customer_price_sensitivity'], # 0-1 (ML-predicted)
        order['driver_availability'] / 100.0,
        order['historical_acceptance_rate'] # For similar orders
    ]).reshape(1, -1)
```

**Reward Function:**

```python
def calculate_reward(order, price, outcome):
    """Calculate reward for reinforcement learning"""
    if outcome == 'COMPLETED':
        # Order completed successfully
        revenue = price
        cost = estimate_cost(order)
        profit = revenue - cost
        
        # Reward = profit + bonus for driver satisfaction
        driver_earning = price * (1 - COMMISSION)
        driver_satisfaction_bonus = 0
        if driver_earning > MIN_DRIVER_EARNING * 1.2:
            driver_satisfaction_bonus = 1000 # Good earning
        
        reward = profit + driver_satisfaction_bonus
        
        # Penalty if price was too high (lost future customers)
        if price > COMPETITOR_AVG * 1.15:
            reward -= 2000 # Competitive penalty
        
        return reward
    
    elif outcome == 'CANCELLED_BY_USER':
        # User cancelled → price too high
        return -5000 # High penalty
    
    elif outcome == 'NO_DRIVER_ACCEPTED':
        # No driver → price too low or location bad
        return -3000
    
    else:
        return -1000 # Other failures
```

**Deployment API:**

```python
# ml-service/app.py

from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf

app = FastAPI()

# Load model
price_optimizer = tf.keras.models.load_model('price_optimizer_v1.h5')

class PriceOptimizationRequest(BaseModel):
    distance: float
    duration: float
    hour_of_day: int
    weather: str
    traffic_level: str
    demand_supply_ratio: float
    current_price: float
    # ... other features

@app.post('/optimize-price')
async def optimize_price(request: PriceOptimizationRequest):
    # Prepare state
    state = prepare_state_from_request(request)
    
    # Predict Q-values
    q_values = price_optimizer.predict(state)
    best_action = int(np.argmax(q_values))
    
    # Map to price multiplier
    actions = [-0.10, -0.05, 0.0, +0.05, +0.10, +0.15, +0.20]
    multiplier = 1.0 + actions[best_action]
    optimized_price = request.current_price * multiplier
    
    return {
        'original_price': request.current_price,
        'optimized_price': round(optimized_price, -3), # Round to nearest 1000
        'multiplier': multiplier,
        'confidence': float(tf.nn.softmax(q_values)[0][best_action]),
        'expected_reward': float(np.max(q_values))
    }
```

### 2. Demand Forecasting Model

**Goal:** Predict demand level for next 30-60 minutes

**Algorithm:** LSTM (Long Short-Term Memory)

```python
# ml-service/models/demand_forecaster.py

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import pandas as pd
import numpy as np

class DemandForecaster:
    def __init__(self, timesteps=12, features=10):
        self.timesteps = timesteps # 12 x 5-minute intervals = 1 hour
        self.features = features
        self.model = self._build_model()
    
    def _build_model(self):
        model = Sequential([
            LSTM(50, return_sequences=True, input_shape=(self.timesteps, self.features)),
            Dropout(0.2),
            LSTM(50, return_sequences=False),
            Dropout(0.2),
            Dense(25, activation='relu'),
            Dense(1, activation='linear') # Predicted demand level
        ])
        
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        return model
    
    def train(self, historical_data, epochs=50):
        """Train on historical demand data"""
        X, y = self.prepare_sequences(historical_data)
        
        self.model.fit(
            X, y,
            epochs=epochs,
            batch_size=32,
            validation_split=0.2,
            verbose=1
        )
        
        self.model.save('demand_forecaster_v1.h5')
    
    def prepare_sequences(self, data):
        """Convert time series to sequences"""
        sequences = []
        targets = []
        
        for i in range(len(data) - self.timesteps - 12): # Predict 12 steps (1 hour) ahead
            seq = data[i:i+self.timesteps]
            target = data[i+self.timesteps+12]['demand'] # 1 hour later
            
            sequences.append(seq.values)
            targets.append(target)
        
        return np.array(sequences), np.array(targets)
    
    def predict(self, recent_data):
        """Predict demand for next hour"""
        sequence = recent_data[-self.timesteps:].values.reshape(1, self.timesteps, self.features)
        prediction = self.model.predict(sequence, verbose=0)
        return float(prediction[0][0])

# Features for demand forecasting
DEMAND_FEATURES = [
    'orders_count', # Current 5-min window
    'hour_of_day',
    'day_of_week',
    'is_holiday',
    'weather_code',
    'temperature',
    'rain_mm',
    'traffic_level',
    'historical_demand_same_time_last_week',
    'historical_demand_same_time_yesterday'
]
```

---

## 📊 Performance Metrics

### Pricing Performance

```sql
-- Daily pricing analytics
SELECT 
  DATE(created_at) as date,
  service_type,
  zone,
  
  -- Revenue
  SUM(final_price) as total_revenue,
  AVG(final_price) as avg_price,
  
  -- Orders
  COUNT(*) as total_orders,
  
  -- Multipliers
  AVG(time_multiplier) as avg_time_multiplier,
  AVG(weather_multiplier) as avg_weather_multiplier,
  AVG(traffic_multiplier) as avg_traffic_multiplier,
  AVG(demand_multiplier) as avg_demand_multiplier,
  
  -- Discounts
  SUM(promo_discount + membership_discount) as total_discounts,
  AVG((promo_discount + membership_discount) / final_price) as avg_discount_rate,
  
  -- Profitability
  SUM(platform_fee) as total_profit,
  AVG(platform_fee / final_price) as avg_profit_margin,
  
  -- Driver earnings
  SUM(driver_earning) as total_driver_earnings,
  AVG(driver_earning) as avg_driver_earning

FROM orders
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), service_type, zone
ORDER BY date DESC, total_revenue DESC;
```

### ML Model Performance

```python
# Evaluate price optimizer
def evaluate_optimizer(test_orders):
    total_orders = len(test_orders)
    
    # Metrics
    revenue_with_ml = 0
    revenue_without_ml = 0
    completed_with_ml = 0
    completed_without_ml = 0
    
    for order in test_orders:
        # With ML optimization
        state = prepare_state(order)
        optimized_price = optimizer.optimize_price(state)
        outcome_ml = simulate_outcome(order, optimized_price)
        
        if outcome_ml == 'COMPLETED':
            revenue_with_ml += optimized_price
            completed_with_ml += 1
        
        # Without ML (fixed pricing)
        fixed_price = calculate_fixed_price(order)
        outcome_fixed = simulate_outcome(order, fixed_price)
        
        if outcome_fixed == 'COMPLETED':
            revenue_without_ml += fixed_price
            completed_without_ml += 1
    
    # Results
    print(f"Total Orders: {total_orders}")
    print(f"Completed (ML): {completed_with_ml} ({completed_with_ml/total_orders*100:.1f}%)")
    print(f"Completed (Fixed): {completed_without_ml} ({completed_without_ml/total_orders*100:.1f}%)")
    print(f"Revenue (ML): {revenue_with_ml:,.0f} VND")
    print(f"Revenue (Fixed): {revenue_without_ml:,.0f} VND")
    print(f"Revenue Improvement: {(revenue_with_ml/revenue_without_ml-1)*100:.1f}%")
```

**Expected ML Performance:**
- Revenue improvement: **+15-25%**
- Order completion rate: **+5-10%**
- Driver earnings: **+10-15%**
- Customer satisfaction: **+0.2-0.3 stars**

---

## 🔄 Real-time Price Updates

### WebSocket for Live Pricing

```typescript
// Real-time price stream for user app
@WebSocketGateway({ namespace: '/pricing' })
export class PricingGateway {
  @WebSocketServer()
  server: Server;
  
  @SubscribeMessage('subscribe-price')
  async handlePriceSubscription(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { origin, destination, serviceType }
  ) {
    const subscriptionKey = `price:${data.origin.lat},${data.origin.lng}:${data.destination.lat},${data.destination.lng}`;
    
    // Join room
    client.join(subscriptionKey);
    
    // Send initial price
    const price = await this.calculatePrice(data);
    client.emit('price-update', price);
    
    // Monitor for changes
    this.startPriceMonitoring(subscriptionKey, data);
  }
  
  private async startPriceMonitoring(key: string, data: any) {
    const interval = setInterval(async () => {
      // Recalculate price every 30 seconds
      const price = await this.calculatePrice(data);
      
      // Emit to all subscribed clients
      this.server.to(key).emit('price-update', price);
      
      // If surge pricing activated, notify prominently
      if (price.breakdown.demandSurcharge > 0) {
        this.server.to(key).emit('surge-alert', {
          multiplier: price.appliedMultipliers.find(m => m.name.includes('Demand')).multiplier,
          reason: "High demand in your area"
        });
      }
    }, 30 * 1000);
    
    // Clean up after 5 minutes if no order placed
    setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
  }
}
```

---

**File Status:** Core pricing engine complete (~3,500 lines)
**Next:** Admin UI specs, Promotion Management, Summary

Xem tiếp file `AI_PRICING_ADMIN_UI.md` →
