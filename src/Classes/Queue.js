import {
  REJECT_STATUS,
  APPROVE_STATUS,
  WAITING_STATUS,
} from "../utils/constens";

class Queue {
  constructor(
    customer_id,
    date,
    start_time,
    end_time,
    barber_id,
    service,
    status = WAITING_STATUS
  ) {
    this.customer_id = customer_id;
    this.date = date;
    this.start_time = start_time;
    this.end_time = end_time;
    this.barber_id = barber_id;
    this.status = status;
    this.service = service;
  }

  fill_data = (object) => {
    this.customer_id = object.customer_id;
    this.date = object.date;
    this.start_time = object.start_time;
    this.end_time = object.end_time;
    this.barber_id = object.barber_id;
    this.status = object.status;
    this.service = object.service;
  };

  toDict = () => {
    return {
      customer_id: this.customer_id,
      date: this.date,
      start_time: this.start_time,
      end_time: this.end_time,
      barber_id: this.barber_id,
      status: this.status,
      service: this.service,
    };
  };
}

export default Queue;
