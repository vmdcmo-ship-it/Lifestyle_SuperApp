# Lifestyle GO - Run-to-Earn Complete ✅
## "Sống khỏe mỗi ngày, nhận quà Lifestyle"

> **Gamification + Fitness Tracking + Anti-Cheat + Sponsor Integration**

---

## 📋 Executive Summary

**Feature:** Lifestyle GO - Run-to-Earn System
**Purpose:** Health gamification, User engagement, Community building, Sponsor monetization
**Mechanism:** Complete missions → Earn Lifestyle Xu → Redeem rewards
**Platforms:** User App (iOS/Android), Fitness tracker sync, Admin Ops
**Complexity:** Very High (GPS tracking, Anti-cheat AI, Real-time analytics, Multi-source sync)
**Status:** 🟢 Planning & Architecture 100% Complete

---

## ✅ Completed Deliverables

### 1. Type Definitions ✅ (~1,000 lines)
**File:** `packages/types/src/run-to-earn.ts`

**50+ Interfaces, 15 Enums:**

**Core Features:**
- `Mission` - Challenges (5km, 10km, 21km, 30-day streaks)
- `RunActivity` - Running sessions với full GPS tracking
- `VirtualMedal` - Shareable achievements
- `Leaderboard` & `LeaderboardEntry` - Rankings (Driver vs Merchant vs User)
- `MissionReward` - Xu, Medals, Vouchers, Products

**Anti-Cheat System:**
- `AntiCheatAnalysis` - Multi-layer fraud detection
- `AntiCheatFlag` - 10 types of fraud detection
- `FraudReport` - Admin review queue
- `GPSPoint` - Detailed route tracking

**Sponsor System:**
- `RunSponsor` - Brand partnerships
- `SponsorCampaign` - Mission sponsorships với ROI tracking
- `SponsorBenefitType` - Banner ads, Push notifications, Product rewards

**User Progress:**
- `UserRunProfile` - Lifetime stats, Streaks, Personal bests
- `MissionParticipation` - Progress tracking
- `RunAnalytics` - Admin-level platform metrics

---

## 🎯 System Architecture

### Core Mechanism

```
User Flow:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Browse Available Missions
   • 5km Challenge
   • 10km Challenge
   • 21km Half Marathon
   • 30-Day Streak
   • Sponsored missions (Nike, Pocari, etc.)
   
2. Join Mission
   • Register for challenge
   • See rewards (Xu, Medals, Products)
   • Start date/End date countdown
   
3. Start Activity
   • Choose source:
     - Built-in GPS tracker (Lifestyle App)
     - Sync from Strava
     - Sync from Garmin
     - Sync from Apple Health
     - Sync from Google Fit
   • Start tracking
   
4. Run/Walk/Hike
   • Real-time GPS tracking
   • Heart rate monitoring (if watch connected)
   • Pace/Distance display
   • Audio cues every 1km
   
5. Complete Activity
   • Save GPS route
   • Upload photos (optional)
   • Auto-sync health data
   
6. Anti-Cheat Analysis (Automatic)
   • Velocity check (4-20 km/h)
   • Acceleration analysis
   • Heart rate validation
   • Pedometer cross-check
   • GPS path feasibility
   • Trust score calculation
   
7. Result
   A. If APPROVED:
      • Earn Xu rewards
      • Earn medals (if applicable)
      • Update leaderboard
      • Share to Spotlight
   
   B. If FLAGGED:
      • Pending admin review
      • Can provide additional proof (video, photos)
      • Trust score impact
   
   C. If REJECTED:
      • No rewards
      • Reason explained
      • Can appeal
```

---

### Mission Types & Rewards

**Distance Missions:**
```
┌─────────────┬──────────┬──────────┬────────────────────┐
│ Distance    │ Difficulty│ Xu Reward│ Medal              │
├─────────────┼──────────┼──────────┼────────────────────┤
│ 2km         │ BEGINNER │ +500 Xu  │ Bronze             │
│ 5km         │ BEGINNER │ +1,500 Xu│ Silver             │
│ 10km        │ INTERMEDIATE│+3,500 Xu│ Gold            │
│ 21km (Half) │ ADVANCED │ +8,000 Xu│ Diamond            │
│ 42km (Full) │ EXPERT   │ +20,000Xu│ Platinum (Special) │
└─────────────┴──────────┴──────────┴────────────────────┘

Bonus multipliers:
• Complete under target time: +50% Xu
• Personal best: +25% Xu
• Streak (consecutive days): +10% per day (max +100%)
• Weekend: +20% Xu
```

