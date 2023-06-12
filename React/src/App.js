import { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import 'reset-css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { userIsAuthenticated, userIsNotAuthenticated } from '~/hoc/authentication.js';
import { publicRoutes, authenticatedRoutes } from '~/routes/routes';

class App extends Component {
    render() {
        return (
            <div>
                <Switch>
                    {authenticatedRoutes.map((route, index) => {
                        let Authenticated = route.Authenticated ? userIsAuthenticated : userIsNotAuthenticated;
                        return <Route key={index} path={route.path} component={route.component} />;
                    })}

                    {publicRoutes.map((route, index) => {
                        return <Route key={index} path={route.path} component={route.component} />;
                    })}
                </Switch>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
