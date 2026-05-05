# Patient Service - Complete Reference Implementation

## Overview

The Patient Service is a complete, standalone microservice responsible for managing pets (patients) in the system. It's a reference implementation of the Service-Oriented Architecture (SOA) pattern for this application.

**Key Characteristics:**
- ✅ **Zero dependencies** on User/Identity Service domain classes
- ✅ **Independent storage** using separate localStorage key
- ✅ **Layered architecture** (Domain → Application → Infrastructure)
- ✅ **Public API only** - internal layers are private
- ✅ **Cross-service verification** for other services to call

---

## Directory Structure

```
js/services/patient/
├── api/
│   └── PatientServiceAPI.js       # Public API (only import this!)
├── application/
│   └── PetApplicationService.js   # Orchestration layer
├── domain/
│   ├── entity/
│   │   └── Pet.js                 # Pet domain model
│   └── services/
│       └── PetDomainService.js    # Pure business logic
├── infrastructure/
│   └── storage/
│       └── PetStore.js            # Persistence layer
├── index.js                        # Entry point
├── USAGE_GUIDE.js                 # Examples
└── TESTS.js                        # Test suite
```

---

## Layered Architecture

### 1. **Domain Layer** (Pure Business Logic)

**Pet Entity** (`domain/entity/Pet.js`)
- Represents a pet with properties: `petId`, `userId`, `name`, `type`, `gender`, `birthYear`, `birthMonth`
- Methods: `getAge()`, `getAgeInYears()`, `toJSON()`
- **Key Design**: `userId` is stored as a **string reference**, NOT a nested User object

**PetDomainService** (`domain/services/PetDomainService.js`)
- Pure validation and calculation logic
- Methods:
  - `validatePetData(petData)` - Returns `{valid, errors}`
  - `calculateAge(birthYear, birthMonth)` - Math logic
  - `getHealthCategory(age)` - Pet health status
  - `needsCheckup(age)` - Determine if pet needs veterinary attention
- **No infrastructure access** - no localStorage calls

### 2. **Infrastructure Layer** (Persistence)

**PetStore** (`infrastructure/storage/PetStore.js`)
- All CRUD operations on localStorage
- Independent storage key: `'patient_service_pets'` (NOT shared with User storage)
- Methods:
  - `getAllPets()`, `findById(petId)`, `findByUserId(userId)`
  - `addPet(pet)`, `updatePet(petId, updates)`, `deletePet(petId)`
  - `userOwnsPet(userId, petId)` - **For cross-service calls**
- **Key Pattern**: Uses string userId for filtering

### 3. **Application Layer** (Orchestration)

**PetApplicationService** (`application/PetApplicationService.js`)
- Coordinates domain and infrastructure
- Methods:
  - `createPet(userId, petData)` - Validates then persists
  - `getPetsForUser(userId)` - Returns array of Pet entities
  - `verifyPetOwnership(userId, petId)` - Boolean check for other services
  - `updatePet(petId, userId, updates)` - With ownership verification
  - `deletePet(petId, userId)` - With ownership verification
- **Response Format**: All methods return `{success: boolean, data?: any, errors?: string[]}`

### 4. **API Layer** (Public Interface)

**PatientServiceAPI** (`api/PatientServiceAPI.js`)
- Only layer that other services see
- Functions simulate REST endpoints:
  - `getPetsByUserId(userId)` → GET `/patients/{userId}/pets`
  - `addPet(userId, petData)` → POST `/patients/{userId}/pets`
  - `getPetById(petId)` → GET `/pets/{petId}`
  - `updatePet(petId, userId, updates)` → PATCH `/pets/{petId}`
  - `deletePet(petId, userId)` → DELETE `/pets/{petId}`
  - `verifyPetOwnership(userId, petId)` → GET `/patients/{userId}/pets/{petId}/verify`
  - `getPatientProfile(userId)` → GET `/patients/{userId}`
- Returns DTOs, not internal domain entities
- Publishes domain events for async communication

