import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import MyProductList from './ProductList.jsx';
import ProductView from './ProductView.jsx';
import ProductEdit from './NewProduct.jsx';

import { Navbar, Nav, NavItem, Grid } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NotFound = () => <h1>Page Not Found</h1>;

function Contents() {
  return (
    <Switch>
      <Redirect exact from="/" to="/products" />
      <Route path="/products" component={MyProductList} />
      <Route path="/view/:id" component={ProductView} />
      <Route path="/edit/:id" component={ProductEdit} />
      <Route component={NotFound} />
    </Switch>
  );
}

function NavBar() {
  const head = 'Company Inventory';
  return (
    <Navbar fluid>
      <Navbar.Header>
        <Navbar.Brand>{head}</Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <LinkContainer exact to="/products">
          <NavItem>Products</NavItem>
        </LinkContainer>
      </Nav>
    </Navbar>
  );
}

export default function Main() {
  return (
    <div>
      <NavBar />
      <Grid fluid>
        <Contents />
      </Grid>
    </div>
  );
}