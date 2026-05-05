/**
 * Events emitted by Feedback Service
 */

import DomainEvent from './DomainEvent.js';

export class ReviewSubmittedEvent extends DomainEvent {
  constructor(userId, reviewData) {
    super('ReviewSubmitted', userId, {
      userId,
      reviewId: reviewData.reviewId,
      appointmentId: reviewData.appointmentId,
      rating: reviewData.rating,
      authorName: reviewData.authorName
    });
  }
}

export class ReviewUpdatedEvent extends DomainEvent {
  constructor(userId, reviewId, newData) {
    super('ReviewUpdated', userId, {
      userId,
      reviewId,
      changes: newData
    });
  }
}

export class ReviewDeletedEvent extends DomainEvent {
  constructor(userId, reviewId) {
    super('ReviewDeleted', userId, {
      userId,
      reviewId
    });
  }
}

export default {
  ReviewSubmittedEvent,
  ReviewUpdatedEvent,
  ReviewDeletedEvent
};
