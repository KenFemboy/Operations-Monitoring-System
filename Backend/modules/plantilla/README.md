# Plantilla Module Documentation

## Overview
The **Plantilla** module represents the organizational staffing structure/roster for your system. It defines what roles should exist in each branch along with their compensation details.

## Data Model

### Plantilla Schema
```javascript
{
  branchId: ObjectId,        // Reference to Branch
  role: String,              // Role description (e.g., "Branch Manager")
  baseSalary: Number,        // Base salary for the role
  allowance: Number,         // Monthly allowance
  requiredCount: Number,     // How many of this role are needed (default: 1)
  filledCount: Number,       // How many roles are currently filled (default: 0)
  status: String,            // "active" or "inactive"
  description: String,       // Optional description
  timestamps: true           // createdAt, updatedAt
}
```

## API Endpoints

### 1. Create Plantilla Entry
```
POST /plantilla
Content-Type: application/json

{
  "branchId": "ObjectId",
  "positionId": "ObjectId",
  "role": "Branch Manager
  "allowance": 5000,
  "requiredCount": 1,
  "status": "active"
}
```

### 2. Get All Plantilla Entries
```
GET /plantilla
```
Returns all plantilla entries with populated branch and position details.

### 3. Get Plantilla by ID
```
GET /plantilla/:id
```
Returns a specific plantilla entry.

### 4. Get Plantilla by Branch
```
GET /plantilla/branch/:branchId
```
Returns all plantilla entries for a specific branch.

### 5. Update Plantilla Entry
```
PUT /plantilla/:id
Content-Type: application/json

{
  "baseSalary": 48000,
  "allowance": 5500,
  "requiredCount": 2,
  "status": "active"
}
```

### 7. Delete Plantilla Entry
```
DELETE /plantilla/:id
```

### 8. Get Plantilla Statistics
```
GET /plantilla/stats/:branchId
```
Returns aggregated stats for a branch including:
- Total required positions
- Total filled positions
}
```
Updates how many positions are currently filled.

### 10. Calculate Total Cost
```
GET /plantilla/cost/:branchId
```
Returns total salary and allowance costs for a branch.
6
## Utility Functions

The module includes several utility functions in `plantilla.utils.js`:

### 7lculateVacancy(requiredCount, filledCount)
Calculates vacancy information including:
- Number of vacant positions
- Vacancy rate percentage
- Whether the position is fully staffed

### calculateCompensation(baseSalary, allowance, count)
Calculates total compensation for a position or group of positions.

### formatPlantillaForDisplay(plantillas)
Formats plantilla data for frontend display with nice formatting.

### getOccupancyPercentage(filled, required)
Calculates staffing occupancy as a percentage.

### isFullyStaffed(filled, required)
Checks if a position is fully staffed.

### generateBranchSummary(plantillas)
Generates comprehensive summary statistics for a branch's plantilla.

## Usage Examples

### Create a New Plantilla Entry
```javascript
import * as plantillaService from '../modules/plantilla/plantilla.service.js';

const newPlantilla = await plantillaService.createPlantilla({
  branchId: '507f1f77bcf86cd799439011',
  role: 'Branch Manager',
  baseSalary: 45000,
  allowance: 5000,
  requiredCount: 1,
  status: 'active'
});
```

### Get Branch Summary
```javascript
import * as plantillaService from '../modules/plantilla/plantilla.service.js';
import * as plantillaUtils from '../modules/plantilla/plantilla.utils.js';

const plantillas = await plantillaService.getPlantillaByBranch(branchId);
const summary = plantillaUtils.generateBranchSummary(plantillas);
console.log(summary);
```

### Update Filled Count
```javascript
await plantillaService.updateFilledCount(plantillaId, 5);
```

### Calculate Costs
```javascript
const costs = await plantillaService.calculateTotalCost(branchId);
console.log(`Total Monthly Cost: PHP ${costs.grandTotal}`);
```

## Validation Rules

### Create Validation
- `branchId` - Required, must be valid ObjectId
- `positionId` - Required, must be valid ObjectId
- `baseSalary` - Required, must be > 0
- `allowance` - Must be >= 0
- `requiredCount` - Must be >= 1
- `status` - Must be "active" or "inactive"

### Update Validation
- `baseSalary` - If provided, must be > 0
- `allowance` - If provided, must be >= 0
- `requiredCount` - If provided, must be >= 1
- `filledCount` - If provided, must be >= 0 and <= requiredCount
- `status` - If provided, must be "active" or "inactive"

## Key Features

1. **Branch-Position Uniqueness**: Ensures no duplicate plantilla entries for the same branch-position combination
2. **Vacancy Tracking**: Automatically tracks vacant vs filled positions
3. **Cost CaRole Uniqueness**: Ensures no duplicate plantilla entries for the same branch-role combination
2. **Vacancy Tracking**: Automatically tracks vacant vs filled roles
3. **Cost Calculation**: Calculates total salary and allowance expenses per branch
4. **Occupancy Monitoring**: Tracks staffing levels and occupancy rates
5. **Population Support**: Returns populated references to branch
## Integration Points

- **Branches Module**: References branch data
- **Positions Module**: References position data
- **Payroll Module**: Can use plantilla data for payroll calculations
- **Eayroll Module**: Can use plantilla data for payroll calculations
- **Employee Module**: Filled count can be linked to employee count per role
## Error Handling

The service includes comprehensive error handling:
- Invalid ObjectId validation
- Duplicate entry prevention
- Filled count validation (cannot exceed required count)
- Not found error handling
- Validation error responses

## Notes

- Plantilla entries are unique per branch-position combination
- You must have valid branch and position records before creating plantilla entries
- Filled count should be updated when employees are hired/terminated
- Status can be used to activate/deactivatrole combination
- You must have valid branch records before creating plantilla entries
- Filled count should be updated when employees are hired/terminated
- Status can be used to activate/deactivate role