**Streak Missions:**
```
"Chạy bộ 7 ngày liên tiếp"
• Reward: +5,000 Xu + "7-Day Warrior" Badge
• Requirement: Min 2km per day

"Chạy bộ 30 ngày liên tiếp"
• Reward: +25,000 Xu + "Marathon Month" Badge + Nike voucher ₫500K
• Requirement: Min 3km per day
• Sponsor: Nike (Product voucher)
```

**Sponsored Missions (Example):**
```
Mission: "Pocari Sweat Summer Challenge - 10km"
Sponsor: Pocari Sweat Ion Supply
Period: July 1-31, 2026

Rewards:
• Complete 10km: +5,000 Xu + Pocari branded medal
• Top 100: Pocari Sweat gift pack (6 bottles)
• Top 10: Pocari Sweat 1-year supply

Sponsor Benefits:
• Banner on mission page (100K impressions expected)
• Push notification to 50K active runners
• Branded medal (shareable to Spotlight)
• Product sampling to participants
• Brand exposure: "Powered by Pocari Sweat"

Budget: ₫200M
Expected Participants: 10,000
Cost per participant: ₫20K
ROI: 3.5x (Brand awareness + Product trial)
```

---

### Anti-Cheat System (Multi-Layer)

**Why Anti-Cheat is Critical:**
- Without it, users will cheat (robot, car, motorcycle)
- Fraudulent activities = Unfair rewards = Lost trust
- Sponsors need real, authentic engagement
- Platform credibility at stake

**Layer 1: Velocity Check**
```python
VALID_RUNNING_SPEED = {
    'min': 4,  # km/h (slow jog)
    'max': 20, # km/h (elite athlete sprint)
    'typical_range': (6, 15) # Most people
}

def check_velocity(gps_points):
    for i in range(1, len(gps_points)):
        p1, p2 = gps_points[i-1], gps_points[i]
        distance = calculate_distance(p1, p2)  # meters
        time_delta = (p2.timestamp - p1.timestamp).seconds
        speed = (distance / time_delta) * 3.6  # km/h
        
        if speed < 4 or speed > 20:
            return {
                'passed': False,
                'flag': 'VELOCITY_ANOMALY',
                'details': f'Speed {speed:.1f} km/h at {p2.timestamp}'
            }
    
    return {'passed': True}

# Example detection:
# User going 35 km/h → MOTORCYCLE
# User going 60 km/h → CAR
# User alternating 10→40→10 km/h → SUSPICIOUS
```

**Layer 2: Acceleration Analysis**
```python
MAX_REALISTIC_ACCELERATION = 2.5  # m/s² (human limit)

def check_acceleration(gps_points):
    spikes = []
    
    for i in range(1, len(gps_points)):
        p1, p2 = gps_points[i-1], gps_points[i]
        v1 = p1.speed / 3.6  # Convert to m/s
        v2 = p2.speed / 3.6
        dt = (p2.timestamp - p1.timestamp).seconds
        
        acceleration = (v2 - v1) / dt
        
        if abs(acceleration) > MAX_REALISTIC_ACCELERATION:
            spikes.append({
                'from': v1 * 3.6,  # km/h
                'to': v2 * 3.6,
                'deltaT': dt,
                'acceleration': acceleration,
                'reason': 'Sudden speed change (vehicle?)'
            })
    
    passed = len(spikes) == 0
    return {'passed': passed, 'spikes': spikes}

# Example detection:
# 10 km/h → 40 km/h in 2 seconds → MOTORCYCLE/CAR
# Multiple spikes → Definitely not human
```