---

## Key Design Patterns

### Pattern 1: Boundary Enforcement - String References

❌ **WRONG - Creates coupling:**
```javascript
// Inside Patient Service
import User from '../user/User.js';

const pet = {
  name: 'Fluffy',
  user: new User({...})  // Direct nesting!
};
```

✅ **CORRECT - Maintains independence:**
```javascript
// Inside Patient Service
const pet = {
  petId: 'pet-123',
  userId: 'user-456'  // String reference only!
}
```

### Pattern 2: Independent Storage

❌ **WRONG - Shares storage:**
```javascript
// Gets pet from User storage - coupling!
const userData = JSON.parse(localStorage.getItem('LoggedIn'));
const pets = userData.pets;
```

✅ **CORRECT - Isolated storage:**
```javascript
// Patient Service has its own storage key
const petsData = JSON.parse(localStorage.getItem('patient_service_pets'));
```

### Pattern 3: Public API Only

❌ **WRONG - Imports internal layers:**
```javascript
import PetApplicationService from './services/patient/application/PetApplicationService.js';
import PetStore from './services/patient/infrastructure/storage/PetStore.js';

// Now presentation layer is coupled to internal structure!
```

✅ **CORRECT - Uses public API:**
```javascript
import PatientService from './services/patient/index.js';

// Simple, stable interface
const result = await PatientService.addPet(userId, petData);
```

### Pattern 4: Cross-Service Verification

**Appointment Service booking a pet appointment:**

```javascript
// Appointment Service ONLY calls this method
const owns = await PatientService.verifyPetOwnership(userId, petId);

if (!owns) {
  return { success: false, error: 'You do not own this pet' };
}

// If verification passes, proceed with booking
```

This is the **only way** services communicate about internal data validation.

---

## Response Format

All API methods follow this pattern:

```javascript
// Success with data
{
  success: true,
  pet: PetDTO,
  // errors property omitted
}

// Success with multiple items
{
  success: true,
  pets: [PetDTO, PetDTO, ...]
}

// Failure with errors
{
  success: false,
  errors: [
    'Амьтны нэр оруулна уу',  // Pet name is required
    'Төрсөн сар оруулна уу'    // Birth month required
  ]
}

// Cross-service verification (boolean)
true  // User owns pet
false // User doesn't own pet
```

---

## Usage Examples

### Example 1: Add a Pet

```javascript
import PatientService from './services/patient/index.js';

const result = await PatientService.addPet('user-123', {
  name: 'Fluffy',
  type: 'cat',
  gender: 'female',
  birthYear: 2022,
  birthMonth: 3
});

if (result.success) {
  console.log(`Pet added: ${result.pet.name}`);
} else {
  console.log('Errors:', result.errors);
}
```

### Example 2: Get All Pets for User

```javascript
const result = await PatientService.getPetsByUserId('user-123');

if (result.success) {
  console.log(`Found ${result.pets.length} pets`);
  result.pets.forEach(pet => {
    console.log(`- ${pet.name} (${pet.type})`);
  });
}
```

### Example 3: Verify Ownership (from Appointment Service)

```javascript
// In Appointment Service
const owns = await PatientService.verifyPetOwnership(userId, petId);

if (!owns) {
  // Reject appointment booking
  return { success: false, error: 'Pet not found for user' };
}

// Continue with appointment creation
```

### Example 4: Update Pet

```javascript
const result = await PatientService.updatePet(petId, userId, {
  name: 'Fluffy Jr.'
});

if (result.success) {
  console.log(`Updated: ${result.pet.name}`);
}
```

### Example 5: Delete Pet

```javascript
const result = await PatientService.deletePet(petId, userId);

if (result.success) {
  console.log('Pet deleted');
}
```

---

## Testing

Run the test suite:

```javascript
import { runAllTests } from './services/patient/TESTS.js';

await runAllTests();
```

