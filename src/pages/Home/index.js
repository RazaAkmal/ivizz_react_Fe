import React, { Component } from 'react';
import apiService from "../../services/api";
import { Button, notification } from 'antd'
import MenuCard from "../../common/components/MenuCard";
import { withRouter } from 'react-router-dom'

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
    
    apiService.checkAuthentication().then(res => {
      if(!res){
        this.props.history.push("/login")
      }
    })
    
    let { token, subdomain, site, loading } = this.state;
    token = localStorage.getItem('token')
    subdomain = localStorage.getItem('subdomain')
    site = JSON.parse(localStorage.getItem('site'))

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
      this.setState({ siteIvModules: response, loading: false })
    }catch(err) {
      console.log('-----err: ', err)
      this.openNotification('topRight', 'error', 'Something went wrong. Please try again');
    }
  }
   
  render() {
    let { subdomain, site, siteIvModules } = this.state;
    return(
      <React.Fragment>
        <Button style={{ float: 'right', marginTop: '-5%', marginRight:'7%' }}>
          Logout</Button>
        {subdomain === "kara" ? <Button style={{ float: 'right', marginTop: '-5%', marginRight:'14%' }}>Go to Publish Page</Button> : null }
        <div className="flexbox">
          {siteIvModules.map(item => {
            const name = item.iv_module.name
            const backgroundImage = `assets/logo.png`
            return <MenuCard key={item.id} title={name} link={'/data'} backgroundImage={backgroundImage} />
          })}
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(Home);