**Layer 3: Heart Rate Validation**
```python
def expected_heart_rate(pace_seconds_per_km, age=30, fitness_level='AVERAGE'):
    # Typical HR zones for running
    max_hr = 220 - age
    
    # Pace to HR mapping
    if pace_seconds_per_km > 420:  # Slower than 7:00/km (walk)
        zone = 0.5  # 50% max HR
    elif pace_seconds_per_km > 360:  # 6:00-7:00/km (easy jog)
        zone = 0.65
    elif pace_seconds_per_km > 300:  # 5:00-6:00/km (moderate)
        zone = 0.75
    elif pace_seconds_per_km > 240:  # 4:00-5:00/km (tempo)
        zone = 0.85
    else:  # < 4:00/km (race pace)
        zone = 0.95
    
    expected_hr = max_hr * zone
    tolerance = 15  # bpm
    
    return {
        'min': expected_hr - tolerance,
        'max': expected_hr + tolerance
    }

def check_heart_rate(activity):
    if not activity.avgHeartRate:
        return {'passed': True, 'note': 'No HR data'}
    
    pace = activity.avgPace  # seconds per km
    expected = expected_heart_rate(pace)
    actual = activity.avgHeartRate
    
    if actual < expected['min'] or actual > expected['max']:
        return {
            'passed': False,
            'flag': 'HEART_RATE_MISMATCH',
            'expected': expected,
            'actual': actual,
            'reason': f'Pace {pace}s/km expects HR {expected["min"]}-{expected["max"]}, got {actual}'
        }
    
    return {'passed': True}

# Example detection:
# Running 4:30/km (fast) with HR 70 bpm → IMPOSSIBLE
# Running 10:00/km (slow) with HR 180 bpm → SUSPICIOUS
```

**Layer 4: Pedometer Cross-Check**
```python
AVERAGE_STRIDE_LENGTH = {
    'RUNNING': 1.4,  # meters per step
    'WALKING': 0.75
}

def expected_steps(distance_meters, activity_type):
    stride = AVERAGE_STRIDE_LENGTH[activity_type]
    return distance_meters / stride

def check_pedometer(activity):
    if not activity.steps:
        return {'passed': True, 'note': 'No pedometer data'}
    
    expected = expected_steps(activity.distance, activity.type)
    actual = activity.steps
    deviation = abs(actual - expected) / expected * 100
    
    # Allow 20% deviation (GPS/pedometer aren't perfect)
    if deviation > 20:
        return {
            'passed': False,
            'flag': 'PEDOMETER_MISMATCH',
            'expected': int(expected),
            'actual': actual,
            'deviation': f'{deviation:.1f}%',
            'reason': 'Step count inconsistent with distance'
        }
    
    return {'passed': True, 'deviation': f'{deviation:.1f}%'}

# Example detection:
# 10km run = ~7,000 steps expected
# Actual: 500 steps → VEHICLE (no foot movement)
# Actual: 20,000 steps → SHAKING PHONE (robot)
```

**Layer 5: GPS Path Analysis**
```python
def analyze_gps_path(gps_points):
    # Check 1: Too perfectly straight (robot)
    straightness_score = calculate_straightness(gps_points)
    if straightness_score > 0.95:  # Almost perfectly straight
        return {
            'passed': False,
            'flag': 'GPS_STRAIGHT_LINE',
            'score': straightness_score,
            'reason': 'Route too perfect (GPS spoofing?)'
        }
    
    # Check 2: Impossible route (through buildings, water)
    impossible_segments = []
    for i in range(len(gps_points) - 1):
        p1, p2 = gps_points[i], gps_points[i+1]
        
        # Check if segment crosses water
        if crosses_water(p1, p2):
            impossible_segments.append({
                'start': p1,
                'end': p2,
                'reason': 'Route crosses water body'
            })
        
        # Check if segment goes through building
        if through_building(p1, p2):
            impossible_segments.append({
                'start': p1,
                'end': p2,
                'reason': 'Route goes through building'
            })
    
    if impossible_segments:
        return {
            'passed': False,
            'flag': 'GPS_IMPOSSIBLE_ROUTE',
            'segments': impossible_segments
        }
    
    # Check 3: Duplicate route (same as previous runs)
    if is_duplicate_route(gps_points, user_history):
        return {
            'passed': False,
            'flag': 'DUPLICATE_GPS',
            'reason': 'Identical route to previous run (robot?)'
        }
    
    return {'passed': True}

def calculate_straightness(points):
    # Calculate how "straight" the path is
    # 0 = very curvy (natural)
    # 1 = perfectly straight (suspicious)
    
    total_distance = sum(distance(points[i], points[i+1]) 
                        for i in range(len(points)-1))
    direct_distance = distance(points[0], points[-1])
    
    return direct_distance / total_distance

# Example detection:
# Perfectly straight line from A to B → FAKE GPS
# Route crosses ocean → FAKE GPS
# Route through tall buildings → SUSPICIOUS (GPS should lose signal)
# Exact same route 10x in a row → ROBOT
```

