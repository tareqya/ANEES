import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";

import { COLORS } from "../../../assets/colors";
import Header from "../../components/Header";

import Post from "../../Classes/Post";
import Database from "../../Classes/Database";

import { sendNotification } from "../../utils/notifactions";
class AddNewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      loading: false,
    };
    this.db = new Database();
  }

  handleAddPost = () => {
    try {
      const { title, description } = this.state;
      this.setState({ loading: true });
      const post = new Post(title, description, new Date());
      this.db.addNewPost(post.toDict());
      this.db.getCustomers(async (customers) => {
        if (customers != null) {
          for (let i = 0; i < customers.length; i++) {
            if (customers[i].token != "") {
              await sendNotification(customers[i].token, "ANEES", title);
            }
          }

          this.setState({ loading: false, title: "", description: "" });
          alert("פוסט נשלח בהצלחה");
        }
      });
    } catch (err) {
      this.setState({ loading: false });
      alert("נכשל!");
    }
  };

  render() {
    const { title, description, loading } = this.state;
    return (
      <View style={styles.contianer}>
        <Header goBack={() => this.props.navigation.goBack()} />
        <Text style={styles.title}> הוספת פוסט חדש </Text>
        <View>
          <TextInput
            placeholder="כותרת"
            onChangeText={(text) => this.setState({ title: text })}
            style={{ textAlign: "right", marginVertical: 10, fontSize: 24 }}
            value={title}
            underlineColor={COLORS.primary}
          />
          <TextInput
            placeholder="תיאור"
            onChangeText={(text) => this.setState({ description: text })}
            value={description}
            style={{
              textAlign: "right",
              paddingBottom: 100,
              marginVertical: 10,
              fontSize: 20,
            }}
            underlineColor={COLORS.primary}
            multiline
          />
          <Button
            loading={loading}
            color={COLORS.secondary}
            mode="outlined"
            style={styles.btnStyle}
            labelStyle={{ color: COLORS.secondary, fontSize: 18 }}
            onPress={this.handleAddPost}
          >
            הוספת פוסט
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contianer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 20,
  },
  btnStyle: {
    borderColor: COLORS.secondary,
    color: COLORS.secondary,
    marginHorizontal: 20,
  },
});
export default AddNewPost;
