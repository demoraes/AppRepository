import React, { Component } from 'react';

import {
  Container,
  Name,
} from './styles';


export default class Repository extends Component {

  async componentDidMount() {
    const { route } = this.props;
    const { repository } = route.params;
    
    console.tron.log(repository);
  }

  render() {
    return (
      <Container>
        <Name>EITA</Name>
      </Container >
    )
  }
}