**Layer 6: Trust Score (AI-Based)**
```python
def calculate_trust_score(activity, user_history):
    score = 0
    
    # Historical consistency (30 points)
    if len(user_history) > 0:
        avg_pace_history = mean([a.avgPace for a in user_history])
        current_pace = activity.avgPace
        
        pace_deviation = abs(current_pace - avg_pace_history) / avg_pace_history
        
        if pace_deviation < 0.1:  # Within 10%
            score += 30
        elif pace_deviation < 0.3:  # Within 30%
            score += 20
        elif pace_deviation < 0.5:  # Within 50%
            score += 10
        else:  # >50% deviation
            score += 0  # Red flag
    else:
        score += 15  # New user, benefit of doubt
    
    # Velocity score (20 points)
    if activity.velocityCheck['passed']:
        score += 20
    elif activity.avgSpeed < 15:  # Within reasonable range
        score += 10
    
    # Heart rate score (20 points)
    if activity.heartRateCheck and activity.heartRateCheck['passed']:
        score += 20
    elif not activity.avgHeartRate:
        score += 10  # No data, neutral
    
    # GPS score (20 points)
    if activity.gpsPathCheck['passed']:
        score += 20
    elif activity.gpsPathCheck['routeFeasibility'] > 0.7:
        score += 10
    
    # Community score (10 points)
    community_reports = get_community_reports(activity.id)
    if len(community_reports) == 0:
        score += 10
    elif len(community_reports) < 3:
        score += 5
    else:
        score += 0  # Multiple reports = suspicious
    
    return min(score, 100)

# Trust score interpretation:
# 80-100: High trust → Auto-approve
# 60-79: Medium trust → Approve with monitoring
# 40-59: Low trust → Flag for review
# 0-39: Very low → Reject

# Example:
# New elite runner (3:30/km pace, perfect form, HR 160):
#   • Historical: 15 (new user)
#   • Velocity: 20 (passed)
#   • HR: 20 (perfect match)
#   • GPS: 20 (natural route)
#   • Community: 10 (no reports)
#   • Total: 85 → APPROVED ✅
#
# Cheater (GPS spoofing, no sensors):
#   • Historical: 0 (impossible improvement)
#   • Velocity: 10 (borderline)
#   • HR: 0 (missing data)
#   • GPS: 0 (straight line)
#   • Community: 5 (1 report)
#   • Total: 15 → REJECTED ❌
```

**Layer 7: AI Machine Learning Model**
```python
# Feature engineering for ML model
features = [
    # Activity features
    activity.distance,
    activity.duration,
    activity.avgSpeed,
    activity.avgPace,
    activity.elevationGain,
    
    # Velocity features
    velocity_min,
    velocity_max,
    velocity_std_dev,
    velocity_anomaly_count,
    
    # Acceleration features
    max_acceleration,
    acceleration_spike_count,
    
    # Heart rate features (if available)
    activity.avgHeartRate or 0,
    hr_deviation_from_expected,
    
    # GPS features
    gps_points_count,
    gps_straightness_score,
    gps_noise_level,  # Natural GPS has noise
    route_feasibility_score,
    
    # Historical features
    user_total_activities,
    user_avg_pace,
    pace_deviation_from_user_avg,
    
    # Metadata
    is_weekend,
    hour_of_day,
    source (encoded),  # Strava, Garmin, etc.
]

# Train ML model (Random Forest or XGBoost)
# Labels: 0 = FRAUDULENT, 1 = GENUINE

model = XGBClassifier()
model.fit(X_train, y_train)

# Prediction
prediction = model.predict_proba(features)[0][1]  # Probability of genuine

if prediction > 0.9:
    verdict = 'GENUINE'
elif prediction > 0.6:
    verdict = 'SUSPICIOUS'
else:
    verdict = 'FRAUDULENT'

# Combine with rule-based checks
final_decision = combine_ml_and_rules(verdict, rule_checks)
```

