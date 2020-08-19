import React, { Component } from 'react';

import { Browser } from './styles';


export default class Repository extends Component {
  
  render() {
    const { route } = this.props;
    const { repository } = route.params;

    console.tron.log(repository,'repository');

    return <Browser source={{ uri: repository.html_url }} />;
  }
}


