/**
 * Shared Contract: Review DTO
 * Review information owned by Feedback Service
 * Shared with other services via DTO only
 */

export class ReviewDTO {
  constructor(data = {}) {
    this.reviewId = data.reviewId;
    this.userId = data.userId;            // Reference to user
    this.appointmentId = data.appointmentId; // Optional: link to appointment
    this.rating = data.rating;            // 1-5
    this.text = data.text;
    this.authorName = data.authorName || 'Anonymous';
    this.createdAt = data.createdAt;
  }

  /**
   * Validate rating is in valid range
   * @returns {boolean}
   */
  isValid() {
    return this.rating >= 1 && this.rating <= 5 && this.text && this.text.trim().length >= 5;
  }

  toJSON() {
    return {
      reviewId: this.reviewId,
      userId: this.userId,
      appointmentId: this.appointmentId,
      rating: this.rating,
      text: this.text,
      authorName: this.authorName,
      createdAt: this.createdAt
    };
  }
}

export default ReviewDTO;
