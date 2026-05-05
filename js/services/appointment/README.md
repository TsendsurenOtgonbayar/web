# Appointment Service - Complete Reference Implementation

## Overview

The Appointment Service manages veterinary appointments and demonstrates **inter-service communication** in SOA. Its key feature: **users can only book appointments if they have at least one registered pet**, verified through a call to the Patient Service API.

---

## Architecture

```
Appointment Service
│
├─ DOMAIN LAYER
│  ├─ Appointment Entity
│  │  └─ Properties: appointmentId, userId, petId, doctorId, date, time, serviceType, status
│  └─ AppointmentDomainService
│     ├─ validateAppointmentData()
│     ├─ isSlotAvailable()
│     ├─ getServiceOfferings()
│     └─ getAvailableSlots()
│
├─ INFRASTRUCTURE LAYER
│  └─ AppointmentStore
│     ├─ Storage: localStorage['appointment_service_appointments']
│     ├─ CRUD operations
│     └─ Ownership verification
│
├─ APPLICATION LAYER (ORCHESTRATION)
│  └─ AppointmentApplicationService
│     ├─ bookAppointment() ← KEY: Calls PatientService!
│     ├─ getAppointmentsForUser()
│     ├─ getAppointmentsForPet()
│     ├─ cancelAppointment()
│     └─ Other operations
│
└─ API LAYER (PUBLIC INTERFACE)
   └─ AppointmentServiceAPI
      ├─ bookAppointment(userId, appointmentData)
      ├─ getAppointmentsForUser(userId)
      ├─ getAppointmentsForPet(petId)
      ├─ cancelAppointment(appointmentId, userId)
      ├─ getAvailableSlots(date)
      └─ getServiceOfferings()
```

---

## Key Feature: Inter-Service Communication

### The Problem
A user should **only be able to book an appointment if they have at least one registered pet**. However:
- Appointment Service cannot directly access Patient Service's internal database
- Patient Service data is managed independently
- They should remain loosely coupled

### The Solution: Synchronous API Call

The `bookAppointment()` method calls `PatientService.getPetsByUserId(userId)`:

```
Presentation Layer
        ↓
AppointmentService.bookAppointment(userId, appointmentData)
        ↓
AppointmentApplicationService.bookAppointment()
        │
        ├─ 1. Validate appointment data
        │
        └─ 2. CALL: PatientService.getPetsByUserId(userId)
                ↓
           PatientServiceAPI.getPetsByUserId()
                ↓
           Returns: {success: true, pets: [PetDTO, ...]} or {success: true, pets: []}
                ↓
        ├─ 3. Check: pets.length > 0?
        │     ├─ YES → Verify petId, proceed with booking
        │     └─ NO  → Reject: "Must register pet first"
        │
        └─ 4. Persist appointment or return error
```

### Code Example

```javascript
// Inside AppointmentApplicationService.bookAppointment()

static async bookAppointment(userId, appointmentData) {
  // Step 1: Validate format
  const validation = AppointmentDomainService.validateAppointmentData(appointmentData);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  try {
    // ========== INTER-SERVICE CALL ==========
    console.log(`📞 Appointment Service calling Patient Service...`);
    const petsResult = await PatientService.getPetsByUserId(userId);

    // Check if user has at least one pet
    if (!petsResult.pets || petsResult.pets.length === 0) {
      console.log(`❌ User ${userId} has no pets - appointment rejected`);
      return {
        success: false,
        errors: ['Must register at least one pet before booking']
      };
    }

    console.log(`✅ User has ${petsResult.pets.length} pet(s) - proceeding`);

    // Step 2: Verify the requested petId belongs to user
    const petIds = petsResult.pets.map(p => p.petId);
    if (!petIds.includes(appointmentData.petId)) {
      return {
        success: false,
        errors: ['Selected pet does not belong to user']
      };
    }

    // Step 3: Check slot availability and create appointment
    // ... rest of booking logic
  } catch (error) {
    return { success: false, errors: [error.message] };
  }
}
```

---

## How It Works: Booking Flow

### Scenario 1: User HAS Pets ✅

```
User clicks "Book Appointment"
        ↓
selects pet-456 from their 2 pets
        ↓
AppointmentService.bookAppointment('user-123', {...})
        ↓
PatientService.getPetsByUserId('user-123')
        ↓
Returns: [PetDTO(pet-456), PetDTO(pet-789)]
        ↓
Check: Array length = 2 ✓
Check: pet-456 in array ✓
        ↓
✅ BOOKING APPROVED
Create appointment in storage
```

### Scenario 2: User has NO Pets ❌

