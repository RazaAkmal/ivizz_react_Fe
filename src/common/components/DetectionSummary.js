import React, { Component } from 'react';
import apiService from "../../services/api";
import { Button, Spin, notification, Col, Row,Radio } from 'antd'
import ScoreCard from "../../common/components/ScoreCard";
import DateComponent from "../../common/components/DateComponent";
import BarChart from "../../common/components/BarChart";
import { withRouter } from 'react-router-dom'
import { sum, compact } from 'lodash'
import { extractModuleLabel, checkModuleTypeAndFilterData } from "../HelperFunctions";
import { ValueOptions, ComplianceOptions, ppeOptions, graphOptions } from "../Constant";

class DetectionSummary extends Component {

  constructor(props){
    super(props);
    this.state = {
      maskNonMask: true,
      ppeDetectVal: "apron",
      showPercent: false,
      cameraData: {},
      totalScore: 0,
      graphData: {}
    }
  }
  async componentDidMount(){
    
    let valCompliance = localStorage.getItem('maskCompliance')
    let ppeButton = localStorage.getItem('ppeButton')
    if(valCompliance !== null){
      this.setState({ maskNonMask: valCompliance === "true" ? true : false })
    }
    if(ppeButton !== null){
      this.setState({ ppeDetectVal: ppeButton, })
    }

    await this.calculateCameraData();

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

      // let data = checkModuleTypeAndFilterData(moduleType, detections, maskNonMask, showPercent, detection_count);
      
      totalDetectionsPerCamera = detection_count;
      graphLabel = `${extractModuleLabel(moduleType)} ${showPercent ? '%': ''}`;

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
      let detail = {};
      detail['mask_detected'] = this.state.maskNonMask ? 1 : -1
      this.props.handleChangeOptions(detail);
    });
  }
  ppeToggle = (e) => {
    localStorage.setItem('ppeButton', e.target.value)
    this.setState((state, props) => ({
      ppeDetectVal: e.target.value
    }), () => {
      let detail = {};
      detail[e.target.value] = false
      this.props.handleChangeOptions(detail);
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

  renderModuleTypeOptions(moduleType) {
    let { maskNonMask, ppeDetectVal } = this.state;

    if(moduleType === "mask_compliance"){
      return(
        <div>
          <Radio.Group
            options={ComplianceOptions}
            onChange={this.maskToggle}
            value={maskNonMask}
            optionType="button"
          />
        </div>
      )
    } else if(moduleType === "ppe_detect"){
      return(
        <div>
          <Radio.Group
            options={ppeOptions}
            onChange={this.ppeToggle}
            value={ppeDetectVal}
            optionType="button"
          />
        </div>
      )
    }
    
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
                
                {this.renderModuleTypeOptions(moduleType)}
                
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
            options={graphOptions} />
        </Col>
      </Row>
      </>
    )
  }
}

export default withRouter(DetectionSummary);
