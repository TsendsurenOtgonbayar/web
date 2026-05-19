/**
 * Events emitted by Identity Service
 */

import DomainEvent from './DomainEvent.js';

export class UserRegisteredEvent extends DomainEvent {
  constructor(userId, userData) {
    super('UserRegistered', userId, {
      userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.currentRole || 'User'
    });
  }
}

export class UserLoggedInEvent extends DomainEvent {
  constructor(userId) {
    super('UserLoggedIn', userId, { userId });
  }
}

export class UserLoggedOutEvent extends DomainEvent {
  constructor(userId) {
    super('UserLoggedOut', userId, { userId });
  }
}

export default {
  UserRegisteredEvent,
  UserLoggedInEvent,
  UserLoggedOutEvent
};
