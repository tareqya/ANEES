export const convertDateToString = (date) => {
  if (date == null) return "";
  return (
    date.getFullYear() +
    "-" +
    `${date.getMonth() + 1}`.padStart(2, "0") +
    "-" +
    `${date.getDate()}`.padStart(2, "0")
  );
};

export const convertStringToDate = (stringDate) => {
  return new Date(stringDate);
};

export const getFreeHours = (start_time, end_time, service_time, queues) => {
  const startTimeInMin = convertStringHourToMin(start_time);
  const end_timeInMin = convertStringHourToMin(end_time);
  const freeHours = [];
  for (let i = startTimeInMin; i < end_timeInMin; i += service_time) {
    var taken = false;
    for (let j = 0; j < queues.length; j++) {
      const queueStartTimeInMin = convertStringHourToMin(queues[j].start_time);
      const queueEndTimeInMin = convertStringHourToMin(queues[j].end_time);

      if (
        (i >= queueStartTimeInMin && i < queueEndTimeInMin) ||
        (i + service_time >= queueStartTimeInMin &&
          i + service_time <= queueEndTimeInMin)
      ) {
        taken = true;
        break;
      }
    }

    if (!taken) {
      freeHours.push(convertMinsToHrsMins(i));
    }
  }

  return freeHours;
};

export const convertStringHourToMin = (hourStr) => {
  const [hours, minutes] = hourStr.split(":");
  const totalMin = +hours * 60 + +minutes;
  return totalMin;
};

export const convertMinsToHrsMins = (minutes) => {
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  return h + ":" + m;
};

export const compareDate = (strDate1, strTime1, strDate2, strTime2) => {
  const date1 = convertStringToDate(strDate1);
  const date2 = convertStringToDate(strDate2);
  const time1 = convertStringHourToMin(strTime1);
  const time2 = convertStringHourToMin(strTime2);

  if (date1 > date2) return 1;
  if (date2 > date1) return -1;
  if (time1 > time2) return 1;
  if (time2 > time1) return -1;
  return 0;
};

export const changeDateFormat = (strDate) => {
  const [year, month, day] = strDate.split("-");
  return day + "/" + month;
};

export const isQueuePass = (strDate, strStartTime) => {
  const d = new Date();
  const current_time = d.getHours() + ":" + d.getMinutes();
  const current_date = convertDateToString(d);
  return compareDate(current_date, current_time, strDate, strStartTime) >= 1;
};
