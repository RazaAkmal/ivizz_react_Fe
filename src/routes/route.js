import React from "react";
import { Route, Redirect } from "react-router-dom";
import Header from "../common/components/Header";
import Footer from "../common/components/Footer";

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
            <Header />
						<div style={{ minHeight: "400px" }}> <Component {...props} /></div>
            {/* <Footer /> */}
					</React.Fragment>
				);
			}}
		/>
	);

export default AppRoute;

