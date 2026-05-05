/**
 * Events emitted by Patient Service
 */

import DomainEvent from './DomainEvent.js';

export class PetAddedEvent extends DomainEvent {
  constructor(userId, petData) {
    super('PetAdded', userId, {
      userId,
      petId: petData.petId,
      petName: petData.name,
      petType: petData.type,
      ownerId: userId
    });
  }
}

export class PetUpdatedEvent extends DomainEvent {
  constructor(userId, petData) {
    super('PetUpdated', userId, {
      userId,
      petId: petData.petId,
      changes: petData
    });
  }
}

export class PetDeletedEvent extends DomainEvent {
  constructor(userId, petId) {
    super('PetDeleted', userId, {
      userId,
      petId
    });
  }
}

export default {
  PetAddedEvent,
  PetUpdatedEvent,
  PetDeletedEvent
};
