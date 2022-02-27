import {
  BARBER1,
  BARBER2,
  BARBER3,
  SCISSOR_IMAGE,
  RAZOR_IMAGE,
} from "../../assets/images";
export const SHAVING = "גילוח";
export const HAIRCUT = "תספורת";
export const WAITING_STATUS = "ממתין";
export const APPROVE_STATUS = "אושר";
export const REJECT_STATUS = "נדחה";
export const location = "שפרעם אלעין";
export const phoneNumber = "+972549448023";
export const MONTHS = [
  "ינואר",
  "פברואר",
  "מרס",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

export const BARBERS = [
  { id: "1", name: "Alex Carbali", image: BARBER1 },
  { id: "2", name: "Kimberly Tan", image: BARBER2 },
  { id: "3", name: "James Rodri", image: BARBER3 },
];

export const OPEN_TIME = "9:00";
export const CLOSE_TIME = "21:00";

export const SERVICES = [
  { id: "1", name: HAIRCUT, imageUrl: SCISSOR_IMAGE, time: 30 },
  { id: "2", name: SHAVING, imageUrl: RAZOR_IMAGE, time: 15 },
];
