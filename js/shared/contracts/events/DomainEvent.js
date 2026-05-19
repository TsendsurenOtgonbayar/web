/**
 * Base Domain Event
 * All domain events inherit from this
 */

export class DomainEvent {
  constructor(eventType, aggregateId, data = {}) {
    this.eventType = eventType;
    this.aggregateId = aggregateId;  // Typically userId or appointmentId
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.eventId = `${eventType}-${aggregateId}-${Date.now()}`;
  }

  toJSON() {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      data: this.data,
      timestamp: this.timestamp
    };
  }
}

export default DomainEvent;
