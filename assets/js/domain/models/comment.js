export class Comment {
  constructor({ rating, text, userId = null, authorName = "Тодорхойгүй", createdAt = new Date().toISOString() } = {}) {
    this.rating = rating;
    this.text = text;
    this.userId = userId;
    this.authorName = authorName;
    this.createdAt = createdAt;
  }
  getInfo() {
    return {
      rating: this.rating,
      text: this.text,
      userId: this.userId,
      authorName: this.authorName,
      createdAt: this.createdAt,
    }
  }
}