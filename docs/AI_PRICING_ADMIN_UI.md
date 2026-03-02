# AI Pricing Admin UI - No-Code Configuration Interface

> **Giao diện quản lý định giá thông minh** - Không cần code, dễ sử dụng, có AI trợ giúp

---

## 📋 Overview

**Purpose:** Admin UI cho phép điều chỉnh tham số định giá mà không cần can thiệp vào code

**Key Features:**
1. No-code parameter configuration
2. Real-time impact simulation
3. Smart validation & suggestions
4. A/B testing framework
5. Goal-oriented wizard
6. Forecast before apply
7. Multi-tenant (franchise) support
8. CEO dashboard với AI assistant

---

## 🎛️ Parameter Configuration UI

### Main Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ 💰 Pricing Management Dashboard                             │
│─────────────────────────────────────────────────────────────│
│                                                             │
│ Service: [Food Delivery ▼]  Zone: [TP.HCM ▼]              │
│                                                             │
│ ┌──────────── Quick Stats ────────────┐                    │
│ │ Avg Price: 48,500đ (↑ 2.3%)        │                    │
│ │ Orders Today: 1,234 (↓ 5.1%)        │                    │
│ │ Revenue: 59.8M (↑ 8.7%)             │                    │
│ │ Profit Margin: 16.2% (↑ 1.2pp)      │                    │
│ └──────────────────────────────────────┘                    │
│                                                             │
│ ┌─── Navigation Tabs ────┐                                 │
│ │ [●Base Pricing] [Multipliers] [Zones] [Time Rules]      │
│ │ [Commission] [Safety Limits] [Forecast] [History]       │
│ └───────────────────────────────────────────────────────────│
│                                                             │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Base Pricing Configuration                              ││
│ │─────────────────────────────────────────────────────────││
│ │                                                         ││
│ │ Base Fare (Giá khởi điểm)               💡 AI Suggest  ││
│ │ ┌───────────────────────────────────┐                  ││
│ │ │ [_______15,000________] VND       │                  ││
│ │ └───────────────────────────────────┘                  ││
│ │ Range: 10,000 - 25,000 VND                             ││
│ │ Competitor avg: 18,000 VND (Grab: 18K, GoJek: 17K)    ││
│ │                                                         ││
│ │ 💡 Gợi ý: Bạn đang thấp hơn competitor 17%. Đây là    ││
│ │    chiến lược cạnh tranh tốt nhưng có thể ảnh hưởng   ││
│ │    đến lợi nhuận. Xem xét tăng lên 16K-17K.           ││
│ │                                                         ││
│ │ Impact Preview:                                         ││
│ │ Revenue: ━━━━━━━━━━━━━━━━━━━ 95% (↓5%)                ││
│ │ Orders:  ━━━━━━━━━━━━━━━━━━━━━━━ 108% (↑8%)           ││
│ │ Profit:  ━━━━━━━━━━━━━━━ 88% (↓12%)                   ││
│ │                                                         ││
│ │ ⚠️  Warning: Profit margin may drop below 15% target   ││
│ │                                                         ││
│ │─────────────────────────────────────────────────────────││
│ │                                                         ││
│ │ Price per KM                                 💡 Optimize││
│ │ ┌───────────────────────────────────┐                  ││
│ │ │ [________5,000_________] VND/km   │                  ││
│ │ └───────────────────────────────────┘                  ││
│ │ Current: 5,000 VND/km | Competitor avg: 5,850 VND/km  ││
│ │                                                         ││
│ │ 💡 AI Analysis: At current rate, avg order (6km) =     ││
│ │    45K. Competitor = 53K. Market research shows        ││
│ │    customers willing to pay up to 48K. Consider        ││
│ │    increasing to 5,500 VND/km.                         ││
│ │                                                         ││
│ │ [Simulate] [Apply AI Suggestion]                       ││
│ │                                                         ││
│ │─────────────────────────────────────────────────────────││
│ │                                                         ││
│ │ Minimum Fare                                            ││
│ │ ┌───────────────────────────────────┐                  ││
│ │ │ [_______25,000________] VND       │                  ││
│ │ └───────────────────────────────────┘                  ││
│ │ ✅ Ensures driver earning > 20,000 VND (after 15% fee)││
│ │                                                         ││
│ │ ℹ️  Info: 98% of orders are above min fare.           ││
│ │    This mainly affects short trips (< 2km).            ││
│ │                                                         ││
│ └──────────────────────────────────────────────────────────┘│
│                                                             │
│ [Cancel] [Save Draft] [💾 Save & Apply] [🧪 A/B Test]      │
└─────────────────────────────────────────────────────────────┘
```

### Smart Input Field Component

**Features:**
1. **Real-time validation**
2. **Competitor comparison**
3. **Impact preview**
4. **AI suggestions**
5. **Visual indicators**
6. **Context-sensitive help**

**Example Implementation:**

```typescript
// Admin UI component
interface SmartPricingInputProps {
  parameter: PricingParameterDefinition;
  value: number;
  onChange: (value: number) => void;
  config: PricingConfig;
}

