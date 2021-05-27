import React, { Component } from 'react';
import apiService from "../../services/api";
import { Button, Spin, notification, Col, Row,Radio } from 'antd'
import ScoreCard from "../../common/components/ScoreCard";
import DateComponent from "../../common/components/DateComponent";
import BarChart from "../../common/components/BarChart";
import { withRouter } from 'react-router-dom'
import { sum, compact } from 'lodash'

const ValueOptions = [
  { label: 'Show data in values', value: false },
  { label: 'Show data in %', value: true },
];
const ComplianceOptions = [
  { label: 'Compliance', value: true },
  { label: 'NonCompliance', value: false },
];
const options = {
  scales: {
    yAxes: [{
      ticks: {
        min: 0,
        max: 100,
        stepSize: 10
      }
    }]
  }
}

class DetectionSummary extends Component {

  constructor(props){
    super(props);
    this.state = {
      maskNonMask: true,
      showPercent: false,
      cameraData: {},
      labels: [],
      datasets: {"complaint": [], "nonComplaint": []},
      totalScore: 0
    }
  }
  componentDidMount(){
    let valCompliance = localStorage.getItem('maskCompliance')
    if(valCompliance !== null)
      this.setState({ maskNonMask: valCompliance === "true" ? true : false })

    this.calculateCameraData();
  }

  calculateCameraData(){
    let { maskNonMask, showPercent, labels, datasets } = this.state;
    let { camerasWithDetections } = this.props;
    
    /*
    return {
      labels,
      datasets: [
        {
          label: maskNonMask ? `Mask Compliance ${showPercent ? '%': ''}`:`Mask NonCompliance ${showPercent ? '%' : ''}` ,
          data: data[0] && data[0].map(entry => {
            if (showPercent && maskNonMask) {
              return Math.round(entry[0] /data[1]  * 100) 
            }
            if (showPercent && !maskNonMask) {
              return Math.round(entry[0] /data[2]  * 100) 
            }
            return entry[0]
          }),
          backgroundColor: "#0199A7"
        }
      ]
    } */
    
    camerasWithDetections.map(element => {

      let maskCompliantSum = 0
      let nonMaskCompliantSum = 0
      
      let { detections } = element
      let maskCompliantPeople = detections.map(detection => detection.media_url ? 1 : 0)
      let nonMaskCompliantPeople = detections.map(detection => detection.violation_count ? 1 : 0)
      maskCompliantSum += sum(maskCompliantPeople)
      nonMaskCompliantSum += sum(nonMaskCompliantPeople)

      labels.push(element.name);
      datasets["complaint"].push(maskCompliantSum);
      datasets["nonComplaint"].push(nonMaskCompliantSum);
      
    })

    this.setState({ labels, datasets })

    this.averageScore();

  }

  averageScore() {
    let { datasets } = this.state;

    const entries   = datasets["complaint"] && datasets["complaint"].map(entry => entry)
    const compacted = compact(entries)
    const total     = sum(compacted)
    const denom     = compacted.length || 1
    
    this.setState({ totalScore: total })
  }

  maskToggle = (e) => {
    localStorage.setItem('maskCompliance', e.target.value)
    this.setState((state, props) => ({
      maskNonMask: !state.maskNonMask
    }));
  }
  percentToggle = () => {
    this.setState((state, props) => ({
      showPercent: !state.showPercent
    }));
  }
  handleChartClick = (ctx) => {
    if (!ctx || ctx.length == 0) return

    // this.props.history.push("/login")
  }
   
  render() {
    let { camerasWithDetections, date, onDateChange } = this.props;
    let { maskNonMask, showPercent, labels, datasets, totalScore } = this.state;
    return(
      <>
        <Row>
        <Col span={8}>
          <div style={{ marginTop: "10%"}}>
            <Row  style={{alignItems: "center", marginBottom: '20px', justifyContent: 'space-around', flexWrap: 'wrap'}}>
              <Col style={{textAlign: "center"}}>
                <DateComponent onChange={onDateChange} date={date} />
              </Col>
            </Row>
            <Row style={{alignItems: "center",marginTop: '10px', justifyContent: 'space-around', flexWrap: 'wrap'}}>
              <Col style={{textAlign: "center"}}>
                <div>
                  <Radio.Group
                    options={ComplianceOptions}
                    onChange={this.maskToggle}
                    value={maskNonMask}
                    optionType="button"
                  />
                </div>
                <div style={{ marginTop: '10px'}}>
                  <Radio.Group
                    options={ValueOptions}
                    onChange={this.percentToggle}
                    value={showPercent}
                    optionType="button"
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div style={{ marginTop: "20%", marginLeft: "20%", maxWidth: "300px" }}>
            <ScoreCard icon={"mask_detect"} title={"Total Violations"} score={totalScore} units={""} />
          </div>
        </Col>
        <Col span={16}>
          <BarChart 
            data={{
              "labels": labels,
              "datasets": [{
                // "labels": labels, "datasets": datasets['complaint'], backgroundColor: "#0199A7"
                label: maskNonMask ? `Mask Compliance ${showPercent ? '%': ''}`:`Mask NonCompliance ${showPercent ? '%' : ''}` ,
                data: datasets['complaint'],
                backgroundColor: "#0199A7"
              }]
            }}
            handleChartClick={this.handleChartClick}
            options={options} />
        </Col>
      </Row>
      </>
    )
  }
}

export default withRouter(DetectionSummary);
