export class Comment {
  constructor(rating, text, userId = null) {
    this.id = Date.now();
    this.rating = rating;
    this.text = text;
    this.userId = userId;
    this.createdAt = new Date().toLocaleString();
  }
}