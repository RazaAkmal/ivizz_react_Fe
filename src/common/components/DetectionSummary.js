import React, { Component } from 'react';
import apiService from "../../services/api";
import { Button, Spin, notification, Col, Row,Radio } from 'antd'
import ScoreCard from "../../common/components/ScoreCard";
import DateComponent from "../../common/components/DateComponent";
import BarChart from "../../common/components/BarChart";
import { withRouter } from 'react-router-dom'
import { sum, compact } from 'lodash'
import { extractModuleLabel } from "../HelperFunctions";

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
      totalScore: 0,
      graphData: {}
    }
  }
  async componentDidMount(){
    
    let valCompliance = localStorage.getItem('maskCompliance')
    if(valCompliance !== null){
      this.setState({ maskNonMask: valCompliance === "true" ? true : false }, async () => {
        await this.calculateCameraData();
      })
    } else {
      await this.calculateCameraData();
    }

  }

  async calculateCameraData(){
    let { maskNonMask, showPercent } = this.state;
    let { camerasWithDetections, moduleType } = this.props;
    
    let labelList = [];
    let cameraIds = [];
    let dummyDatasets = [];
    let graphLabel = "";

    camerasWithDetections.map(element => {
      let { detections, detection_count } = element
      let totalDetectionsPerCamera = 0;

      if(moduleType === "mask_compliance"){
        if(maskNonMask){
          let dects = detections.map(detection => detection.details?.mask_detected === 1 ? 1 : 0)
          totalDetectionsPerCamera = sum(dects);
          graphLabel = `Mask Compliance ${showPercent ? '%': ''}`;
        } else {
          let dects = detections.map(detection => detection.details?.mask_detected === -1 ? 1 : 0)
          totalDetectionsPerCamera = sum(dects);
          graphLabel = `Mask NonCompliance ${showPercent ? '%': ''}`;
        }
      } else {
        totalDetectionsPerCamera = detection_count;
        graphLabel = `${extractModuleLabel(moduleType)} ${showPercent ? '%': ''}`;
      }


      labelList.push(element.area_name);
      cameraIds.push(element.id);
      dummyDatasets.push(totalDetectionsPerCamera);
    })

    let totalDatasetSum = sum(dummyDatasets);

    let data = {
      "labels": labelList,
      "cameraIds": cameraIds,
      "datasets": [{
        label: graphLabel,
        // data: datasets['complaint'],
        data: dummyDatasets && dummyDatasets.map(entry => {
              if (showPercent) {
                return Math.round(entry /totalDatasetSum  * 100) 
              }
              return entry
            }),
        backgroundColor: "#0199A7"
      }]
    }

    this.setState({ graphData: data, totalScore: totalDatasetSum })
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

    let { graphData } = this.state;
    const { index, chart } = ctx[0]
    this.props.navigateToDetail(graphData.cameraIds[index]);

  }
   
  render() {
    let { camerasWithDetections, date, onDateChange, moduleType } = this.props;
    let { maskNonMask, showPercent, totalScore, graphData } = this.state;

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
                {moduleType === "mask_compliance" ?
                  <div>
                    <Radio.Group
                      options={ComplianceOptions}
                      onChange={this.maskToggle}
                      value={maskNonMask}
                      optionType="button"
                    />
                  </div>
                : null }
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
