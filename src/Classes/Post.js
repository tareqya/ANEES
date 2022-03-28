class Post {
  constructor(title, description, date) {
    this.title = title;
    this.description = description;
    this.date = date;
  }

  toDict() {
    return {
      title: this.title,
      description: this.description,
      date: this.date.toDateString(),
    };
  }
  fill_data(object) {
    this.title = object.title;
    this.description = object.description;
    this.date = new Date(object.date);
  }
}

export default Post;