Tests include:
- ✅ Add pet
- ✅ Get pets by user
- ✅ Verify ownership
- ✅ Validation
- ✅ Update pet
- ✅ Delete pet
- ✅ Ownership verification on update/delete

---

## Boundary Rules Checklist

When adding features to Patient Service, ensure:

- [ ] No imports from User/Identity service domain classes
- [ ] No direct access to User storage key (`'LoggedIn'`)
- [ ] All userId references are strings, not User objects
- [ ] Internal layers (application, infrastructure) are never imported outside service
- [ ] Only public API methods are called from other services
- [ ] Storage key is `'patient_service_pets'`, never shared
- [ ] All responses follow `{success, data/error}` pattern
- [ ] Cross-service calls only via public API
- [ ] Events published for side effects

---

## Integration with Other Services

### With API Gateway

```javascript
// In APIGateway.js
import PatientService from './services/patient/index.js';

async function getPatientDashboard(userId) {
  return PatientService.getPatientProfile(userId);
}
```

### With Appointment Service

```javascript
// In Appointment Service before booking
import PatientService from './services/patient/index.js';

async function bookAppointment(userId, petId, appointmentData) {
  // Verify pet ownership
  const owns = await PatientService.verifyPetOwnership(userId, petId);
  
  if (!owns) {
    return { success: false, error: 'Invalid pet' };
  }

  // Proceed with booking
  // ...
}
```

### With Event System

```javascript
// In Appointment Service, listen for pet events
import { eventBus } from './shared/eventBus/EventBus.js';
import { PetDeletedEvent } from './shared/contracts/events/PatientEvents.js';

eventBus.subscribe(
  'PetDeleted',
  (event) => {
    // Cancel any appointments for this pet
    console.log(`Pet ${event.petId} was deleted`);
  },
  'appointment-service-pet-cleanup'
);
```

---

## Migration from Monolith

### Before (Monolithic):
```javascript
// User object contains pets
const user = {
  id: 'user-123',
  name: 'John',
  pets: [
    { id: 'pet-1', name: 'Fluffy' },
    { id: 'pet-2', name: 'Rex' }
  ]
};
```

### After (SOA):
```javascript
// User object has no pets
const user = {
  id: 'user-123',
  name: 'John'
};

// Patient Service manages pets independently
const pets = await PatientService.getPetsByUserId('user-123');
// Returns: [PetDTO, PetDTO]
```

---

## Next Steps

The Patient Service is a complete reference implementation. Use it as a template for:

1. **Identity Service** - User authentication and profiles
2. **Appointment Service** - Veterinary appointments with pet ownership verification
3. **Feedback Service** - Reviews and comments
4. **Other Services** - Follow the same layered pattern

Each service should:
- Have own domain layer
- Have own infrastructure/storage
- Have public API only
- Use string references for cross-service data
- Communicate via API Gateway or EventBus

---

## Common Mistakes to Avoid

1. ❌ Importing application/domain from other files
2. ❌ Storing User objects inside pets
3. ❌ Sharing storage keys between services
4. ❌ Direct class imports between services
5. ❌ Calling internal methods from outside
6. ❌ Modifying PetDTO from other services
7. ❌ Accessing localStorage directly instead of API
8. ❌ Breaking response format contract

---

## Documentation

- [USAGE_GUIDE.js](USAGE_GUIDE.js) - 8 detailed examples
- [TESTS.js](TESTS.js) - Complete test suite
- [index.js](index.js) - Entry point and exports
- [PatientServiceAPI.js](api/PatientServiceAPI.js) - Public API documentation

---

## Summary

The Patient Service demonstrates:
- ✅ **Complete independence** - no coupling to User service
- ✅ **Clean layering** - domain → application → infrastructure
- ✅ **Boundary enforcement** - string references, independent storage
- ✅ **Public API pattern** - only expose API, hide internals
- ✅ **Cross-service verification** - safe inter-service calls
- ✅ **Event-driven** - publish events for async communication

Use this as your reference for building other services in the SOA architecture.