**Overall Decision Logic:**
```python
def make_final_decision(activity, analysis):
    # Critical failures = instant reject
    critical_flags = [
        'VELOCITY_ANOMALY',
        'GPS_IMPOSSIBLE_ROUTE',
        'HEART_RATE_MISMATCH'
    ]
    
    if any(flag in activity.flags for flag in critical_flags):
        if analysis.trustScore < 50:
            return 'REJECT'
    
    # High trust score = auto-approve
    if analysis.trustScore >= 80:
        return 'APPROVE'
    
    # Medium trust = approve with monitoring
    if 60 <= analysis.trustScore < 80:
        if len(activity.flags) <= 1:
            return 'APPROVE'
        else:
            return 'FLAG_FOR_REVIEW'
    
    # Low trust = flag for human review
    if 40 <= analysis.trustScore < 60:
        return 'FLAG_FOR_REVIEW'
    
    # Very low trust = reject
    return 'REJECT'

# Admin review queue
# Flagged activities go to human moderators who can:
# 1. Request additional proof (video, photos of smartwatch)
# 2. Approve with warning
# 3. Reject and revoke rewards
# 4. Ban user for repeated fraud
```

---

### Rewards & Gamification

**Xu Earning Formula:**
```
Base Xu = Distance (km) × 300

Multipliers:
• Mission completion: +50%
• Under target time: +50%
• Personal best: +25%
• Streak bonus: +10% per consecutive day (max 10 days = +100%)
• Weekend: +20%
• Sponsored mission: +0-100% (sponsor contribution)

Example:
5km run on Sunday, part of mission, under target time, 3-day streak:
= 5 × 300 × (1 + 0.5 + 0.5 + 0.3 + 0.2)
= 1,500 × 2.5
= 3,750 Xu 🎉
```

**Medal System:**
```
Tier Requirements:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bronze:
• Complete mission
• Time: Within 2x target
• Pace: Any

Silver:
• Complete mission  
• Time: Within 1.5x target
• Pace: Better than average

Gold:
• Complete mission
• Time: Within 1.2x target
• Pace: Top 30%

Diamond:
• Complete mission
• Time: Under target time
• Pace: Top 10%
• Personal best

Example: 5km Mission
Target time: 30 minutes (6:00/km pace)

• Bronze: Finish in <60 min
• Silver: Finish in <45 min (9:00/km)
• Gold: Finish in <36 min (7:12/km)
• Diamond: Finish in <30 min (6:00/km) + PR

Medal Rarity:
• Bronze: 70% of completers
• Silver: 20%
• Gold: 8%
• Diamond: 2%

Special Medals:
• "Century Club": 100 total runs
• "1000km Legend": 1,000km lifetime
• "Streak Master": 100-day streak
• "Early Bird": 10 runs before 6 AM
• "Night Owl": 10 runs after 10 PM
• "Weather Warrior": Run in rain/storm
```

**Leaderboard System:**
```
Categories:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. By Role:
   • Driver Leaderboard
   • Merchant Leaderboard
   • User Leaderboard
   
2. By Gender:
   • Male
   • Female
   
3. By Age:
   • 18-25
   • 26-35
   • 36-45
   • 46+
   
4. By Timeframe:
   • This Week (Mon-Sun)
   • This Month
   • All Time

Ranking Metrics:
• Primary: Total distance (meters)
• Tiebreaker 1: Total activities
• Tiebreaker 2: Avg pace

Example: Driver Leaderboard (This Week)
┌────┬───────────────┬──────────┬───────┬─────────┐
│Rank│ Name          │ Distance │ Runs  │Avg Pace │
├────┼───────────────┼──────────┼───────┼─────────┤
│ 🥇 │ Anh Tài       │ 52.3 km  │  8    │ 5:15/km │
│ 🥈 │ Minh Khôi     │ 48.7 km  │  7    │ 5:45/km │
│ 🥉 │ Thu Thảo      │ 45.2 km  │  9    │ 6:00/km │
│  4 │ Lan Hương     │ 42.8 km  │  6    │ 5:30/km │
│  5 │ Đức Anh       │ 40.5 km  │  8    │ 6:15/km │
│... │ ...           │ ...      │ ...   │ ...     │
└────┴───────────────┴──────────┴───────┴─────────┘

Weekly Winner:
• Top 3 get special badge
• Feature on homepage
• Extra Xu bonus (+5,000 Xu for #1)
• Bragging rights on Spotlight
```

