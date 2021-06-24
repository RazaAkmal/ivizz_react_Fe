const ValueOptions = [
  { label: 'Show data in values', value: false },
  { label: 'Show data in %', value: true },
];
const ComplianceOptions = [
  { label: 'Compliance', value: true },
  { label: 'NonCompliance', value: false },
];
const ppeOptions = [
  { label: 'Apron', value: "apron" },
  { label: 'Headcover', value: "headcover" },
  { label: 'Footwear', value: "footwear" },
  { label: 'Glove', value: "glove" },
  { label: 'Goggles', value: "goggles" },
];
const graphOptions = {
  scales: {
    yAxes: [{
      ticks: {
        min: 0,
        // max: 100,
        stepSize: 10
      }
    }]
  }
}

export { ValueOptions, ComplianceOptions, ppeOptions, graphOptions }