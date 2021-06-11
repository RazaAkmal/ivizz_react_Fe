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
      datasets: {"complaint": [], 'totalCompliantSum': 0, "nonComplaint": [], 'totalNonCompliantSum': 0,},
      totalScore: 0,
      graphData: {}
    }
  }
  async componentDidMount(){
    let valCompliance = localStorage.getItem('maskCompliance')
    if(valCompliance !== null)
      this.setState({ maskNonMask: valCompliance === "true" ? true : false })

    await this.calculateCameraData();
  }

  async calculateCameraData(){
    let { maskNonMask, showPercent, labels, datasets } = this.state;
    let { camerasWithDetections } = this.props;
    
    let labelList = [];
    let dummyDatasets = {"complaint": [], 'totalCompliantSum': 0, "nonComplaint": [], 'totalNonCompliantSum': 0};

    let totalMaskCompliantSum = 0
    let totalNonMaskCompliantSum = 0

    camerasWithDetections.map(element => {
      
      let { detections } = element
      let maskCompliantPeople = detections.map(detection => detection.media_url ? 1 : 0)
      let nonMaskCompliantPeople = detections.map(detection => detection.violation_count ? 1 : 0)
      /* maskCompliantSum += sum(maskCompliantPeople)
      nonMaskCompliantSum += sum(nonMaskCompliantPeople) */

      labelList.push(element.name);
      dummyDatasets["complaint"].push(sum(maskCompliantPeople));
      dummyDatasets["nonComplaint"].push(sum(nonMaskCompliantPeople));
      
    })

    totalMaskCompliantSum += sum(dummyDatasets["complaint"]);
    totalNonMaskCompliantSum += sum(dummyDatasets["nonComplaint"]);

    dummyDatasets["totalCompliantSum"] = totalMaskCompliantSum;
    dummyDatasets["totalNonCompliantSum"] = totalNonMaskCompliantSum;

    let data = {
      "labels": labelList,
      "datasets": [{
        label: maskNonMask ? `Mask Compliance ${showPercent ? '%': ''}`:`Mask NonCompliance ${showPercent ? '%' : ''}` ,
        // data: datasets['complaint'],
        data: maskNonMask ? dummyDatasets['complaint'] && dummyDatasets['complaint'].map(entry => {
              if (showPercent) {
                return Math.round(entry /dummyDatasets['totalCompliantSum']  * 100) 
              }
              return entry
            })
            : dummyDatasets['nonComplaint'] && dummyDatasets['nonComplaint'].map(entry => {
              if (showPercent) {
                return Math.round(entry /dummyDatasets['totalNonCompliantSum']  * 100) 
              }
              return entry
            }),
        backgroundColor: "#0199A7"
      }]
    }


    this.setState({ labels: labelList, datasets: dummyDatasets, graphData: data }, () => {
      this.averageScore();
    })
    
  }

  averageScore() {
    let { maskNonMask, datasets } = this.state;

    const entries   = maskNonMask ? datasets["complaint"] && datasets["complaint"].map(entry => entry)
    : datasets["nonComplaint"] && datasets["nonComplaint"].map(entry => entry);
    const compacted = compact(entries)
    const total     = sum(compacted)
    const denom     = compacted.length || 1
    
    this.setState({ totalScore: total })
  }

  maskToggle = (e) => {
    localStorage.setItem('maskCompliance', e.target.value)
    this.setState((state, props) => ({
      maskNonMask: !state.maskNonMask
    }), () => {
      this.calculateCameraData();
    });
  }
  percentToggle = () => {
    this.setState((state, props) => ({
      showPercent: !state.showPercent
    }), () => {
      this.calculateCameraData();
    });
  }
  handleChartClick = (ctx) => {
    if (!ctx || ctx.length == 0) return

    const { _index, _chart } = ctx[0]
    console.log("--------graphBar: ", ctx, _index, _chart);
    // this.props.history.push("/login")
  }
   
  render() {
    let { camerasWithDetections, date, onDateChange } = this.props;
    let { maskNonMask, showPercent, labels, datasets, totalScore, graphData } = this.state;
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
            data={graphData}
            handleChartClick={this.handleChartClick}
            options={options} />
        </Col>
      </Row>
      </>
    )
  }
}

export default withRouter(DetectionSummary);
