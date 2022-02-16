import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  push,
  equalTo,
  query,
  child,
  orderByChild,
} from "firebase/database";
import { REJECT_STATUS } from "../utils/constens";
import Queue from "./Queue";

const firebaseConfig = {
  apiKey: "AIzaSyBI_AJsTbU6eps4gMZsdpBOCRVpWlKZQZ4",
  authDomain: "anees-d3623.firebaseapp.com",
  databaseURL:
    "https://anees-d3623-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "anees-d3623",
  storageBucket: "anees-d3623.appspot.com",
  messagingSenderId: "872459082634",
  appId: "1:872459082634:web:4c7e93ee7248628e444673",
  measurementId: "G-M9JYYBXF1E",
};
initializeApp(firebaseConfig);

class Database {
  constructor() {
    this.db = getDatabase();
  }

  connect = () => {};

  addNewQueue = (queue) => {
    const reference = ref(this.db, "Queues");
    push(reference, queue);
  };

  getBarberQueuesByDate = async (date, barber_id, callBack = () => {}) => {
    try {
      const reference = child(ref(this.db), "Queues");

      const queuesRef = query(reference, orderByChild("date"), equalTo(date));
      const queues = [];
      onValue(
        queuesRef,
        (snapshot) => {
          for (var key in snapshot.val()) {
            const q = new Queue();
            if (
              snapshot.val()[key].barberId == barber_id &&
              snapshot.val()[key].status != REJECT_STATUS
            ) {
              q.fill_data(snapshot.val()[key]);
              queues.push(q);
            }
          }
          callBack(queues);
        },
        {
          onlyOnce: true,
        }
      );
    } catch (err) {
      console.log(err);
      return null;
    }
  };
}

export default Database;
