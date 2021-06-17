import React, { Component } from 'react';
import apiService from "../../services/api";
import { Button, Spin, notification } from 'antd'
import MenuCard from "../../common/components/MenuCard";
import DetectionSummary from "../../common/components/DetectionSummary";
import { today, yesterday } from '../../common/HelperFunctions'

class ModuleData extends Component {

  constructor(props){
    super(props);
    this.state = {
      token: "",
      subdomain: "",
      site: "",
      loading: false,
      camerasWithDetections: [],
      selectedDate: today(),
      moduleType: ""
    }
  }
  
  openNotification = (placement, type, msg) => {
    notification[type]({
      message: `Error`,
      description: `${msg}!`,
      placement,
      duration: 3,
      style: {backgroundColor: '#FFF2F0'}
    });
  };

  componentDidMount(){
    
    let { token, subdomain, site, loading } = this.state;
    token = localStorage.getItem('token')
    subdomain = localStorage.getItem('subdomain')
    try {
      site =  JSON.parse(localStorage.getItem('site'))
    } catch (error) {
      site = ""
    } 

    apiService.checkAuthentication(token, subdomain, site).then(res => {
      if(!res){
        this.props.history.push("/login")
      }
    })

    let storedDate = localStorage.getItem('date')
    if(!storedDate){
      storedDate = today()
      localStorage.setItem("date", storedDate )
    }

    this.setState({ token, subdomain, site, selectedDate: new Date(storedDate), loading: true }, () => {
      this.fetchDetections()
    })

  }

  async fetchDetections(){
    let { token, site, selectedDate, moduleType } = this.state;
    
    console.log("-------params id: ", this.props.match.params.name);
    moduleType = this.props.match.params.name;
    try{
      const response = await apiService.fetchDetectionsData(
        token, site.id, selectedDate, moduleType, "")
      
      if (response.error) {
        this.openNotification('topRight', 'error', 'Something went wrong. Please login again');
        return
      }
      this.setState({ camerasWithDetections: response.cameras, loading: false, moduleType })
    }catch(err) {
      console.log('-----err: ', err)
      this.openNotification('topRight', 'error', 'Something went wrong. Please try again');
    }
  }

  handleDateChange = (e) => {
    localStorage.setItem('date', e._d)
    this.setState({ selectedDate: e._d, loading: true }, () => {
      this.fetchDetections()
    })
  }

  navigateToCameraDetail(id){
    let currentPath = this.props.history.location.pathname;
    
    this.props.history.push(`${currentPath}/area/${id}`)
  }
   
  render() {
    let { loading, camerasWithDetections, subdomain, selectedDate, moduleType } = this.state;
    return(
      <React.Fragment>
        {loading ? 
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10%'}}>
            <Spin /> 
          </div>
          : 
          <DetectionSummary
            camerasWithDetections= {camerasWithDetections}
            subdomain={subdomain}
            onDateChange={this.handleDateChange}
            date={selectedDate}
            navigateToDetail={(id) => this.navigateToCameraDetail(id)}
            moduleType={moduleType}

/* 
            showPercent={showPercent}
            
            percentToggle={percentToggle}
            maskNonMask={maskNonMask}
            maskToggle={maskToggle}
            labels={labels}
            data={dateDataWithWeights} */
            
            />
        }
      </React.Fragment>
    )
  }
}

export default ModuleData;
