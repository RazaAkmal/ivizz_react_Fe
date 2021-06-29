import React, { Component } from 'react';
import { Button, Spin, notification, Col, Row,Radio, Table, Tag, Space } from 'antd'
import ScoreCard from "../../common/components/ScoreCard";
import DateComponent from "../../common/components/DateComponent";
import BarChart from "../../common/components/BarChart";
import { withRouter } from 'react-router-dom'
import { sum, compact } from 'lodash'
import { extractModuleLabel, openSecureLink } from "../HelperFunctions";
import moment from "moment";
import { ValueOptions, ComplianceOptions, ppeOptions, graphOptions } from "../Constant";

const columns = [
  {
    title: 'DATE TIME',
    key: 'timestamp',
    render: data => <span>{ moment.utc(data.timestamp).format("DD/MM/YYYY, hh:mm:ss a")}</span>,
  },
  {
    title: 'COUNT',
    key: 'count',
    render: data => <span>{data.urls.length}</span>,
  },
  {
    title: 'VIDEO URL',
    key: 'url',
    render: data => <div>
      {data.urls.length > 0 && data.urls.map((link, i) => 
        <a style={{marginLeft: "5px"}} key={i} onClick={() => openSecureLink(link)} target='_blank'>Link</a>
      )}
    </div>
  },  
];

class ShowDetectionLinks extends Component {

  constructor(props){
    super(props);
    this.state = {
      maskNonMask: true,
      ppeDetectVal: "apron",
      showPercent: false,
      cameraData: {},
      totalScore: 0,
      graphData: {},
      detectionURLs: [],
      copyLinks: ""
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
    let { detectionsData, moduleType } = this.props;
    
    let labelList = [];
    let cameraIds = [];
    let dummyDatasets = [];
    let graphLabel = "";
    let filteredDetections = [];
    let detectionsList = []

    detectionsData.map(element => {
      let { detections, detection_count } = element
      let totalDetectionsPerCamera = 0;

      totalDetectionsPerCamera = detection_count;
      graphLabel = `${extractModuleLabel(moduleType)} ${showPercent ? '%': ''}`;
      detectionsList = detections;
      
      labelList.push(element.area_name);
      cameraIds.push(element.id);
      dummyDatasets.push(totalDetectionsPerCamera);
    })

    let totalDatasetSum = sum(dummyDatasets);
    filteredDetections = this.findDetectionLinks(detectionsList)

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

    this.setState({ graphData: data, totalScore: totalDatasetSum, detectionURLs: filteredDetections  })
  }

  findDetectionLinks(detections){
    let filteredDetections = [];

    detections.forEach(item => {
      let index = filteredDetections.findIndex(e => e.timestamp === item.timestamp);
      if(index !== -1){
        filteredDetections[index]["urls"].push(item.media_url);
      } else {
        filteredDetections.push({
          "timestamp": item.timestamp,
          "urls": [item.media_url]
        })
      }
    });

    return filteredDetections;
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

    const { _index, _chart } = ctx[0]
    console.log("--------graphBar: ", ctx, _index, _chart);
    // this.props.history.push("/login")
  } 
  openAllLink = () => {
    let { detectionURLs } = this.state;

    let linkVal = ''
    detectionURLs.forEach(row => {
      row.urls.forEach(async (link) => {
        // openSecureLink(link)
        const linkUrl = await openSecureLink(link)
        linkVal = `${linkVal} 
        ${linkUrl}`
      })
    })
    setTimeout(() => {
      this.setState({ copyLinks: linkVal })
    }, 3000); 
    
  } 

  copyData = () => {
    let { copyLinks } = this.state;
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = copyLinks;
    dummy.select(); 
    document.execCommand("copy");
    document.body.removeChild(dummy);
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
    } else if(moduleType === "safety_detect"){
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
    let { detectionsData, date, onDateChange, moduleType } = this.props;
    let { maskNonMask, showPercent, totalScore, graphData, detectionURLs, copyLinks } = this.state;

    return(
      <>
        <Row>
          <Col span={10}>
            <div style={{ marginTop: "5%", marginLeft: "20%" }}>
              <Row>
                <DateComponent onChange={onDateChange} date={date} />
                <div style={{ marginTop: "5px"}} >
                  {this.renderModuleTypeOptions(moduleType)}
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
                options={graphOptions} 
              />
            </div>
          </Col>
        </Row>
        <Row>
          <div style={{marginTop: '20px', marginLeft: '5%'}}>
            <Button onClick={() => this.openAllLink()}>Open All Links</Button>
            { copyLinks !== '' &&
            <Button onClick={() => this.copyData()} style={{marginLeft: '10px'}}>CopyData</Button>
            }
            
          </div>
        </Row>
        <Row>  
          <Col span={24}>
            <Table columns={columns} dataSource={detectionURLs} />
          </Col>
        </Row>
      </>
    )
  }
}

export default withRouter(ShowDetectionLinks);
