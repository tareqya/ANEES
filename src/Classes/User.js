class User {
  constructor(uid, first_name, last_name, phone) {
    this.uid = uid;
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone = phone;
    this.isAdmin = false;
  }

  fill_data = (object) => {
    this.first_name = object.first_name;
    this.last_name = object.last_name;
    this.uid = object.uid;
    this.phone = object.phone;
    this.isAdmin = object.isAdmin;
  };

  toDict = () => {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      uid: this.uid,
      phone: this.phone,
      isAdmin: this.isAdmin,
    };
  };
}

export default User;
