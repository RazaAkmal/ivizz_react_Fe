import React, { Component } from 'react';
import apiService from "../../services/api";
import { Button, Spin, notification, Col, Row,Radio } from 'antd'
import ScoreCard from "../../common/components/ScoreCard";
import DateComponent from "../../common/components/DateComponent";
import BarChart from "../../common/components/BarChart";
import { withRouter } from 'react-router-dom'
import { sum, compact } from 'lodash'
import { extractModuleLabel } from "../HelperFunctions";
import { Table, Tag, Space } from 'antd';
import { columns } from "../Constants";

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

class ShowDetectionLinks extends Component {

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
    let { detectionsData, moduleType } = this.props;
    
    let labelList = [];
    let cameraIds = [];
    let dummyDatasets = [];
    let graphLabel = "";

    console.log("------detectionsData: ",detectionsData);

    detectionsData.map(element => {
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


      ///////////////////////////////////////////////////////// for links
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

    const { _index, _chart } = ctx[0]
    console.log("--------graphBar: ", ctx, _index, _chart);
    // this.props.history.push("/login")
  }
   
  render() {
    let { detectionsData, date, onDateChange, moduleType } = this.props;
    let { maskNonMask, showPercent, labels, datasets, totalScore, graphData } = this.state;
    return(
      <>
        <Row>
          <Col span={10}>
            <div style={{ marginTop: "5%", marginLeft: "20%" }}>
              <Row>
                <DateComponent onChange={onDateChange} date={date} />
                <div style={{marginLeft: "20px", marginTop: "5px"}} >
                  {moduleType === "mask_compliance" ?
                    <Radio.Group
                      options={ComplianceOptions}
                      onChange={this.maskToggle}
                      value={maskNonMask}
                      optionType="button"
                    />
                  : null }
                </div>
              </Row>
            </div>
            <div style={{ marginTop: "20%", marginLeft: "20%", maxWidth: "300px" }}>
              <ScoreCard icon={"mask_detect"} title={"Total Violations"} dateString={date.toDateString()} score={totalScore} units={""} />
            </div>
          </Col>
          <Col span={14}>
            <div style={{ height: "400px", width: "800px" }}>
              <BarChart 
                data={graphData}
                handleChartClick={this.handleChartClick}
                options={options} 
              />
            </div>
          </Col>
        </Row>
        <Row>
          <div style={{marginTop: '20px', marginLeft: '5%'}}>
            <Button >Open All Links</Button>
            
            <Button style={{marginLeft: '10px'}}>CopyData</Button>   
            
          </div>
        </Row>
        <Row>  
          <Col span={24}>
            <Table columns={columns} data={[]} />
          </Col>
        </Row>
      </>
    )
  }
}

export default withRouter(ShowDetectionLinks);
