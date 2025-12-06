# Smart Grocery Shopping Assistant
## AI-Powered Rule-Based Web Application

**Registration Number:** [YOUR_REGISTRATION_NUMBER]  
**Name:** [YOUR_NAME]  
**Date:** November 2025

---

## 1. Problem Statement

Managing grocery lists efficiently is a common challenge for many households. Users often forget to:
- Re-purchase frequently used items
- Make healthier food choices
- Track and use items before they expire

This project addresses these issues by developing an AI-powered grocery shopping assistant that uses rule-based reasoning to:
1. **Predict missing items** based on purchase history
2. **Suggest healthier alternatives** for items in the grocery list
3. **Provide expiry reminders** for products based on stored purchase history

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Grocery List │  │ Action Panel │  │ Chat Interface│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Logic Layer                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Rules Engine (Rule-Based Reasoning)          │   │
│  │  • Re-Purchase Rules  • Healthier Alternatives       │   │
│  │  • Expiry Rules       • Category Associations        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         AI Flows (Genkit - Natural Language)          │   │
│  │  • Chat Command Processing  • Smart Suggestions      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Storage Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Grocery List  │  │   Purchase   │  │    Rules      │     │
│  │   (Firebase)  │  │   History   │  │  (LocalStorage)│    │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Modern web framework with React |
| UI Design | Responsive CSS framework |
| Database | Cloud-based NoSQL database |
| Authentication | Secure user authentication |
| AI Framework | Google Genkit for natural language processing |
| Rule Engine | Custom rule-based reasoning system |

---

## 3. Implementation Approach

### 3.1 Rule-Based Reasoning System

The system uses a dual-layer approach:
1. **Rule-Based Engine**: Fast, deterministic suggestions based on predefined rules
2. **AI Enhancement**: Natural language processing for conversational interactions

### 3.2 Core Features

#### Feature 1: Predict Missing Items

The system analyzes purchase history to identify items that users typically buy regularly but are missing from their current grocery list.

**How it works:**
- Tracks when items were last purchased
- Identifies frequently purchased items
- Compares purchase history with current grocery list
- Suggests items that should be re-purchased

**Example:** "You bought milk 6 days ago, and it typically runs out within a week. Should I add it again?"

#### Feature 2: Healthier Alternatives

The system maintains a comprehensive database of healthier food substitutions and suggests alternatives for items in the grocery list.

**How it works:**
- Contains 550+ healthier substitution rules
- Matches items in the list with healthier options
- Provides suggestions with explanations

**Examples:**
- White bread → Brown bread
- Full cream milk → Low-fat milk
- Soda → Sparkling water
- Butter → Olive oil

#### Feature 3: Expiry Reminders

The system tracks purchase dates and calculates expiry dates to alert users about items that are expiring soon or have expired.

**How it works:**
- Records purchase date for each item
- Uses default expiry periods (250+ items in database)
- Calculates days until expiry
- Generates warnings for items expiring within 3 days
- Alerts for items that have expired

**Example:** "Milk will expire in 2 days" or "Eggs has expired. Consider replacing it."

---

## 4. System Flow Diagrams

### 4.1 Re-Purchase Suggestion Flow

```
┌─────────────┐
│ User Clicks │
│"Suggest Re- │
│ Purchase"   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Load Purchase       │
│ History from DB     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Get Current Grocery │
│ List Items          │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Rule Engine: Evaluate Rules    │
│ • Check days since purchase    │
│ • Check purchase frequency     │
│ • Check if item in current list│
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────┐
│ Generate Suggestions│
│ with Reasons        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Display to User     │
└─────────────────────┘
```

### 4.2 Healthier Alternatives Flow

```
┌─────────────┐
│ User Clicks │
│"Healthier   │
│ Options"    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Get Current Grocery │
│ List Items          │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Rule Engine: Match Items       │
│ • Exact match lookup            │
│ • Fuzzy/partial matching       │
│ • Word-based matching           │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────┐
│ Get Healthier       │
│ Alternatives from   │
│ Rules Database      │
│ (550+ rules)        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Generate Suggestions│
│ with Explanations   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Display to User     │
└─────────────────────┘
```

### 4.3 Expiry Reminder Flow

```
┌─────────────┐
│ User Clicks │
│"Check       │
│ Expiry"     │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Load Purchase       │
│ History with Dates   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Rule Engine: Calculate Expiry  │
│ • Get purchase date             │
│ • Get expiry days (from rules   │
│   or item data)                 │
│ • Calculate expiry date         │
│ • Calculate days remaining      │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────┐
│ Categorize Items:   │
│ • Expired (≤0 days) │
│ • Warning (≤3 days) │
│ • Safe (>3 days)    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Generate Reminders  │
│ with Severity       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Display to User     │
└─────────────────────┘
```

### 4.4 Chat Interface Flow

```
┌─────────────┐
│ User Types  │
│ Message     │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ AI Flow: Process    │
│ Chat Command        │
│ (Genkit)            │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Detect Intent:      │
│ • add               │
│ • remove            │
│ • suggest           │
│ • expiry            │
│ • healthier         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Execute Action:     │
│ • Call Rule Engine  │
│ • Update List       │
│ • Generate Response │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Display Response    │
│ to User             │
└─────────────────────┘
```

---

## 5. Data Models

### 5.1 Grocery Item Structure

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Item name |
| quantity | number | Quantity (optional) |
| unit | string | Unit of measurement (optional) |
| category | string | Item category (optional) |
| expiryDate | string | Expiry date in ISO format (optional) |
| addedDate | string | Date added in ISO format |

