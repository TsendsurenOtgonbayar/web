export class Comment {
  constructor(rating, text, userId = null) {
    this.rating = rating;
    this.text = text;
    this.userId = userId;
    this.createdAt = new Date();
  }
  getInfo(){
    return {
      Rating:this.rating,
      Text:this.text,
      User:this.userId,
      CreatedTime:this.createdAt
    }
  }
}