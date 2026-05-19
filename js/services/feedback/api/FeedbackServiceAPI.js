/**
 * Feedback Service API
 *
 * LocalStorage-backed review storage.
 */

import { ReviewDTO } from '../../../shared/contracts/dtos/ReviewDTO.js';
import { ReviewSubmittedEvent } from '../../../shared/contracts/events/FeedbackEvents.js';
import { eventBus } from '../../../shared/eventBus/EventBus.js';

const REVIEWS_STORAGE_KEY = 'feedback_service_reviews';

function readReviews() {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const reviews = JSON.parse(raw);
    return Array.isArray(reviews) ? reviews : [];
  } catch (error) {
    console.error('Error reading reviews:', error);
    return [];
  }
}

function saveReviews(reviews) {
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
}

function toDTO(review) {
  return new ReviewDTO(review);
}

export class FeedbackServiceAPI {
  static async getRecentReviews(limit = 10) {
    try {
      return readReviews()
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .slice(0, limit)
        .map(review => toDTO(review));
    } catch (error) {
      console.error('Error getting reviews:', error);
      return [];
    }
  }

  static async getReviewsByUserId(userId) {
    try {
      return readReviews()
        .filter(review => review.userId === userId)
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .map(review => toDTO(review));
    } catch (error) {
      console.error('Error getting user reviews:', error);
      return [];
    }
  }

  static async submitReview(userId, reviewData) {
    try {
      const review = new ReviewDTO({
        reviewId: `review-${Date.now()}`,
        userId,
        appointmentId: reviewData.appointmentId || null,
        rating: Number(reviewData.rating),
        text: reviewData.text,
        authorName: reviewData.authorName || 'Anonymous',
        createdAt: new Date().toISOString()
      });

      if (!review.isValid()) {
        return {
          success: false,
          error: 'Сэтгэгдэл хамгийн багадаа 5 тэмдэгттэй, үнэлгээ 1-5 хооронд байх ёстой'
        };
      }

      const reviews = readReviews();
      reviews.unshift(review.toJSON());
      saveReviews(reviews);

      eventBus.publish(new ReviewSubmittedEvent(userId, review.toJSON()));

      return {
        success: true,
        review
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default FeedbackServiceAPI;