### 5.2 Purchase History Structure

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| itemName | string | Name of purchased item |
| purchaseDate | string | Purchase date in ISO format |
| expiryTimeInDays | number | Typical expiry period in days |
| quantity | number | Quantity purchased (optional) |
| cost | number | Cost (optional) |
| expiryDate | string | Calculated expiry date (optional) |

### 5.3 Rules Database Structure

| Rule Type | Count | Description |
|-----------|-------|-------------|
| Healthier Alternatives | 550+ | Unhealthy item → Healthy alternative mappings |
| Category Associations | 150+ | Primary item → Related items mappings |
| Default Expiry Rules | 250+ | Item name → Typical expiry days mappings |

---

## 6. Key Features Summary

### 6.1 Feature Comparison Table

| Feature | Rule-Based Logic | AI Enhancement | User Interface |
|---------|-----------------|-----------------|----------------|
| **Predict Missing Items** | ✅ Purchase history analysis | ✅ Natural language queries | ✅ Action Panel Button |
| **Healthier Alternatives** | ✅ 550+ substitution rules | ✅ Conversational suggestions | ✅ Action Panel Button |
| **Expiry Reminders** | ✅ Date calculation & tracking | ✅ Smart notifications | ✅ Action Panel Button |
| **Chat Interface** | ✅ Rule-based responses | ✅ Intent detection & NLP | ✅ Chat UI |

### 6.2 Rule Engine Statistics

| Component | Count | Purpose |
|-----------|-------|---------|
| Healthier Alternative Rules | 550+ | Food substitution suggestions |
| Category Association Rules | 150+ | Related item suggestions |
| Default Expiry Rules | 250+ | Expiry tracking for common items |
| **Total Rules** | **950+** | Comprehensive rule coverage |

---

## 7. User Interface Components

### 7.1 Main Application Layout

```
┌─────────────────────────────────────────────────────┐
│                  App Header                         │
│  [Smart Shopper Logo]  [Grocery List] [Rules]      │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│              Tab Navigation                         │
│  [Grocery List]  [AI Assistant]                    │
└─────────────────────────────────────────────────────┘
┌──────────────────────┬──────────────────────────────┐
│                      │                              │
│   Add Item Form      │    Action Panel              │
│   (Card)             │    • Suggest Re-Purchase     │
│                      │    • Healthier Options       │
│   Grocery List       │    • Check Expiry            │
│   Table              │                              │
│   (Card)             │    Suggestions Display      │
│                      │    (Card)                    │
│                      │                              │
└──────────────────────┴──────────────────────────────┘
```

### 7.2 Action Panel Features

| Button | Function |
|--------|----------|
| **Suggest Re-Purchase** | Analyzes purchase history and suggests missing items based on purchase patterns |
| **Healthier Options** | Suggests healthier alternatives for items currently in the grocery list |
| **Check Expiry** | Shows items expiring soon (within 3 days) or items that have already expired |

---

## 8. Implementation Highlights

### 8.1 Rule-Based Reasoning Advantages

1. **Fast Response**: Instant suggestions without AI API calls
2. **Deterministic**: Consistent results for same inputs
3. **Customizable**: Users can modify rules via Rules Management page
4. **Offline Capable**: Works without internet connection (localStorage)

### 8.2 AI Integration Benefits

1. **Natural Language**: Users can chat naturally
2. **Intent Detection**: Understands user queries automatically
3. **Contextual Responses**: Provides explanations and reasoning

### 8.3 System Workflow

The system follows a simple workflow:
1. User interacts with the interface (clicks button or types message)
2. System processes the request using rule-based engine or AI
3. Data is retrieved from storage (grocery list, purchase history, rules)
4. Suggestions or responses are generated
5. Results are displayed to the user

---

## 9. Testing and Validation

### 9.1 Test Scenarios

| Scenario | Expected Behavior | Status |
|----------|------------------|--------|
| User adds "milk" to list | Item appears in grocery list, added to purchase history | ✅ |
| User clicks "Suggest Re-Purchase" | Shows items bought 5-7 days ago that aren't in current list | ✅ |
| User adds "white bread" and clicks "Healthier Options" | Suggests "brown bread" as alternative | ✅ |
| User clicks "Check Expiry" | Shows items expiring within 3 days or expired | ✅ |
| User types "Add 2kg rice" in chat | Item added to list with quantity and unit | ✅ |
| User types "What's expiring?" | Shows expiry reminders | ✅ |

---

## 10. Conclusion

This project successfully implements an AI-powered grocery shopping assistant using rule-based reasoning. The system provides three core features:

1. ✅ **Predict Missing Items**: Uses purchase history analysis to suggest re-purchases
2. ✅ **Healthier Alternatives**: Offers 550+ substitution suggestions
3. ✅ **Expiry Reminders**: Tracks and alerts users about expiring products

The dual-layer approach (rule-based + AI) ensures fast, reliable suggestions while maintaining natural language interaction capabilities. The system is user-friendly, customizable, and scalable.

### Key Achievements

- **950+ predefined rules** for comprehensive coverage
- **Rule-based reasoning** for fast, deterministic suggestions
- **AI integration** for natural language processing
- **Modern web application** with responsive UI
- **Firebase integration** for cloud data storage
- **Customizable rules** via Rules Management interface

---

**End of Report**

