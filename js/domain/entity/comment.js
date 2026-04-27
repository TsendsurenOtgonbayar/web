class Comment {
  constructor(rating, text, userId = null, authorName = "Тодорхойгүй", id = null) {
    this.id = id || Math.random();
    this.rating = rating;
    this.text = text;
    this.userId = userId;
    this.authorName = authorName;
    this.createdAt = new Date().toISOString();
  }

  getInfo() {
    return {
      id: this.id,
      rating: this.rating,
      text: this.text,
      userId: this.userId,
      authorName: this.authorName,
      createdAt: this.createdAt
    };
  }
}

export default Comment;