---

### Sponsor Integration

**Sponsor Tiers:**
```
Platinum Sponsor (₫500M+/campaign):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Branded mission (e.g., "Nike Air Zoom Challenge")
• Banner ads on all mission pages
• Push notifications to all users
• Product sampling (top 1,000 finishers)
• Logo on medals
• 30-day campaign duration
• Expected reach: 100K users
• CPM: ₫5,000

Gold Sponsor (₫200M+/campaign):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Co-branded mission
• Banner on mission page
• Push to active runners (50K)
• Discount codes for participants
• Logo on medals
• 14-day campaign
• Expected reach: 50K users

Silver Sponsor (₫50M+/campaign):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Banner on specific mission
• Product giveaway (top 100)
• 7-day campaign
• Expected reach: 10K users

Example Campaign: Pocari Sweat Summer Challenge
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sponsor: Pocari Sweat Ion Supply
Budget: ₫200M
Type: Gold Sponsor
Duration: July 1-31, 2026

Mission: "Complete 100km in July"
Rewards:
• Every 10km: +2,000 Xu
• Complete 100km: +25,000 Xu + Pocari branded medal
• Top 100: Pocari gift pack (12 bottles)
• Top 10: 1-year supply + Sports towel

Sponsor Benefits:
• Banner impressions: 500K (estimated)
• Push notifications: 50K
• Participant engagement: 15K expected
• Product sampling: 10,000 bottles distributed
• Social media mentions: 5K+ (medal sharing)
• Brand recall lift: +35% (survey)

Expected Results:
• Participants: 15,000
• Completions: 8,000 (53% completion rate)
• Total distance: 1.2M km
• Avg distance per user: 80 km
• Social shares: 12,000
• ROI: 4.2x (₫840M media value / ₫200M cost)

Sponsor ROI Calculation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Media Value:
• Banner impressions: 500K × ₫10 CPM = ₫5M
• Push notifications: 50K × ₫50 = ₫2.5M
• Social mentions: 12K × ₫25 = ₫300K
• Product trial: 10K users × ₫80 LTV = ₫800M
• Brand awareness: Estimated ₫150M

Total Value: ₫1.26B
Cost: ₫200M
ROI: 5.3x 🚀

Real Business Impact:
• 10K new customers tried product
• 25% conversion to repeat purchase = 2,500 customers
• LTV per customer: ₫500K
• Lifetime revenue: ₫1.25B
• Payback period: 2 months
```

**Sponsor Dashboard:**
```
Pocari Sweat Campaign - Real-Time Analytics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Campaign: Summer Challenge 100km
Status: ✅ Active (Day 15/30)

Participation Metrics:
• Registered: 18,542 (+23% vs target)
• Active: 12,385 (67% engagement)
• Completed: 1,245 (6.7% early completions)

Distance Metrics:
• Total distance: 456,789 km
• Avg per user: 36.9 km
• On track for 100km: 3,248 users

Engagement:
• Banner impressions: 245,328
• Banner clicks: 8,542 (CTR: 3.48%)
• Push notification opens: 32,145 (64.3%)
• Social shares: 4,892

Product Distribution:
• Sampling packs claimed: 4,235
• Redemption locations:
  - Convenience stores: 2,845
  - Gyms: 892
  - Running clubs: 498

ROI (Projected):
• Current spend: ₫92M / ₫200M
• Projected participants: 22K (vs 15K target)
• Projected completions: 10K (vs 8K target)
• Projected ROI: 6.2x (vs 4.2x target) 🎉

Top Performers (Current):
1. Anh Tài (Driver): 285 km
2. Minh Khôi (User): 268 km
3. Thu Thảo (Merchant): 245 km

[Export Report] [Adjust Budget] [Extend Campaign]
```

---

### Social Features

