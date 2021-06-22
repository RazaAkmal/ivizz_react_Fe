import moment from "moment"

export const lastFriday = () => {
  const lastFriday  = new Date()
  lastFriday.setDate(new Date().getDate() - 3)
  lastFriday.setHours(0, 0, 0, 1)
  return lastFriday
}

export const lastThursday = () => {
  const lastThursday  = new Date()
  lastThursday.setDate(new Date().getDate() - 4)
  lastThursday.setHours(0, 0, 0, 1)
  return lastThursday
}

export const yesterday = () => {
  const date = new Date()
  date.setDate(today().getDate() - 1)
  return date
}

export const convertTZ = (date, tzString) =>{
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

export const today = () => {
  const date = new Date()
  return date
}

export function formatDate(epochSecondsString) {
  const asInt = parseInt(epochSecondsString)
  const dateTime = new Date(asInt) 
  const converDate = dateTime.toLocaleString()
  // const convertTZDate = convertTZ(dateTime, "Asia/Kolkata").toLocaleString().replace(/(.*)\D\d+/, '$1')
  return moment.utc(asInt).format("DD/MM/YYYY, hh:mm:ss a");
}

export function getStartingDate() {
  const savedDate = new Date(localStorage.getItem('date'))
  const yesterday = savedDate
  yesterday.setDate(yesterday.getDate() - 1)
  return isNaN(savedDate.getTime()) ? new Date("2021/03/25").getTime()/1000 : yesterday.getTime()/1000 
}

export const isEmpty = (obj) => {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
        return 1;
  }
  return 0;
}

export const openSecureLink = async (fileUrl) => {
  const file = fileUrl.split("storage.googleapis.com/")[1]
  const [bucket, ...rest] = file.split("/")
  const filename = rest.join("/")
  const response = await fetch(`http://ivizz.club/api/generateSignedUrl?bucket=${bucket}&filename=${filename}`)
  const data = await response.json()
  const { url } = data
  window.open(url)
  return url
}

export const extractModuleLabel = (label) => {
  let capsWord = "";
  let splittedStr = label.split("_");
  splittedStr.forEach(element => {
    capsWord += element.charAt(0).toUpperCase() + element.slice(1) + " ";
  });

  return capsWord;
}