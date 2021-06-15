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

class ShowDetectionLinks extends Component {

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

    // await this.calculateCameraData();
  }

  async calculateCameraData(){
    let { maskNonMask, showPercent, labels, datasets } = this.state;
    let { camerasWithDetections } = this.props;
    
    let labelList = [];
    let dummyDatasets = {"complaint": [], 'totalCompliantSum': 0, "nonComplaint": [], 'totalNonCompliantSum': 0};

    let totalCompliantSum = 0
    let totalNonCompliantSum = 0

    camerasWithDetections.map(element => {
      
      let { detections, detection_count } = element
      /* let CompliantPeople = detections.map(detection => detection.media_url ? 1 : 0)
      let nonCompliantPeople = detections.map(detection => detection.violation_count ? 1 : 0) */

      labelList.push(element.area_name);
      dummyDatasets["complaint"].push(detection_count);
      // dummyDatasets["nonComplaint"].push(sum(nonCompliantPeople));
      
    })

    totalCompliantSum += sum(dummyDatasets["complaint"]);
    totalNonCompliantSum += sum(dummyDatasets["nonComplaint"]);

    dummyDatasets["totalCompliantSum"] = totalCompliantSum;
    dummyDatasets["totalNonCompliantSum"] = totalNonCompliantSum;

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

    const entries   = maskNonMask ? datasets["totalCompliantSum"] : datasets["totalNonCompliantSum"];
    /* const compacted = compact(entries)
    const total     = sum(compacted) */
    
    this.setState({ totalScore: entries })
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
    let { detectionsData, date, onDateChange } = this.props;
    let { maskNonMask, showPercent, labels, datasets, totalScore, graphData } = this.state;
    return(
      <>
        <Row>
          <Col span={10}>
            <div style={{ marginTop: "5%", marginLeft: "20%" }}>
              <Row>
                <DateComponent onChange={onDateChange} date={date} />
                <div style={{marginLeft: "20px", marginTop: "5px"}} >
                  <Radio.Group
                    options={ComplianceOptions}
                    onChange={this.maskToggle}
                    value={maskNonMask}
                    optionType="button"
                  />
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
        {/* <Row>
          <div style={{marginTop: '20px', marginLeft: '5%'}}>
            <Button onClick={openAllLink} >Open All Links</Button>
            { linksValue !== '' &&
            <Button onClick={copyData} style={{marginLeft: '10px'}}>CopyData</Button>   
            }
          </div>
          <Table columns={tableColumns} data={tableData} />
        </Row> */}
      </>
    )
  }
}

export default withRouter(ShowDetectionLinks);