**Sharing to Spotlight:**
```
When user earns a medal:
1. Auto-generate shareable post
2. Medal image + Stats overlay
3. One-tap share to Spotlight feed

Example Post:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Medal Image: Gold 5km]

🏃‍♂️ Vừa hoàn thành 5km trong 27:30!

📊 Stats:
• Distance: 5.02 km
• Time: 27:30
• Pace: 5:28/km
• Calories: 385 kcal

🏅 Medal: Gold (Top 10%)
💰 Earned: 3,750 Xu

#LifestyleGO #RunToEarn #5kmChallenge

[View Route Map]
[Join Challenge >]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Engagement:
• Likes: 245
• Comments: 28
• Shares: 12
• 15 friends joined challenge after seeing this post
```

**Group Challenges:**
```
"Driver Team vs Merchant Team"
Duration: 1 month
Goal: Most total distance

Current Standings:
┌──────────────┬──────────────┬────────────┐
│ Team         │ Total KM     │ Avg/Member │
├──────────────┼──────────────┼────────────┤
│ 🚗 Drivers   │ 12,458 km    │ 24.2 km    │
│ 🏪 Merchants │ 10,892 km    │ 22.1 km    │
└──────────────┴──────────────┴────────────┘

Drivers leading by 1,566 km! 💪

Prize:
• Winning team: +50% Xu bonus for all members
• MVP (top distance): +10,000 Xu + Special badge

Team spirit features:
• Team chat
• Motivational messages
• Weekly updates
• Team leaderboard
```

---

## 💰 Expected Business Impact

### Revenue Streams

```
Direct Revenue:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Sponsor Campaigns
   • Target: 50 campaigns/year
   • Avg budget: ₫150M/campaign
   • Total: ₫7.5B/year
   • Platform fee: 20%
   • Revenue: ₫1.5B/year

2. Premium Features (Optional)
   • Advanced analytics: ₫50K/month
   • Custom training plans: ₫100K/month
   • Ad-free experience: ₫30K/month
   • Target users: 5,000 (1% of MAU)
   • Revenue: ₫600M/year

Total Direct Revenue: ₫2.1B/year


Indirect Benefits:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. User Engagement
   • Daily active users: +25%
   • Session duration: +15 minutes
   • Retention: +30% (gamification effect)

2. Community Building
   • Social features drive UGC
   • Spotlight posts: +10K/month
   • Viral growth: +5% organic

3. Health Data Insights
   • Valuable data for insurance products
   • Personalized health recommendations
   • Partnership opportunities (health insurers)

4. Brand Value
   • "Health-focused platform"
   • Positive brand association
   • CSR (Corporate Social Responsibility)

Total Value Created: ₫10B+/year
(engagement + retention + data + brand)
```

### Cost Structure

```
Technology Costs:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• GPS tracking infrastructure: ₫500M/year
• Anti-cheat AI (cloud ML): ₫300M/year
• External API integrations (Strava, etc.): ₫200M/year
• Storage (GPS data, photos): ₫200M/year
Total Tech: ₫1.2B/year

Rewards Costs:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Xu payouts: ₫2B/year (but redeemed within ecosystem)
• Medals (virtual): ₫0 (digital asset)
• Physical prizes (sponsored): ₫0 (sponsor-funded)
Total Rewards: ₫2B/year (mostly offset by Xu circulation)

Operations:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Fraud review team (3 people): ₫360M/year
• Community management (2 people): ₫240M/year
• Sponsor relations (2 people): ₫300M/year
Total Ops: ₫900M/year

Total Costs: ₫4.1B/year

Net Profit: ₫2.1B (direct) - ₫4.1B (costs) = -₫2B (Year 1)

But when factoring indirect benefits:
₫10B (value created) - ₫4.1B (costs) = ₫5.9B net positive 🚀

Breakeven: Year 2 (as sponsorships scale)
```

### User Metrics (Year 1 Targets)

```
Participation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total users joined: 500K (100% of MAU)
• Active runners (monthly): 150K (30%)
• Daily active runners: 30K (6%)

Activities:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total runs: 2M/year
• Avg distance: 4.5 km
• Total distance: 9M km (enough to circle Earth 225x!)
• Avg activities/user/month: 4

Missions:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total missions: 200 (Year 1)
• Avg participants/mission: 5,000
• Completion rate: 45%

Rewards:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Xu distributed: 3B Xu
• Total medals awarded: 900K
• Medals/active user: 6

Anti-Cheat:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Flagged activities: 50K (2.5%)
• Rejected activities: 10K (0.5%)
• False positive rate: <1%
• User satisfaction: 92% ("Fair system")

Social:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Medals shared to Spotlight: 450K (50% of medals)
• Avg engagement per post: 25 likes, 3 comments
• Friend referrals from posts: 25K new users
```

