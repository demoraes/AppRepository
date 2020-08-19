import React, { Component } from 'react';

import { WebView } from 'react-native-webview';


export default class Repository extends Component {

  render() {
    const { route } = this.props;
    const { repository } = route.params;

    console.tron.log(repository, 'repository');

    return (
      <WebView
        source={{ uri: repository.html_url }}
        style={{ flex: 1 }}
      />
    );
  }
}


