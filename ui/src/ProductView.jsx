import React from 'react';
import graphQLFetch from './graphQLFetch.js';

export default class ProductView extends React.Component {
  constructor() {
    super();
    this.state = { product: [] };
  }

  componentDidMount() {
    this.retrieveData();
  }

  async retrieveData() {
    const query = `query Product($id: Int!) {
      Product(id: $id) {
        id Name Price Category Image
      }
    }`;
    const { match: { params: { id } } } = this.props;
    const data = await graphQLFetch(query, { id });
    this.setState({ product: data.Product });
  }

  render() {
    const { product } = this.state;
    return (
      <img src={product.Image} alt={product.Name} />
    );
  }
}
