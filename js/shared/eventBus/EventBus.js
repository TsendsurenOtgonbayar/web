/**
 * Event Bus
 * 
 * Provides pub/sub functionality for domain events.
 * Services emit events when something important happens.
 * Other services subscribe to events they care about.
 * 
 * This allows services to react to changes without direct coupling.
 * 
 * Example:
 * - Patient Service emits PetAddedEvent
 * - Appointment Service listens for PetAddedEvent
 * - When a pet is added, Appointment Service can trigger side effects
 */

export class EventBus {
  constructor() {
    this.subscribers = {};
  }

  /**
   * Register a handler for an event type
   * @param {string} eventType - The event type to listen for (e.g., 'PetAdded')
   * @param {Function} handler - Function to call when event is emitted
   * @param {string} handlerName - Optional identifier for the handler (useful for unsubscribe)
   */
  subscribe(eventType, handler, handlerName = null) {
    if (!this.subscribers[eventType]) {
      this.subscribers[eventType] = [];
    }

    this.subscribers[eventType].push({
      handler,
      name: handlerName || `handler-${this.subscribers[eventType].length}`
    });

    // Return unsubscribe function
    return () => this.unsubscribe(eventType, handlerName);
  }

  /**
   * Unregister a handler
   * @param {string} eventType
   * @param {string} handlerName
   */
  unsubscribe(eventType, handlerName) {
    if (!this.subscribers[eventType]) return;

    this.subscribers[eventType] = this.subscribers[eventType].filter(
      sub => sub.name !== handlerName
    );
  }
  publish(event) {
    const eventType = event.eventType;

    if (!this.subscribers[eventType]) {
      // No subscribers for this event
      return;
    }

    // Call all handlers for this event type
    this.subscribers[eventType].forEach(sub => {
      try {
        sub.handler(event);
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
      }
    });
  }

  /**
   * Get subscriber count for an event type
   * @param {string} eventType
   * @returns {number}
   */
  getSubscriberCount(eventType) {
    return this.subscribers[eventType]?.length || 0;
  }

  /**
   * Clear all subscribers (useful for testing)
   */
  clear() {
    this.subscribers = {};
  }
}

// Singleton instance
export const eventBus = new EventBus();

export default eventBus;
