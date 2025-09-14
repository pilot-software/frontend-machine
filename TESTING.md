# Testing Configuration System

## Quick Test

```bash
./test-config.sh
```

## Manual Testing Steps

### 1. Basic Test (ConfigSwitcher)
```bash
npm run dev
# Visit http://localhost:3000
# Use dropdown in top-right to switch configs
```

### 2. Domain Test (Recommended)
```bash
# Add to /etc/hosts:
echo "127.0.0.1 clinic.localhost" | sudo tee -a /etc/hosts
echo "127.0.0.1 enterprise.localhost" | sudo tee -a /etc/hosts

npm run dev

# Test URLs:
# http://clinic.localhost:3000 - Small clinic
# http://enterprise.localhost:3000 - Big hospital
```

### 3. Verify Differences

**Small Clinic (clinic.localhost:3000):**
- System Name: "Family Clinic"
- No Finance role
- No Ward Management
- Simplified navigation

**Big Hospital (enterprise.localhost:3000):**
- System Name: "Metro General Hospital" 
- All roles enabled
- Advanced features
- Enterprise navigation labels

## Expected Results

- Different system names in header
- Different navigation menus
- Different available roles
- Different feature availability