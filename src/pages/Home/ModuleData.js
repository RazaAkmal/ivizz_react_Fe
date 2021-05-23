import React, { Component } from 'react';
import apiService from "../../services/api";
import { Button } from 'antd'
import MenuCard from "../../common/components/MenuCard";

class ModuleData extends Component {

  constructor(props){
    super(props);
    this.state = {
      subdomain: "",
      site: "",
      siteIvModules: []
    }
  }

  componentDidMount(){
    let { siteIvModules } = this.state;
    apiService.getSiteIvModules("gems").then(val => {
      siteIvModules = val
      this.setState({ subdomain: "gems", site: "gurgaon", siteIvModules })
    });
    
    
  }
   
  render() {
    let { subdomain, site, siteIvModules } = this.state;
    return(
      <React.Fragment>
        <span>module page</span>
        {/* <MaskDetectSummary
          showPercent={showPercent}
          subDomin={subDomin}
          percentToggle={percentToggle}
          maskNonMask={maskNonMask}
          maskToggle={maskToggle}
          labels={labels}
          data={dateDataWithWeights}
          onDateChange={handleDateChange}
          date={date} /> */}
      </React.Fragment>
    )
  }
}

export default ModuleData;
