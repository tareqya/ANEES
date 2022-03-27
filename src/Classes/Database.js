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
  remove,
  get,
  update,
  set,
} from "firebase/database";
import * as StorageDB from "firebase/storage";
import { getAuth } from "firebase/auth";
import {
  APPROVE_STATUS,
  REJECT_STATUS,
  WAITING_STATUS,
} from "../utils/constens";
import Queue from "./Queue";
import { compareDate, isQueuePass } from "../utils/utilsFunctions";
import User from "./User";

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

try {
  initializeApp(firebaseConfig);
} catch (err) {}
class Database {
  constructor() {
    this.db = getDatabase();
  }

  addNewQueue = (queue) => {
    const reference = ref(this.db, "Queues");
    push(reference, queue);
  };

  getBarberQueuesByDate = async (date, barber_id, callBack = () => {}) => {
    try {
      const reference = child(ref(this.db), "Queues");

      const queuesRef = query(reference, orderByChild("date"), equalTo(date));

      onValue(
        queuesRef,
        (snapshot) => {
          const queues = [];
          for (var key in snapshot.val()) {
            const q = new Queue();
            if (
              snapshot.val()[key].barber_id == barber_id &&
              snapshot.val()[key].status != REJECT_STATUS
            ) {
              q.fill_data(snapshot.val()[key], key);
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
      callBack(null);
      return null;
    }
  };

  getCustomerQueueByUid = async (customer_id, callBack = () => {}) => {
    try {
      const reference = child(ref(this.db), "Queues");
      const customer_queuesRef = query(
        reference,
        orderByChild("customer_id"),
        equalTo(customer_id)
      );

      onValue(customer_queuesRef, (snapshot) => {
        const queues = [];
        for (var key in snapshot.val()) {
          const q = new Queue();
          q.fill_data(snapshot.val()[key], key);
          if (!isQueuePass(q.date, q.start_time)) {
            queues.push(q);
          }
        }
        queues.sort((a, b) =>
          compareDate(a.date, a.start_time, b.date, b.start_time)
        );
        queues.reverse();
        callBack(queues);
      });
    } catch (err) {
      callBack(null);
      return null;
    }
  };

  removeQueue = (key) => {
    try {
      const reference = child(ref(this.db), `Queues/${key}`);
      remove(reference);
    } catch (err) {}
  };

  updateUserInfo = async (user) => {
    try {
      const reference = ref(this.db, `Users/${user.uid}`);
      await update(reference, user);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  onUserInfoChange = (uid, callBack) => {
    const reference = ref(this.db, `Users/${uid}`);
    onValue(reference, (snapshot) => {
      if (snapshot.val() == null) {
        callBack(null);
        return;
      }
      const user = new User();
      user.fill_data(snapshot.val());
      callBack(user);
    });
  };

  getUserInfo = (uid, callBack) => {
    const reference = ref(this.db, `Users/${uid}`);
    onValue(
      reference,
      (snapshot) => {
        if (snapshot.val() == null) {
          callBack(null);
          return;
        }
        const user = new User();
        user.fill_data(snapshot.val());
        callBack(user);
      },
      {
        onlyOnce: true,
      }
    );
  };

  getCurrentUser = () => {
    return getAuth().currentUser;
  };

  logout = () => {
    getAuth().signOut();
  };

  getBarberApprovedQueuesByDate = async (
    date,
    barber_id,
    callBack = () => {}
  ) => {
    try {
      const reference = child(ref(this.db), "Queues");

      const queuesRef = query(reference, orderByChild("date"), equalTo(date));

      onValue(queuesRef, async (snapshot) => {
        const queues = [];
        for (var key in snapshot.val()) {
          const q = new Queue();
          if (
            snapshot.val()[key].barber_id == barber_id &&
            snapshot.val()[key].status == APPROVE_STATUS
          ) {
            q.fill_data(snapshot.val()[key], key);
            const userRef = ref(this.db, `Users/${q.customer_id}`);
            const v = await get(userRef);

            const user = new User();
            user.fill_data(v.val());

            queues.push({ queue: q, customer: user });
          }
        }
        callBack(queues);
      });
    } catch (err) {
      callBack(null);
      return null;
    }
  };

  updateQueueStatus = (queueKey, status) => {
    const reference = child(ref(this.db), `Queues/${queueKey}`);
    update(reference, { status });
  };

  getBarberWaitingQueues = async (barber_id, callBack = () => {}) => {
    try {
      const reference = child(ref(this.db), "Queues");

      const queuesRef = query(
        reference,
        orderByChild("barber_id"),
        equalTo(barber_id)
      );

      onValue(queuesRef, async (snapshot) => {
        const queues = [];
        for (var key in snapshot.val()) {
          const q = new Queue();
          if (
            snapshot.val()[key].barber_id == barber_id &&
            snapshot.val()[key].status == WAITING_STATUS
          ) {
            q.fill_data(snapshot.val()[key], key);
            const userRef = ref(this.db, `Users/${q.customer_id}`);
            const v = await get(userRef);

            const user = new User();
            user.fill_data(v.val());

            queues.push({ queue: q, customer: user });
          }
        }
        queues.sort((a, b) =>
          compareDate(
            a.queue.date,
            a.queue.start_time,
            b.queue.date,
            b.queue.start_time
          )
        );
        queues.reverse();
        callBack(queues);
      });
    } catch (err) {
      callBack(null);
      return null;
    }
  };

  getCustomers = (callBack = (customers) => {}) => {
    try {
      const reference = child(ref(this.db), `Users`);
      const queuesRef = query(
        reference,
        orderByChild("isAdmin"),
        equalTo(false)
      );
      onValue(
        queuesRef,
        (snapshot) => {
          const customers = [];
          if (snapshot.val() == null) {
            callBack(customers);
            return;
          }
          for (let key in snapshot.val()) {
            const user = new User();
            user.fill_data(snapshot.val()[key]);
            if (user.uid == "" || user.uid == undefined) {
              user.uid = key;
            }
            customers.push(user);
          }

          callBack(customers);
        },
        {
          onlyOnce: true,
        }
      );
    } catch (err) {
      callBack(null);
    }
  };

  addNewCustomer = async (user, callBack = () => {}) => {
    try {
      const reference = child(ref(this.db), `Users`);
      await push(reference, user);
      callBack(true);
    } catch (err) {
      callBack(false);
    }
  };

  getCustomerByPhone = (phone, callBack = () => {}) => {
    try {
      const reference = child(ref(this.db), `Users`);
      const queuesRef = query(reference, orderByChild("phone"), equalTo(phone));
      onValue(
        queuesRef,
        (snapshot) => {
          if (snapshot.val() == null) {
            callBack(null);
            return;
          }

          for (let key in snapshot.val()) {
            const user = new User();
            user.fill_data(snapshot.val()[key]);
            callBack(user);
            break;
          }
        },
        {
          onlyOnce: true,
        }
      );
    } catch (err) {
      callBack(null);
    }
  };

  getBarbers = (callBack = (barbers) => {}) => {
    try {
      const reference = child(ref(this.db), `Users`);
      const queuesRef = query(
        reference,
        orderByChild("isAdmin"),
        equalTo(true)
      );
      onValue(
        queuesRef,
        (snapshot) => {
          const barbers = [];
          if (snapshot.val() == null) {
            callBack(barbers);
            return;
          }
          for (let key in snapshot.val()) {
            const user = new User();
            user.fill_data(snapshot.val()[key]);
            if (user.uid == "" || user.uid == undefined) {
              user.uid = key;
            }
            barbers.push(user);
          }

          callBack(barbers);
        },
        {
          onlyOnce: true,
        }
      );
    } catch (err) {
      callBack(null);
    }
  };

  getManagerCode = (callBack) => {
    const reference = ref(this.db, "Globals/managerCode");
    onValue(
      reference,
      (snapshot) => {
        callBack(snapshot.val());
      },
      { onlyOnce: true }
    );
  };

  updateManagerPassword = async (code) => {
    try {
      const reference = ref(this.db, "Globals");
      await update(reference, { managerCode: code });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  donwloadImage = async (imageName) => {
    try {
      const storage = StorageDB.getStorage();
      const storageRef = StorageDB.ref(storage, imageName);
      const url = await StorageDB.getDownloadURL(storageRef);
      return url;
    } catch (err) {
      return null;
    }
  };
}

export default Database;
