import moment from "moment"
import { sum } from 'lodash'

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

export const checkModuleTypeAndFilterData = ( moduleType, detections, maskNonMask, showPercent, detection_count ) => {
  let totalDetectionsPerCamera = 0;
  let graphLabel = "";
  let detectionsList = []

  if(moduleType === "mask_compliance"){
    if(maskNonMask){
      let dects = detections.map(detection => detection.details?.mask_detected === 1 ? 1 : 0)
      totalDetectionsPerCamera = sum(dects);
      graphLabel = `Mask Compliance ${showPercent ? '%': ''}`;
      detectionsList = detections.filter(detection => detection.details?.mask_detected === 1 ? 1 : 0);
      
    } else {
      let dects = detections.map(detection => detection.details?.mask_detected === -1 ? 1 : 0)
      totalDetectionsPerCamera = sum(dects);
      graphLabel = `Mask NonCompliance ${showPercent ? '%': ''}`;
      detectionsList = detections.filter(detection => detection.details?.mask_detected === -1 ? 1 : 0);
    }
  } else {
    totalDetectionsPerCamera = detection_count;
    graphLabel = `${extractModuleLabel(moduleType)} ${showPercent ? '%': ''}`;
    detectionsList = detections;
  }

  return [totalDetectionsPerCamera, graphLabel, detectionsList]
}

export const decideDetailsParam = (moduleTtype, valCompliance, ppeButton) => {
  let detailsData = {}

  if(moduleTtype === "mask_compliance" ){
    if(valCompliance) 
        detailsData['mask_detected'] = valCompliance === "true" ? 1 : -1
    else {
      detailsData['mask_detected'] = 1
      localStorage.setItem('maskCompliance', true)
    }
  } else if(moduleTtype === "safety_detect" ){
    if(ppeButton)
        detailsData[ppeButton] = false
    else {
      detailsData["apron"] = false
      localStorage.setItem('ppeButton', 'apron')
    }
  }

  return detailsData;
}