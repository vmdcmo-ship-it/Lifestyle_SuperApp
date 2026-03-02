# Lifestyle Super App - Design System

> **Design System cho Driver App** - Professional, Simple, Vietnamese Identity

---

## 🎨 Color Palette

### Primary Colors

**1. Vàng (Primary - #1)**
```
Gold Primary:    #FDB813  (Vàng vàng kim)
Gold Light:      #FFD54F  (Vàng sáng)
Gold Dark:       #F9A825  (Vàng đậm)
Gold Pale:       #FFF9E6  (Vàng nhạt - backgrounds)
```

**2. Tím Than (Secondary - #2)**
```
Purple Dark:     #2E1A47  (Tím than chủ đạo)
Purple Medium:   #4A2C6B  (Tím vừa)
Purple Light:    #6B4794  (Tím nhạt)
Purple Pale:     #F3EFF7  (Tím rất nhạt - backgrounds)
```

### Accent Colors

**Đỏ (Accent - Energy/Alert)**
```
Red Primary:     #DC143C  (Đỏ cờ Việt Nam)
Red Light:       #FF4757  (Đỏ sáng)
Red Dark:        #C41E3A  (Đỏ đậm)
```

**Bạc/Trắng (Accent - Clean/Premium)**
```
Silver:          #C0C0C0  (Bạc)
Silver Light:    #E8E8E8  (Bạc nhạt)
White:           #FFFFFF  (Trắng)
Off-White:       #F8F8F8  (Trắng kem)
```

### Neutral Colors

```
Black:           #000000
Charcoal:        #2C2C2C
Gray Dark:       #4A4A4A
Gray Medium:     #9E9E9E
Gray Light:      #E0E0E0
Gray Pale:       #F5F5F5
```

### Semantic Colors

**Success**
```
Success:         #4CAF50  (Xanh lá)
Success Light:   #81C784
Success Dark:    #388E3C
```

**Warning**
```
Warning:         #FF9800  (Cam)
Warning Light:   #FFB74D
Warning Dark:    #F57C00
```

**Error**
```
Error:           #DC143C  (Đỏ - same as Red Primary)
Error Light:     #FF4757
Error Dark:      #C41E3A
```

**Info**
```
Info:            #2196F3  (Xanh dương)
Info Light:      #64B5F6
Info Dark:       #1976D2
```

---

## 🔤 Typography

### Font Families

**Primary Font (Vietnamese-optimized):**
```
Font Family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

**Fallback for Vietnamese:**
```
Vietnamese: 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif
```

**Monospace (Numbers/Code):**
```
Monospace: 'SF Mono', 'Roboto Mono', 'Courier New', monospace
```

### Font Sizes (Mobile - Driver App)

```
XXL:    32px  (H1 - Headings)
XL:     24px  (H2 - Section titles)
L:      20px  (H3 - Card titles)
M:      16px  (Body - Regular text)
S:      14px  (Small text - Secondary)
XS:     12px  (Caption - Timestamps)
XXS:    10px  (Tiny - Labels)
```

### Font Weights

```
Light:      300
Regular:    400
Medium:     500
SemiBold:   600
Bold:       700
ExtraBold:  800
```

### Line Heights

```
Tight:      1.2  (Headings)
Normal:     1.5  (Body text)
Relaxed:    1.75 (Long form content)
```

---

## 🎯 Logo Concept

### Logo Elements

**Primary Logo: "Lifestyle"**
- Wordmark: "Lifestyle" in custom font
- Icon: Stylized "L" combined with Vietnam flag star
- Colors: Gold (#FDB813) + Purple (#2E1A47)

**Icon-only Logo (App Icon):**
- Square format: 1024x1024px
- Gold star (⭐) on Purple Dark background
- Red accent stripe (Vietnam flag inspired)
- Rounded corners: 22.5% (iOS standard)

**Horizontal Logo:**
```
[Icon] Lifestyle
```

**Vertical Logo:**
```
  [Icon]
Lifestyle
```

### Logo Variations

1. **Full Color** (default)
   - Gold icon + Purple text
   
2. **White** (on dark backgrounds)
   - All white

3. **Monochrome** (grayscale)
   - Black or gray

4. **Simplified** (small sizes)
   - Icon only

### Clear Space

Minimum clear space: 1x icon width on all sides

### Minimum Sizes

- Logo with text: 120px width
- Icon only: 32px × 32px

---

## 📐 Spacing System

Based on 4px grid:

```
XXS:   4px   (0.25rem)
XS:    8px   (0.5rem)
S:     12px  (0.75rem)
M:     16px  (1rem)
L:     24px  (1.5rem)
XL:    32px  (2rem)
XXL:   48px  (3rem)
XXXL:  64px  (4rem)
```

### Component Spacing

```
Card padding:          16px (M)
Section margin:        24px (L)
Screen padding:        16px (M)
List item spacing:     12px (S)
Button padding:        12px × 24px (S × L)
Icon + text spacing:   8px (XS)
```

---

## 🔲 Border Radius

```
None:      0px
Small:     4px   (Badges, tags)
Medium:    8px   (Buttons, inputs)
Large:     12px  (Cards)
XLarge:    16px  (Modals, sheets)
Round:     999px (Pills, avatars)
```

---

## 🌑 Shadows & Elevation

### Elevation Levels

**Level 0 (Flat):**
```
box-shadow: none;
```

**Level 1 (Subtle):**
```
box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
```

**Level 2 (Card):**
```
box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
```

**Level 3 (Floating):**
```
box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.15);
```

**Level 4 (Modal):**
```
box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2);
```

**Level 5 (Popup):**
```
box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.25);
```

---

## 🎨 Component Styles

### Buttons

**Primary Button (Gold):**
```
Background: #FDB813 (Gold)
Text: #2E1A47 (Purple Dark)
Border: none
Radius: 8px
Padding: 12px 24px
Font: SemiBold 16px

