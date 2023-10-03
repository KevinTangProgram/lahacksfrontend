// Using dayjs & react-synced-object:
import { initializeSyncedObject, useSyncedObject, updateSyncedObject } from 'react-synced-object';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

// Interface:
export default function Clock(props) {
  const { syncedData } = useSyncedObject('currentDate');
  if (props.type === "time") {
    return <p className={props.className} style={{ "color": "white" }}>{syncedData.time}</p>;
  }
  if (props.type === "date") {
    return <p className={props.className} style={{ "color": "white" }}>{syncedData.date}</p>;
  }
}
function getHumanizedDate(date) {
  const dayjsDate = dayjs(date);
  return dayjsDate.fromNow();
} 

// Setup:
const currentDateKey = 'currentDate';
function setup() {
  const now = dayjs();
  const time = now.format('h:mm A');
  const date = now.format('MM/DD/YYYY');
  const syncedData = { now, time, date }
  const timeToNextMin = 60 - now.second();

  setTimeout(() => {
    updateSyncedObject('currentDate', setup());
  }, timeToNextMin * 1000);
  return syncedData;
}
initializeSyncedObject(currentDateKey, 'temp', {
  defaultValue: setup()
});


export { getHumanizedDate, currentDateKey };