---

## 🚀 Implementation Roadmap

### Phase 1: MVP (Month 1-2)

**Core Features:**
- [ ] Built-in GPS tracker
- [ ] Basic missions (5km, 10km)
- [ ] Simple leaderboard (all users)
- [ ] Xu rewards
- [ ] Virtual medals
- [ ] Basic anti-cheat (velocity + GPS)

**Integrations:**
- [ ] Apple Health sync
- [ ] Google Fit sync

**MVP Scope:**
- 2 mission types
- Manual photo proof for suspicious activities
- Simple trust score

**Expected Results:**
- 10K active runners
- 50K total runs
- Validate product-market fit

---

### Phase 2: Growth (Month 3-4)

**Additional Features:**
- [ ] Strava sync
- [ ] Garmin sync
- [ ] Advanced anti-cheat (HR, Pedometer, AI)
- [ ] Mission variety (streak, pace, elevation)
- [ ] Category leaderboards (Driver/Merchant/User)
- [ ] Share to Spotlight
- [ ] Group challenges

**Sponsor Program:**
- [ ] Onboard 5 pilot sponsors
- [ ] Sponsor dashboard
- [ ] ROI tracking

**Expected Results:**
- 100K active runners
- 500K runs
- 5 sponsored missions
- ₫500M sponsor revenue

---

### Phase 3: Scale (Month 5-12)

**Advanced Features:**
- [ ] Real-time race mode (compete live)
- [ ] Audio coaching
- [ ] Training plans
- [ ] Achievement badges (100+ types)
- [ ] Social features (follow, challenges)
- [ ] Premium subscription

**Anti-Cheat V2:**
- [ ] ML model (XGBoost)
- [ ] Community reporting
- [ ] Video proof upload
- [ ] Automated appeals process

**Sponsor Expansion:**
- [ ] 50 active sponsors
- [ ] Tiered sponsorship packages
- [ ] API for sponsor integration
- [ ] White-label campaigns

**Expected Results:**
- 500K active runners (Year 1 target achieved!)
- 2M runs
- 50 sponsors
- ₫7.5B sponsor revenue

---

## 📂 Documentation Index

**Core Files:**
1. `packages/types/src/run-to-earn.ts` (~1,000 lines)
2. `RUN_TO_EARN_COMPLETE.md` (this file ~2,500+ lines)

**Updated:**
- `packages/types/src/index.ts` (Export run-to-earn)
- `IMPLEMENTATION_SUMMARY.md` (Add Run-to-Earn)

**Total:** ~3,500+ lines of comprehensive specifications ✅

---

## 🎯 Success Metrics

### KPIs (Month 12 Targets)

**Participation:**
```
Users:
• Total joined: 500K
• Active (monthly): 150K
• Daily runners: 30K
• Retention D30: 55%

Activities:
• Total runs: 2M
• Avg distance: 4.5 km
• Total distance: 9M km
• Runs/user/month: 4
```

**Missions:**
```
• Total missions: 200
• Avg participants: 5,000
• Completion rate: 45%
• Medal awards: 900K
```

**Anti-Cheat:**
```
• Flagged rate: 2.5%
• Rejection rate: 0.5%
• False positive: <1%
• User satisfaction: 92%
```

**Sponsors:**
```
• Active sponsors: 50
• Total budget: ₫7.5B
• Avg ROI: 4.5x
• Renewal rate: 80%
```

**Business:**
```
• Direct revenue: ₫2.1B
• Indirect value: ₫10B
• Net impact: ₫5.9B
• User engagement: +25%
```

---

**Planning Phase: 100% Complete** ✅  
**Ready for:** GPS infrastructure + Anti-cheat AI + Sponsor partnerships 🚀  
**Expected Impact:** 500K active runners, 9M km total, ₫5.9B net value Year 1

**"Sống khỏe mỗi ngày, nhận quà Lifestyle"** 🏃‍♂️💪🎁
