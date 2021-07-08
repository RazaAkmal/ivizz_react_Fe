import React, { Component } from 'react';
import apiService from "../../services/api";
import { Button, notification } from 'antd'
import MenuCard from "../../common/components/MenuCard";
import { withRouter } from 'react-router-dom'
import { extractModuleLabel } from "../../common/HelperFunctions";

class Home extends Component {

  constructor(props){
    super(props);
    this.state = {
      token: "",
      subdomain: "",
      site: "",
      loading: false,
      siteIvModules: []
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

    this.setState({ token, subdomain, site, loading: true })

    this.fetchIVModules(token, site)
    
  }

  async fetchIVModules(token, site){
    
    try{
      const response = await apiService.fetchSiteIVModules(token, site.id)
      
      if (response.error) {
        this.openNotification('topRight', 'error', 'Something went wrong. Please login again');
        return
      }
      this.setState({ siteIvModules: response.site_iv_modules, loading: false })
    }catch(err) {
      console.log('-----err: ', err)
      this.openNotification('topRight', 'error', 'Something went wrong. Please try again');
    }
  }

  logout(){
    localStorage.clear();
    this.props.history.push("/login")
  }
   
  render() {
    let { subdomain, site, siteIvModules } = this.state;
    return(
      <React.Fragment>
        <Button 
          style={{ float: 'right', marginRight:'7%' }}
          onClick={() => this.logout()}
        >Logout</Button>
        
        <div className="flexbox">
          {siteIvModules.map(item => {
            const name = item.iv_module.name
            const backgroundImage = `assets/logo.png`
            return <MenuCard 
                      key={item.id} 
                      title={extractModuleLabel(name)}
                      link={`/data/${name.replace(" ", "-")}/${item.id}`}
                      backgroundImage={backgroundImage}
                      cardIcon={item.image}
                    />
          })}
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(Home);
