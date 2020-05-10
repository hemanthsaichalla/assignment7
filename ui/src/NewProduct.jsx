import React from 'react';
import graphQLFetch from './graphQLFetch.js';
import NumInput from './NumInput.jsx';
import TextInput from './TextInput.jsx';
import { FormGroup, FormControl, ControlLabel, Form} from 'react-bootstrap';
import { Button, Col} from 'react-bootstrap';


export default class ProductEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      product: {},
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.retrieveData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.retrieveData();
    }
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    window.console.log(this.props)
    const id = parseInt(this.props.match.params.id, 10)
    this.setState(prevState => ({
      product: { ...prevState.product, [name]: value, 'id': id },
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { product } = this.state;
    const query = `mutation productUpdate(
      $id: Int!
      $modify: ProductUpdateInputs!
    ) {
      productUpdate(
        id: $id
        modify: $modify
      ) {
        id Name Price Category Image
      }
    }`;

    const { id, ...modify } = product;
    const data = await graphQLFetch(query, { modify, id });
    if (data) {
      this.setState({ product: data.productUpdate });
      alert('Updated product successfully'); // eslint-disable-line no-alert
    }
  }

  async retrieveData() {
    const query = `query Product($id: Int!) {
      Product(id: $id) {
        id Name Price Category Image
      }
    }`;
    const id = parseInt(this.props.match.params.id, 10)
    const data = await graphQLFetch(query, { id });
    this.setState({ product: data.Product });
  }

  render() {
    const { product: { Name, Price, Image } } = this.state;
    const { product: { id } } = this.state;
    const { product: { Category } } = this.state;
    return (
      <Form horizontal onSubmit={this.handleSubmit}>
        <ControlLabel>{`Editing product ID: ${id}`}</ControlLabel>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Category</Col>
          <Col sm={9}>
            <FormControl
              componentClass="select"
              name="Category"
              value={Category}
              onChange={this.onChange}
            >
              <option value="Shirts">Shirts</option>
              <option value="Jeans">Jeans</option>
              <option value="Jackets">Jackets</option>
              <option value="Sweaters">Sweaters</option>
              <option value="Accessories">Accessories</option>
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Name</Col>
          <Col sm={9}>
            <FormControl
              componentClass={TextInput}
              size={100}
              name="Name"
              value={Name}
              onChange={this.onChange}
              key={id}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Price Per Unit($)</Col>
          <Col sm={9}>
            <FormControl
              componentClass={NumInput}
              size={100}
              name="Price"
              value={Price}
              onChange={this.onChange}
              key={id}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Image</Col>
          <Col sm={9}>
            <FormControl
              componentClass={TextInput}
              size={100}
              name="Image"
              value={Image}
              onChange={this.onChange}
              key={id}
            />
          </Col>
        </FormGroup>
        
        <Button bsStyle="primary" type="submit">Submit</Button>
      </Form>
    );
  }
}
