import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './index.css'

// Some folks find value in a centralized route config.
// A route config is just data. React is great at mapping
// data into components, and <Route> is a component.

////////////////////////////////////////////////////////////
// first our route components
const Login = () => <h2>login</h2>;

const Tacos = ({ routes }) => (
    <div >
        <h2>Tacos</h2>
        <ul className="slider">
            {slideMenu(routes)}
        </ul>
        <div className="content">
            {renderRoutes(routes)}
        </div>
    </div>
);

const slideMenu = (routes) => Array.isArray(routes) && routes.map(item => (
        <li key={item.path}>
            {/*<Link to={item.path}>{item.name}</Link>*/}
            <OldSchoolMenuLink to={item.path} label={item.name} exact={item.exact}></OldSchoolMenuLink>
            {Array.isArray(item.routes) && item.routes.length > 0 && (
                <ul>
                    {slideMenu(item.routes)}
                </ul>
            )}
        </li>
    )
);


const renderRoutes = (routes) => {return (routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />))};

const Bus = ({routes}) => {
    return (
        <div>
            <h3>Bus constructor
            </h3>
            {renderRoutes(routes)}
        </div>
    )
};
const Bus2 = () => <h3>Bus2</h3>;
const Bus3= () => <h3>Bus3</h3>;
const Cart = () => <h3>Cart</h3>;

////////////////////////////////////////////////////////////
// then our route config
const routes = [
    {
        path: "/login",
        name: 'Login',
        component: Login
    },
    {
        path: "/tacos",
        name: 'Tacos',
        component: Tacos,
        routes: [
            {
                path: "/tacos/bus",
                name: "/tacos/bus",
                component: Bus,
                routes: [
                    {
                        path: "/tacos/bus/bus2",
                        name: "/tacos/bus/bus2",
                        component: Bus2
                    },
                    {
                        path: "/tacos/bus/bus3",
                        name: "/tacos/bus/bus3",
                        component: Bus3
                    }
                ]
            },
            {
                path: "/tacos/cart",
                name: "/tacos/Cart",
                component: Cart
            }
        ]
    }
];

const OldSchoolMenuLink = ({ label, to, exact }) => (
    <Route
        path={to}
        exact={exact}
        children={({ match }) => {
            return (
                <React.Fragment >
                    {match ? "> " : ""}
                    <Link to={to} className={match ? "active" : ""}>{label}</Link>
                </React.Fragment>
            )
        }}
    />
);


// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
const RouteWithSubRoutes = route => (
    <Route
        path={route.path}
        render={props =>{
            console.log(props)
            console.log(route)
            return (
                // pass the sub-routes down to keep nesting
                <route.component {...props} routes={route.routes} />
            )
        }}
    />
);

const RouteConfigExample = () => (
    <Router>
        <div>
            <ul>
                <li>
                    <Link to="/tacos">Tacos</Link>
                </li>
                <li>
                    <Link to="/login">login</Link>
                </li>
            </ul>
            {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
        </div>
    </Router>
);

export default RouteConfigExample;