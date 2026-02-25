# Codebase Size Analysis

## Current Status: **HEAVY** 🔴

### Metrics
- **51,000 lines** of TypeScript/JavaScript
- **392 files** (TS/TSX/JS)
- **27,500 lines** in components
- **1.6GB** total size
- **14 feature modules**
- **50+ UI components**
- **25+ services**
- **10 language locales**

---

## Target: **COMPACT → MEDIUM** 🎯

### Goal Metrics
- **15-25K lines** total
- **150-200 files**
- **8-10K lines** in components
- **Core features only**

### Benefits
- ⚡ Fast load times for medical staff
- 🚀 Instant response in clinical workflows
- 🔧 Easier maintenance and debugging
- 💰 Lower hosting costs
- 👥 Better developer onboarding

---

## Optimization Plan

### 1. UI Components (50+ → 20-30)
- Remove unused shadcn components
- Keep only actively used components
- Consolidate similar components

### 2. Feature Modules (14 → 8-10)
- Merge related features
- Lazy load heavy modules (financial, analytics)
- Remove redundant code

### 3. Services (25 → 12-15)
- Consolidate similar API services
- Merge CRUD operations
- Remove abstraction layers

### 4. Skeletons & Loaders
- Merge into single reusable component
- Remove duplicate loading states

### 5. Localization (10 → 2-3)
- Start with English + 1-2 primary languages
- Add others on demand

### 6. Permission System
- Simplify abstraction layers
- Reduce strategy pattern complexity

---

## Quick Wins

```bash
# Identify unused components
npx depcheck

# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Remove test files from build
# Update .gitignore and next.config.js
```

### Files to Review
- `components/ui/*` - Remove unused
- `components/skeletons/*` - Consolidate
- `lib/services/*` - Merge similar
- `messages/*.json` - Keep 2-3 only
- `components/features/*` - Merge related

---

## Target Architecture

**MEDIUM Codebase (20-30K lines)**
- Core patient management
- Essential clinical features
- Basic financial module
- Streamlined permissions
- 2-3 languages
- 20-30 UI components
- 12-15 services