```
New user tries to book
        ↓
AppointmentService.bookAppointment('new-user', {...})
        ↓
PatientService.getPetsByUserId('new-user')
        ↓
Returns: []
        ↓
Check: Array length = 0 ✗
        ↓
❌ BOOKING REJECTED
Error: "Must register at least one pet before booking"
        ↓
UI shows error message
```

---

## API Methods

### Book Appointment (With Inter-Service Call)
```javascript
const result = await AppointmentService.bookAppointment(userId, {
  petId: 'pet-456',
  date: '2024-02-20',      // YYYY-MM-DD
  time: '10:00',           // HH:mm
  serviceType: 'checkup',  // checkup, vaccination, surgery, dental, emergency
  notes: 'Annual checkup'
});

// Internally calls: PatientService.getPetsByUserId(userId)
// Returns: {success: true/false, appointment?: AppointmentDTO, errors?: string[]}
```

### Get User's Appointments
```javascript
const result = await AppointmentService.getAppointmentsForUser(userId);
// Returns: {success: boolean, appointments: AppointmentDTO[]}
```

### Get Pet's Appointments
```javascript
const result = await AppointmentService.getAppointmentsForPet(petId);
// Returns: {success: boolean, appointments: AppointmentDTO[]}
```

### Get Available Slots
```javascript
const result = await AppointmentService.getAvailableSlots('2024-02-20');
// Returns: {success: boolean, slots: ['09:00', '09:30', '10:00', ...]}
```

### Cancel Appointment
```javascript
const result = await AppointmentService.cancelAppointment(appointmentId, userId);
// Verifies ownership before cancelling
// Returns: {success: boolean, error?: string}
```

### Get Service Types
```javascript
const result = await AppointmentService.getServiceOfferings();
// Returns: {success: boolean, services: [{id, name, duration}, ...]}
```

---

## Storage

- **Key**: `'appointment_service_appointments'`
- **Completely independent** from Patient Service storage
- **Format**: Array of appointment objects
- **Ownership**: Each appointment stores `userId` as reference (string, not object)

---

## Key Design Decisions

1. **Inter-Service Dependency**: Appointment Service depends on Patient Service API
2. **API-Only Import**: Never imports Patient Service internal classes
3. **Synchronous Calls**: `await PatientService.getPetsByUserId()`
4. **String References**: Stores `userId` and `petId` as strings
5. **Consistent Response Format**: `{success, data, errors}`

---

## Testing

Run tests with:
```javascript
import { runAllTests } from './services/appointment/TESTS.js';
await runAllTests();
```

Tests include:
- ✅ Book appointment with pet
- ✅ Reject booking without pet (KEY TEST!)
- ✅ Get user appointments
- ✅ Get pet appointments
- ✅ Validation
- ✅ Cancel appointment
- ✅ Available slots
- ✅ Service offerings
- ✅ Ownership verification

---

## Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | This file - architecture & design |
| `INTER_SERVICE_GUIDE.js` | 📞 How inter-service calls work |
| `USAGE_GUIDE.js` | 8 practical examples |
| `TESTS.js` | 9 test scenarios |

---

## Example: Complete Workflow

```javascript
import AppointmentService from './services/appointment/index.js';
import PatientService from './services/patient/index.js';

// 1. User has pets
const petsResult = await PatientService.getPetsByUserId('user-123');
console.log(`User has ${petsResult.pets.length} pet(s)`);

// 2. Check available slots
const slotsResult = await AppointmentService.getAvailableSlots('2024-02-20');
console.log(`Available times: ${slotsResult.slots.join(', ')}`);

// 3. Book appointment
// This internally calls PatientService.getPetsByUserId()!
const bookResult = await AppointmentService.bookAppointment('user-123', {
  petId: petsResult.pets[0].petId,
  date: '2024-02-20',
  time: slotsResult.slots[0],
  serviceType: 'checkup'
});

if (bookResult.success) {
  console.log(`✅ Booked: ${bookResult.appointment.appointmentId}`);
} else {
  console.log(`❌ Failed: ${bookResult.errors[0]}`);
}
```

---

## Key Takeaways

1. **Inter-Service Communication Works**: Appointment Service successfully calls Patient Service API
2. **Business Logic Enforced**: User must have pets to book
3. **Loose Coupling**: Services communicate via APIs only
4. **No Direct Dependencies**: Appointment Service never imports Pet class
5. **Synchronous Pattern**: Works well for validation/verification scenarios

---

## Next Steps

This pattern can be extended to:
- **Feedback Service**: Calls Appointment Service to verify appointment exists before posting review
- **Notification Service**: Listens to AppointmentBooked event and sends confirmations
- **Analytics Service**: Subscribes to appointment events for reporting

---

**Status**: ✅ Production Ready | **Pattern**: SOA with Synchronous Inter-Service Calls
