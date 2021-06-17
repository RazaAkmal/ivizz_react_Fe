import React, { Component } from 'react';
import apiService from "../../services/api";
import { Button, Spin, notification } from 'antd'
import MenuCard from "../../common/components/MenuCard";
import ShowDetectionLinks from "../../common/components/ShowDetectionLinks";
import { today, yesterday } from '../../common/HelperFunctions'

class DetailedData extends Component {

  constructor(props){
    super(props);
    this.state = {
      token: "",
      subdomain: "",
      site: "",
      loading: false,
      detectionsData: {},
      selectedDate: today()
    }
  }
  
  openNotification = (placement, type, msg) => {
    notification[type]({
      message: `Error`,
      description: `${msg}!`,
      placement,
      duration: 3,
      style: {backgroundColor: '#FFF2F0'},
      moduleType: ""
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
    let { name, camId } = this.props.match.params;
    moduleType = name;
    try{
      const response = await apiService.fetchDetectionsData(
        token, site.id, selectedDate, name, Number(camId) )
      
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
   
  render() {
    let { loading, detectionsData, subdomain, selectedDate, moduleType } = this.state;
    return(
      <React.Fragment>
        {loading ? 
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10%'}}>
            <Spin /> 
          </div>
          :
          <> 
          <ShowDetectionLinks
            detectionsData= {detectionsData}
            subdomain={subdomain}
            onDateChange={this.handleDateChange}
            date={selectedDate}
            moduleType={moduleType}
          />
          </>
        }
      </React.Fragment>
    )
  }
}

export default DetailedData;