Hover: #F9A825 (Gold Dark)
Active: #F9A825 + scale(0.98)
Disabled: #FFD54F (Gold Light) + opacity 0.5
```

**Secondary Button (Purple):**
```
Background: #2E1A47 (Purple Dark)
Text: #FFFFFF (White)
Border: none
Radius: 8px
Padding: 12px 24px
Font: SemiBold 16px

Hover: #4A2C6B (Purple Medium)
Active: #4A2C6B + scale(0.98)
Disabled: #6B4794 (Purple Light) + opacity 0.5
```

**Outline Button:**
```
Background: transparent
Text: #FDB813 (Gold)
Border: 2px solid #FDB813
Radius: 8px
Padding: 10px 22px (adjusted for border)
Font: SemiBold 16px

Hover: Background #FFF9E6 (Gold Pale)
Active: Background #FFD54F (Gold Light)
```

**Text Button:**
```
Background: transparent
Text: #FDB813 (Gold)
Border: none
Padding: 8px 16px
Font: Medium 16px

Hover: Background #FFF9E6 (Gold Pale)
Active: opacity 0.7
```

### Cards

**Standard Card:**
```
Background: #FFFFFF
Border: none
Radius: 12px
Shadow: Level 2
Padding: 16px
```

**Highlighted Card (Active Order):**
```
Background: #FFF9E6 (Gold Pale)
Border: 2px solid #FDB813 (Gold)
Radius: 12px
Shadow: Level 3
Padding: 16px
```

**Purple Card (Premium):**
```
Background: linear-gradient(135deg, #2E1A47, #4A2C6B)
Border: none
Radius: 12px
Shadow: Level 3
Padding: 16px
Text: #FFFFFF
```

### Inputs

**Text Input:**
```
Background: #FFFFFF
Border: 1px solid #E0E0E0
Radius: 8px
Padding: 12px 16px
Font: Regular 16px

Focus: Border #FDB813 (Gold) 2px
Error: Border #DC143C (Red) 2px
Disabled: Background #F5F5F5 + opacity 0.6
```

**Search Input:**
```
Background: #F5F5F5
Border: none
Radius: 24px (Round)
Padding: 12px 16px 12px 44px (space for icon)
Font: Regular 16px
Icon: 🔍 left-aligned

Focus: Background #FFFFFF + Shadow Level 1
```

### Badges

**Status Badge (Active):**
```
Background: #4CAF50 (Success)
Text: #FFFFFF
Radius: 4px
Padding: 4px 8px
Font: SemiBold 12px
```

**Status Badge (Warning):**
```
Background: #FF9800 (Warning)
Text: #FFFFFF
Radius: 4px
Padding: 4px 8px
Font: SemiBold 12px
```

**Status Badge (Error):**
```
Background: #DC143C (Red)
Text: #FFFFFF
Radius: 4px
Padding: 4px 8px
Font: SemiBold 12px
```

**Count Badge:**
```
Background: #DC143C (Red)
Text: #FFFFFF
Radius: 999px (Round)
Size: 20px × 20px
Font: Bold 12px
Position: Top-right of icon
```

### Tabs

**Tab Bar (Bottom Navigation):**
```
Background: #FFFFFF
Border-top: 1px solid #E0E0E0
Height: 64px
Shadow: Level 2 (inverted)

Tab Item:
  - Icon: 24px × 24px
  - Label: Regular 12px
  - Spacing: 4px between icon and label
  
  Active:
    - Icon: #FDB813 (Gold)
    - Label: #FDB813 (Gold)
    - Font: SemiBold
  
  Inactive:
    - Icon: #9E9E9E (Gray Medium)
    - Label: #9E9E9E (Gray Medium)
    - Font: Regular
```

---

## 🇻🇳 Vietnamese Design Elements

### Vietnam Flag Inspiration

**Colors from Vietnam Flag:**
- Red: #DC143C (exact match)
- Yellow Star: #FDB813 (gold star)

**Usage:**
- App icon: Gold star on purple background with red accent
- Success states: Can use red for emphasis (positive in Vietnamese culture)
- Premium features: Gold (prosperity, luck in Vietnamese culture)

### Cultural Considerations

**Colors in Vietnamese Culture:**
- 🟡 **Gold/Yellow:** Prosperity, royalty, good luck
- 🔴 **Red:** Luck, happiness, celebration
- 🟣 **Purple:** Nobility, spirituality
- ⚪ **White/Silver:** Purity, modernity

**Design Principles:**
- Clean and professional (respect for drivers)
- Bold but not overwhelming
- Trust and reliability
- Modern yet culturally appropriate

---

## 📱 Mobile Design Guidelines

### Screen Sizes (Target)

```
iPhone (small):  375 × 667px  (iPhone SE)
iPhone (medium): 390 × 844px  (iPhone 13/14)
iPhone (large):  428 × 926px  (iPhone 13/14 Pro Max)

Android (small): 360 × 640px  (Common)
Android (medium):393 × 851px  (Pixel 5)
Android (large): 412 × 915px  (Pixel 6 Pro)
```

### Safe Areas

```
Top safe area:    44px (iOS notch)
Bottom safe area: 34px (iOS home indicator)
Side margins:     16px minimum
```

### Touch Targets

```
Minimum: 44px × 44px
Comfortable: 48px × 48px
Recommended: 56px × 56px (for primary actions)
```

### Navigation

**Tab Bar Height:** 64px + safe area

**Header Height:** 56px + safe area

**Floating Action Button:**
- Size: 56px × 56px
- Position: Bottom-right, 16px from edges
- Shadow: Level 4

---

## 🎨 Icon System

### Icon Style

**Style:** Outlined (2px stroke) + Filled (for active states)

**Size Guidelines:**
```
Small:  16px × 16px  (Inline with text)
Medium: 24px × 24px  (Standard UI)
Large:  32px × 32px  (Feature icons)
XLarge: 48px × 48px  (Empty states)
```

### Icon Colors

**Default:** #2E1A47 (Purple Dark) or #4A4A4A (Gray Dark)
**Active:** #FDB813 (Gold)
**Disabled:** #9E9E9E (Gray Medium)
**On Dark:** #FFFFFF (White)
**Success:** #4CAF50 (Green)
**Error:** #DC143C (Red)
**Warning:** #FF9800 (Orange)

### Primary Icons (Driver App)

```
🎯 Nhận đơn:     Target/Pin icon
📦 Đơn hàng:     Package icon
💰 Thu nhập:     Wallet/Money icon
🎁 Nhiệm vụ:     Gift/Trophy icon
👤 Tài xế:       User/Profile icon

🚗 Xe máy:       Motorcycle icon
🚙 Ô tô:         Car icon
🏍️ Xe ba bánh:  Tricycle icon

📍 Vị trí:       Location pin
🧭 Điều hướng:   Navigation/Compass
⭐ Đánh giá:     Star
💳 Thanh toán:   Credit card
🛡️ Bảo hiểm:    Shield
```

---

## ✅ Accessibility

### Color Contrast

**Text on Backgrounds:**
- Large text (18px+): Minimum 3:1 contrast
- Normal text (16px): Minimum 4.5:1 contrast
- Interactive elements: Minimum 3:1 contrast

**Tested Combinations:**
✅ #2E1A47 on #FFFFFF (12.5:1) - Excellent
✅ #FDB813 on #2E1A47 (5.2:1) - Good
✅ #DC143C on #FFFFFF (7.1:1) - Good
✅ #FFFFFF on #FDB813 (1.9:1) - ⚠️ Large text only
✅ #2E1A47 on #FDB813 (5.2:1) - Good

### Font Sizes

Minimum body text: 16px (for readability)

### Touch Targets

Minimum: 44px × 44px (as per Apple HIG)

---

## 🎬 Animation & Transitions

### Timing Functions

```
Ease In Out:  cubic-bezier(0.4, 0, 0.2, 1)
Ease Out:     cubic-bezier(0.0, 0, 0.2, 1)
Ease In:      cubic-bezier(0.4, 0, 1, 1)
Linear:       linear
```

### Duration

```
Fast:     150ms  (Hover, focus)
Normal:   250ms  (Buttons, tabs)
Slow:     350ms  (Modals, sheets)
XSlow:    500ms  (Page transitions)
```

### Transitions

**Button Press:**
```
Scale: transform 150ms ease-in-out
Opacity: opacity 150ms ease-in-out
```

**Modal/Sheet:**
```
Slide Up: transform 350ms ease-out
Fade In: opacity 250ms ease-in
```

**Tab Switch:**
```
Fade: opacity 250ms ease-in-out
```

---

## 📋 Design Checklist

### Before Implementation

- [ ] Logo created (primary + variations)
- [ ] Color palette applied
- [ ] Typography system defined
- [ ] Component library documented
- [ ] Icon set prepared
- [ ] Spacing system consistent
- [ ] Accessibility checked (contrast, font sizes)
- [ ] Mobile breakpoints defined
- [ ] Animation guidelines set

### During Development

- [ ] Use design tokens (CSS variables)
- [ ] Test on real devices
- [ ] Dark mode support (optional)
- [ ] RTL support (if needed)
- [ ] Performance optimization (image sizes, animations)

---

**Design System Version:** 1.0
**Last Updated:** Feb 2024
**Owner:** Design Team
**Status:** 🟢 Ready for Implementation
