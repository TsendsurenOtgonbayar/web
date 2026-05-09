import { getReviews, setReviews } from "./storageService.js";

const DEFAULT_REVIEWER = "Зочин (Та)";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export function listReviews() {
  return getReviews();
}

export function addReview({ rating, text, name = DEFAULT_REVIEWER }) {
  const reviews = getReviews();
  const review = {
    id: Date.now(),
    rating,
    text,
    name,
    createdAt: formatDate(new Date())
  };

  reviews.unshift(review);
  setReviews(reviews);
  return review;
}