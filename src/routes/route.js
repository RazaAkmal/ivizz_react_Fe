import React from "react";
import { Route, Redirect } from "react-router-dom";
import IvizzHeader from "../common/components/Header";
import IvizzFooter from "../common/components/Footer";
import "../pages/globalStyles.css";
import { Layout } from 'antd';
const { Header, Footer, Content } = Layout;

const AppRoute = ({
	component: Component,
	isAuthProtected,
	...rest
}) => (
		<Route
			{...rest}
			render={props => {

				if (isAuthProtected && !localStorage.getItem("token")) {
					return (
						<Redirect to={{ pathname: "/login", state: { from: props.location } }} />
					);
				}

				return (
					<React.Fragment>
            {/* <Header />
						  <div style={{ minHeight: "400px" }}> <Component {...props} /></div>
            <Footer /> */}
            <Layout>
              <Header className="layout-header"><IvizzHeader /></Header>
              <Content className="layout-content">
                <Component {...props} />
              </Content>
              <Footer className="layout-footer"><IvizzFooter /></Footer>
            </Layout>
					</React.Fragment>
				);
			}}
		/>
	);

export default AppRoute;
