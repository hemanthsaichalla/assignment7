import React from 'react';
import { Link } from 'react-router-dom';
import graphQLFetch from './graphQLFetch.js';
import { Button, Glyphicon, Panel, Row, Col , Table} from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel, Form } from 'react-bootstrap';

function ProductRow({ product, deleteProduct }) {
  const price = `$${product.Price}`;
  const productID = `${product.id}`;
  return (
    <tr>
      <td>{product.Name}</td>
      <td>{price}</td>
      <td>{product.Category}</td>
      <td>
        <Link to={`/view/${product.id}`}>View</Link>
        { ' | ' }
        <Link to={`/edit/${product.id}`}>Edit</Link>
        { ' | ' }
        <Button bsSize="small" onClick={() => { deleteProduct(productID); }}>
          <Glyphicon glyph="remove" />
        </Button>
      </td>
    </tr>
  );
}

function ProductTable({ products, deleteProduct }) {
  const productRows = products.map(product => (
    <ProductRow
      key={product.id}
      product={product}
      deleteProduct={deleteProduct}
    />
  ));
  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {productRows}
      </tbody>
    </Table>
  );
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const pricedollar = form.priceper.value;
    const price = pricedollar.replace('$', '');
    const product = {
      Name: form.name.value,
      Category: form.category.value,
      Price: price,
      Image: form.image_url.value,
    };
    const { createProduct } = this.props;
    createProduct(product);
    form.reset();
  }

  render() {
    return (
      <Form name="productAdd" onSubmit={this.handleSubmit}>
        <Row>
          <Col xs={6} md={4} lg={4}>
            <FormGroup>
              <ControlLabel>Category</ControlLabel>
              <FormControl
                componentClass="select"
                name="category"
                defaultValue="Shirts"
              >
                <option value="Shirts">Shirts</option>
                <option value="Jeans">Jeans</option>
                <option value="Jackets">Jackets</option>
                <option value="Sweaters">Sweaters</option>
                <option value="Accessories">Accessories</option>
              </FormControl>
            </FormGroup>
          </Col>
          <Col xs={6} md={4} lg={4}>
            <FormGroup>
              <ControlLabel>Price Per Unit</ControlLabel>
              <FormControl type="text" name="priceper" defaultValue="$"/>
            </FormGroup>
          </Col>
          <Col xs={6} md={4} lg={4}>
            <FormGroup>
              <ControlLabel>Product Name</ControlLabel>
              <FormControl type="text" name="name"/>
            </FormGroup>
          </Col>
          <Col xs={6} md={4} lg={4}>
            <FormGroup>
              <ControlLabel>Image URL</ControlLabel>
              <FormControl type="text" name="image_url"/>
            </FormGroup>
          </Col>
        </Row>
        <Button bsStyle="primary" type="submit">Add</Button>
      </Form>
    );
  }
}

export default class MyProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] , number:0};
    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.getProductNumber = this.getProductNumber.bind(this);
  }

  componentDidMount() {
    this.retrieveData();
  }

  async retrieveData() {
    const query = `query {
      productList {
        id Name Price Category Image        
      }
    }`;
    const data = await graphQLFetch(query);
    this.setState({ products: data.productList });
    this.getProductNumber();
  }

  async createProduct(product) {
    const query = `mutation productAdd($product: ProductInputs!) {
      productAdd(product: $product) {
        id
      }
    }`;
    const data = await graphQLFetch(query, { product });
    if (data) {
      this.retrieveData();
    }
  }

  async deleteProduct(productId) {
    const query = `mutation productRemove($productId: Int!) {
      productRemove(id: $productId)
    }`;

    const data = await graphQLFetch(query, { productId });
    if (!data.productRemove) {
      alert('Delete product failed'); // eslint-disable-line no-alert
      return false;
    }
    alert('Delete product successfully'); // eslint-disable-line no-alert
    this.retrieveData();
    return true;
  }

  async getProductNumber() {
    const query = `query {
      productCounts 
    }`;
    const number = await graphQLFetch(query);
    this.setState({ number: number.productCounts });
  }

  render() {
    const addhead = 'Add a new product to inventory';
    const { products , number} = this.state;
    return (
      <React.Fragment>
        <div>Showing {number} available products</div>
        <hr />
        <ProductTable products={products} deleteProduct={this.deleteProduct} />
        <br />
        <Panel>
          <Panel.Heading>
            <Panel.Title toggle>{ addhead }</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <ProductAdd createProduct={this.createProduct} />
          </Panel.Body>
        </Panel>
      </React.Fragment>
    );
  }
}