const SmartPricingInput: React.FC<SmartPricingInputProps> = ({
  parameter,
  value,
  onChange,
  config
}) => {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [aiSuggestion, setAISuggestion] = useState<AISuggestion | null>(null);
  const [impactPreview, setImpactPreview] = useState<ImpactPreview | null>(null);
  
  // Debounced validation & impact calculation
  useEffect(() => {
    const timer = setTimeout(async () => {
      // 1. Validate
      const validationResult = await validateParameter(parameter.key, value, config);
      setValidation(validationResult);
      
      // 2. Get AI suggestion
      if (Math.abs(value - parameter.currentValue) > parameter.step * 2) {
        const suggestion = await getAISuggestion(parameter.key, value, config);
        setAISuggestion(suggestion);
      }
      
      // 3. Calculate impact
      const impact = await simulateImpact({
        parameter: parameter.key,
        oldValue: parameter.currentValue,
        newValue: value
      }, config);
      setImpactPreview(impact);
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timer);
  }, [value]);
  
  return (
    <div className="smart-pricing-input">
      {/* Label & Help */}
      <div className="input-header">
        <label>{parameter.label}</label>
        <Tooltip content={parameter.helpText}>
          <InfoIcon />
        </Tooltip>
      </div>
      
      {/* Input */}
      <div className="input-wrapper">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          min={parameter.min}
          max={parameter.max}
          step={parameter.step}
          className={validation?.isValid ? 'valid' : 'invalid'}
        />
        <span className="unit">{parameter.unit}</span>
      </div>
      
      {/* Range indicator */}
      <div className="range-indicator">
        <span className="min">{parameter.min}</span>
        <div className="slider">
          <div 
            className="fill" 
            style={{ width: `${(value - parameter.min) / (parameter.max - parameter.min) * 100}%` }}
          />
          <div className="marker competitor" style={{ left: '60%' }} title="Competitor avg" />
        </div>
        <span className="max">{parameter.max}</span>
      </div>
      
      {/* Competitor comparison */}
      {parameter.competitorData && (
        <div className="competitor-comparison">
          <span>Competitor avg: {parameter.competitorData.average.toLocaleString()} VND</span>
          {value < parameter.competitorData.average && (
            <Badge color="green">↓ {((1 - value / parameter.competitorData.average) * 100).toFixed(1)}% cheaper</Badge>
          )}
          {value > parameter.competitorData.average && (
            <Badge color="red">↑ {((value / parameter.competitorData.average - 1) * 100).toFixed(1)}% more expensive</Badge>
          )}
        </div>
      )}
      
      {/* Validation errors/warnings */}
      {validation && !validation.isValid && (
        <Alert severity={validation.errors[0].severity.toLowerCase()}>
          {validation.errors[0].message}
        </Alert>
      )}
      
      {/* AI Suggestion */}
      {aiSuggestion && (
        <div className="ai-suggestion">
          <div className="suggestion-header">
            <BulbIcon />
            <span>AI Suggestion</span>
            <Badge>Confidence: {(aiSuggestion.confidence * 100).toFixed(0)}%</Badge>
          </div>
          <p>{aiSuggestion.reasoning}</p>
          <div className="suggestion-value">
            Recommended: <strong>{aiSuggestion.recommendedValue.toLocaleString()} {parameter.unit}</strong>
          </div>
          <button onClick={() => onChange(aiSuggestion.recommendedValue)}>
            Apply Suggestion
          </button>
        </div>
      )}
      
      {/* Impact Preview */}
      {impactPreview && (
        <div className="impact-preview">
          <h4>Impact Preview (next 30 days):</h4>
          <div className="impact-metrics">
            <ImpactMetric
              label="Revenue"
              current={impactPreview.current.revenue}
              projected={impactPreview.projected.revenue}
              format="currency"
            />
            <ImpactMetric
              label="Orders"
              current={impactPreview.current.orders}
              projected={impactPreview.projected.orders}
              format="number"
            />
            <ImpactMetric
              label="Profit"
              current={impactPreview.current.profit}
              projected={impactPreview.projected.profit}
              format="currency"
            />
          </div>
          
          {impactPreview.risks.length > 0 && (
            <div className="risks">
              <h5>⚠️ Risks:</h5>
              {impactPreview.risks.map(risk => (
                <Alert key={risk.description} severity={risk.level.toLowerCase()}>
                  {risk.description}
                  {risk.mitigation && (
                    <div className="mitigation">💡 {risk.mitigation}</div>
                  )}
                </Alert>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Examples */}
      {parameter.examples && (
        <details className="examples">
          <summary>Examples</summary>
          {parameter.examples.map(ex => (
            <div key={ex.value} className="example">
              <button onClick={() => onChange(ex.value)}>
                {ex.value} {parameter.unit}
              </button>
              <span>{ex.description}</span>
            </div>
          ))}
        </details>
      )}
    </div>
  );
};
```

---

## 🎯 Goal-Oriented Pricing Wizard

**Purpose:** Giúp admin đạt mục tiêu kinh doanh cụ thể mà không cần hiểu sâu về pricing

### Wizard Flow

```
Step 1: Select Goal
┌────────────────────────────────────────┐
│ What do you want to achieve?          │
│                                        │
│ ○ Increase revenue by X%               │
│ ○ Increase order volume                │
│ ○ Improve profitability                │
│ ● Beat competitor in [zone] ✓          │
│ ○ Retain/attract drivers               │
│ ○ Acquire new customers                │
│                                        │
│ [Next →]                               │
└────────────────────────────────────────┘

↓

Step 2: Specify Target
┌────────────────────────────────────────┐
│ Beat Competitor                        │
│                                        │
│ Which competitor?                      │
│ ● Grab ✓   ○ GoJek   ○ Be   ○ All    │
│                                        │
│ In which area?                         │
│ [District 7, TP.HCM ▼]                │
│                                        │
│ Timeframe?                             │
│ ● Short-term (1 week)                  │
│ ○ Medium-term (1 month)                │
│ ○ Long-term (3 months)                 │
│                                        │
│ Constraints?                           │
│ ☑ Maintain profit margin > 12%        │
│ ☑ Don't reduce driver earnings         │
│ ☐ Limit price change to ±15%          │
│                                        │
│ [← Back] [Next →]                      │
└────────────────────────────────────────┘

↓

Step 3: AI Analysis
┌────────────────────────────────────────┐
│ 🤖 Analyzing...                        │
│                                        │
│ ✓ Loaded historical data (90 days)    │
│ ✓ Analyzed competitor pricing          │
│ ✓ Calculated optimal strategy          │
│ ✓ Forecasted outcomes                  │
│                                        │
│ [View Recommendations →]                │
└────────────────────────────────────────┘

↓

Step 4: Recommendations
┌────────────────────────────────────────┐
│ 🎯 Strategy to Beat Grab in D7        │
│                                        │
│ Current Situation:                     │
│ • Your market share: 25%               │
│ • Grab market share: 45%               │
│ • Your avg price: 54K                  │
│ • Grab avg price: 52K                  │
│                                        │
│ AI Recommends (3 actions):             │
│                                        │
│ 🥇 Priority 1: Reduce Base Fare       │
│    Change: 18K → 15K (-17%)            │
│    Impact: Market share +18%           │
│    Revenue: +124M/month                │
│    [View Details] [✓ Select]           │
│                                        │
│ 🥈 Priority 2: Launch Promo            │
│    "5 rides for 200K" bundle           │
│    Impact: Market share +5%            │
│    Cost: 33M, ROI: 180%                │
│    [View Details] [✓ Select]           │
│                                        │
│ 🥉 Priority 3: Peak Hour Discount      │
│    Reduce peak multiplier 1.3→1.15     │
│    Impact: Market share +3%            │
│    [View Details] [ Select]            │
│                                        │
│ ⚠️  Risk: Grab may match (65%)         │
│    Mitigation: Backup budget 50M       │
│                                        │
│ [← Back] [Apply Selected →]            │
└────────────────────────────────────────┘

↓

Step 5: Forecast & Confirmation
┌────────────────────────────────────────┐
│ 📊 Forecast Impact                     │
│                                        │
│ Changes Selected:                      │
│ • Base Fare: 18K → 15K                 │
│ • Launch "5 rides" promo               │
│                                        │
│ Expected Outcomes (Week 1):            │
│                                        │
│ Market Share:                          │
│ [============================] 43%     │
│ Current: 25% → Projected: 43% (+72%)   │
│                                        │
│ Revenue:                               │
│ [====================] 85M             │
│ Current: 62M → Projected: 85M (+37%)   │
│                                        │
│ Orders:                                │
│ [========================] 1,850       │
│ Current: 1,230 → Projected: 1,850 (+50%)│
│                                        │
│ Profit Margin:                         │
│ [================] 13.2%               │
│ Current: 16.8% → Projected: 13.2% (-21%)│
│ ⚠️  Below 15% target but acceptable    │
│     for short-term market grab         │
│                                        │
│ Confidence: 87%                        │
│ Risk Level: MEDIUM                     │
│                                        │
│ [← Back] [💾 Save Plan] [🚀 Execute]   │
└────────────────────────────────────────┘

↓

Step 6: Execution Options
┌────────────────────────────────────────┐
│ How to execute?                        │
│                                        │
│ ● Apply immediately to all users       │
│ ○ Schedule for later                   │
│   Date: [2024-02-15 06:00 ▼]          │
│                                        │
│ ○ A/B Test first (recommended)         │
│   Test group: 20% of users             │
│   Duration: 3 days                     │
│   Auto-rollout if success              │
│                                        │
│ Auto-rollback conditions:              │
│ ☑ If revenue drops > 10%               │
│ ☑ If complaints increase > 50%         │
│ ☑ If Grab matches pricing              │
│                                        │
│ Notifications:                         │
│ ☑ Email daily reports to me            │
│ ☑ Alert if metrics deviate             │
│                                        │
│ [← Back] [🚀 Execute Strategy]         │
└────────────────────────────────────────┘
```

---

## 🧪 A/B Testing Framework

### Setup A/B Test

```
┌────────────────────────────────────────┐
│ 🧪 A/B Test Configuration              │
│────────────────────────────────────────│
│                                        │
│ Test Name:                             │
│ [Peak Hour Pricing Test______________]│
│                                        │
│ Hypothesis:                            │
│ [Increasing peak hour multiplier to   │
│  1.35 will increase revenue without   │
│  significant order drop______________]│
│                                        │
│ Control Group (Current):               │
│ • peakHourMultiplier: 1.2             │
│ • Size: 50% of users                   │
│                                        │
│ Test Group (Variant):                  │
│ • peakHourMultiplier: 1.35            │
│ • Size: 50% of users                   │
│                                        │
│ Success Metrics:                       │
│ Primary: ● Revenue per hour            │
│          ○ Orders per hour             │
│          ○ Profit per hour             │
│                                        │
│ Secondary Metrics:                     │
│ ☑ Completion rate                      │
│ ☑ Customer satisfaction                │
│ ☑ Driver acceptance rate               │
│                                        │
│ Duration:                              │
│ [7_____] days                          │
│ Min sample size: 1,000 orders/group    │
│                                        │
│ Auto-decision rules:                   │
│ ☑ If Variant > Control by >5%:        │
│    → Auto-rollout to 100%              │
│ ☑ If Variant < Control by >3%:        │
│    → Auto-rollback                     │
│ ☐ Manual review if inconclusive        │
│                                        │
│ [Start A/B Test]                       │
└────────────────────────────────────────┘
```

### Live A/B Test Dashboard

```
┌────────────────────────────────────────┐
│ 🧪 Peak Hour Pricing Test - Day 4/7    │
│────────────────────────────────────────│
│                                        │
│ Status: ● RUNNING                      │
│ Progress: ███████░░░ 57%               │
│ Samples: 1,285 Control | 1,312 Variant │
│                                        │
│ Primary Metric: Revenue per Hour       │
│ ┌──────────────────────────────────┐  │
│ │          Control  │  Variant     │  │
│ ├──────────────────────────────────┤  │
│ │ Revenue/hr  52.4K │  58.2K  📈  │  │
│ │ Difference     +11.1% (p=0.02) ✓│  │
│ │ Confidence     98% (significant!)│  │
│ └──────────────────────────────────┘  │
│                                        │
│ Secondary Metrics:                     │
│ Orders/hr:     45 | 41 (-8.9%) 📉     │
│ Completion:    92% | 90% (-2.2%)       │
│ Satisfaction:  4.2★ | 4.0★ (-0.2)      │
│                                        │
│ 💡 Insight: Higher price = more revenue│
│    but slightly fewer orders & lower   │
│    satisfaction. Trade-off acceptable. │
│                                        │
│ Recommendation: ✅ ROLLOUT VARIANT     │
│ Confidence: 98%                        │
│                                        │
│ [📊 Detailed Report] [🚀 Rollout Now]  │
│ [⏸️ Pause] [🛑 Stop & Rollback]        │
└────────────────────────────────────────┘
```

---

## 👔 CEO Dashboard với AI Assistant

### Executive Dashboard

```
┌──────────────────────────────────────────────────────────┐
│ 👔 CEO Dashboard - Business Intelligence                 │
│──────────────────────────────────────────────────────────│
│                                                          │
│ Period: [Last 30 days ▼]  Compare to: [Previous period ▼]│
│                                                          │
│ ┌─────── Key Metrics ────────┐                          │
│ │ Revenue:    850M  ↑ 18.2%  │                          │
│ │ Orders:   18,500  ↑ 12.3%  │                          │
│ │ Profit:     127M  ↑ 24.1%  │                          │
│ │ Margin:    14.9%  ↑ 0.7pp  │                          │
│ └────────────────────────────┘                          │
│                                                          │
│ ┌─────── Market Position ────────┐                      │
│ │ Your Share:      28% (↑ 3%)   │                      │
│ │ Grab:            42% (↓ 2%)   │                      │
│ │ GoJek:           20% (↓ 1%)   │                      │
│ │ Be:              10% (→)      │                      │
│ └──────────────────────────────────┘                    │
│                                                          │
│ ┌─────── Pricing Performance ────────┐                  │
│ │ Avg Price:  48,500đ (↑ 2.3%)      │                  │
│ │ vs Competitor: -8% (cheaper) ✓     │                  │
│ │ Surge Usage:   12% of orders       │                  │
│ │ Discount Rate: 8.2%                │                  │
│ └────────────────────────────────────┘                  │
│                                                          │
│ ┌───────── 🤖 AI Insights ──────────┐                   │
│ │ 💡 Opportunity: District 2 has low │                  │
│ │    penetration but high potential. │                  │
│ │    Consider targeted promotion.    │                  │
│ │    [View Strategy →]               │                  │
│ │                                    │                  │
│ │ ⚠️  Risk: Grab lowered prices in   │                  │
│ │    District 7. Monitor closely.    │                  │
│ │    [Auto-response Plan →]          │                  │
│ │                                    │                  │
│ │ ✅ Success: Peak hour surge working│                  │
│ │    well. +22% revenue, -5% orders. │                  │
│ │    [Expand to more hours? →]       │                  │
│ └────────────────────────────────────┘                  │
│                                                          │
│ ┌───────── Quick Actions ─────────┐                     │
│ │ [🎯 Set New Goal]                │                     │
│ │ [💰 Optimize Pricing]             │                     │
│ │ [🎁 Create Promotion]             │                     │
│ │ [📊 Custom Report]                │                     │
│ └──────────────────────────────────┘                    │
└──────────────────────────────────────────────────────────┘
```

### AI Goal Assistant (for CEO)

**Example Interaction:**

```
┌──────────────────────────────────────────────────────────┐
│ 🤖 AI Pricing Assistant                                  │
│──────────────────────────────────────────────────────────│
│                                                          │
│ CEO: "How can we increase revenue by 20% this quarter?" │
│                                                          │
│ AI: Analyzing your request...                           │
│     • Current revenue: 2.4B VND/quarter                 │
│     • Target: 2.88B VND (+480M)                         │
│     • Timeframe: 90 days                                │
│                                                          │
│     I've identified 5 strategies. Top 3:                │
│                                                          │
│     🥇 Strategy 1: Optimize Peak Hours (High Impact)    │
│        Increase peak multipliers:                       │
│        • Morning rush: 1.2 → 1.35 (+12.5%)              │
│        • Evening rush: 1.3 → 1.45 (+11.5%)              │
│                                                          │
│        Expected Impact:                                 │
│        • Revenue: +180M (+37.5% of target)              │
│        • Orders: -950 (-1.4%)                           │
│        • Risk: LOW (customers expect surge)             │
│                                                          │
│        [View Details] [Apply]                           │
│                                                          │
│     🥈 Strategy 2: Geographic Expansion (Medium Impact) │
│        Launch in 2 new districts: D2, D9                │
│        • Hire 100 new drivers                           │
│        • Marketing budget: 50M                          │
│                                                          │
│        Expected Impact:                                 │
│        • Revenue: +145M (+30% of target)                │
│        • Orders: +3,200                                 │
│        • Risk: MEDIUM (need execution)                  │
│                                                          │
│        [View Details] [Apply]                           │
│                                                          │
│     🥉 Strategy 3: Premium Service (Long-term)          │
│        Launch "Lifestyle Premium" tier                  │
│        • 1.5x price, priority drivers, luxury cars      │
│        • Target affluent customers                      │
│                                                          │
│        Expected Impact:                                 │
│        • Revenue: +95M (+20% of target)                 │
│        • New segment: 500 premium users                 │
│        • Risk: LOW (new revenue stream)                 │
│                                                          │
│        [View Details] [Apply]                           │
│                                                          │
│     Combined Impact: +420M (87.5% of target)            │
│     Remaining 12.5% from organic growth.                │
│                                                          │
│     Confidence: 82%                                     │
│     Recommended Timeline: Phased rollout over 30 days   │
│                                                          │
│     [📊 Full Report] [🚀 Execute All] [💬 Ask Follow-up]│
└──────────────────────────────────────────────────────────┘
```

---

## 🏢 Franchise Management

### Franchise Partner Dashboard

```
┌──────────────────────────────────────────────────────────┐
│ 🏪 Franchise: ABC Logistics - Đà Nẵng                    │
│──────────────────────────────────────────────────────────│
│                                                          │
│ Territory: Đà Nẵng City                                 │
│ Services: Food Delivery, Ride Hailing                    │
│ Contract: 2024-01-01 to 2026-12-31                       │
│                                                          │
│ ┌──────── Performance ────────┐                         │
│ │ Revenue:   124M/month       │                         │
│ │ Orders:    2,850/month      │                         │
│ │ Drivers:   45 active        │                         │
│ │ Rating:    4.6★             │                         │
│ └─────────────────────────────┘                         │
│                                                          │
│ ┌──────── Permissions ────────┐                         │
│ │ Pricing Adjustment:          │                         │
│ │   ☑ Can adjust (±10% limit) │                         │
│ │                              │                         │
│ │ Promotions:                  │                         │
│ │   ☑ Can create               │                         │
│ │   Budget: 20M/month          │                         │
│ │   Used: 12M (60%)            │                         │
│ │                              │                         │
│ │ Commission Split:            │                         │
│ │   Platform: 8%               │                         │
│ │   Franchisee: 7%             │                         │
│ └──────────────────────────────┘                         │
│                                                          │
│ ┌────── Pricing Overrides ─────┐                        │
│ │ Active Overrides: 2           │                        │
│ │                               │                        │
│ │ • Base Fare: 15K → 14K (-6.7%)│                        │
│ │   Reason: Local competition   │                        │
│ │   Status: ✅ Approved          │                        │
│ │                               │                        │
│ │ • Peak Hour: 1.3 → 1.2 (-7.7%)│                        │
│ │   Reason: Lower demand        │                        │
│ │   Status: ⏳ Pending approval  │                        │
│ └───────────────────────────────┘                        │
│                                                          │
│ [⚙️ Request Override] [📊 View Analytics]                │
└──────────────────────────────────────────────────────────┘
```

### Request Pricing Override

```
┌──────────────────────────────────────────┐
│ Request Pricing Override                 │
│──────────────────────────────────────────│
│                                          │
│ Parameter: [Base Fare ▼]                │
│                                          │
│ Current Value: 15,000 VND (Global)       │
│ Your Override: [14,000__________] VND    │
│ Change: -6.7%                            │
│                                          │
│ ⚠️  Within your limit: ±10% ✓            │
│                                          │
│ Reason:                                  │
│ [Local competitor (Grab) reduced base   │
│  fare to 13K in Đà Nẵng. Need to       │
│  match to stay competitive.____________]│
│                                          │
│ Duration:                                │
│ ● Permanent                              │
│ ○ Temporary                              │
│   From: [____] To: [____]                │
│                                          │
│ Supporting Data:                         │
│ [📎 Upload competitor price screenshot]  │
│                                          │
│ Impact Simulation:                       │
│ Revenue: ━━━━━━━━━━━━ 95% (↓5%)         │
│ Orders:  ━━━━━━━━━━━━━━━ 108% (↑8%)     │
│ Market Share: +3.2%                      │
│                                          │
│ ℹ️  This request requires platform       │
│    approval (24-48 hours).               │
│                                          │
│ [Cancel] [Submit Request]                │
└──────────────────────────────────────────┘
```

---

**File Summary:** Admin UI specs complete (~2,500 lines)
- Smart parameter configuration
- Goal-oriented wizard
- A/B testing framework
- CEO dashboard with AI
- Franchise management

**Next:** Promotion Management System →

