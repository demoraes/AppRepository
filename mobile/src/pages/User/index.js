import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Button
} from './styles';

export default class User extends Component {

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
    refreshing: false,
  };

  async componentDidMount() {
    /**
     * 1) Monta a tela com os itens que estão no state
     * 2) Passa page como parametro pra que a função load tenha o numero da pagina
     */
    const { page } = this.state;
    this.load(page);
  }



  load = async (page) => {
    const { stars } = this.state;
    // função de rotas
    const { route } = this.props;
    // pegando o valor de user pelo parametro da rota
    const { user } = route.params;



    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page }
    });


    /**
     * Verifica o numero de page é >= 2
     */
    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      page,
      loading: false,
      refreshing: false,
    });
  }

  /**
   * Função que é carregada quando atinge 20% do scroll
   */
  loadMore = () => {
    const { page } = this.state;

    const nextPage = page + 1;

    this.load(nextPage);
  };

  refreshList = () => {
    this.setState({ refreshing: true, stars: [] }, this.load);
  };

  handleNavigate = (repository) => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  }


  render() {
    const { route } = this.props;
    const { stars, loading } = this.state;

    const { user } = route.params;

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <ActivityIndicator color="#7159c9" size={50} />
        ) : (
            <Stars
              data={stars} // pega os dados do state
              onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
              refreshing={this.state.refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando Restante das props
              onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
              onEndReached={this.loadMore} // Função que carrega mais itens
              keyExtractor={star => String(star.id)}
              renderItem={({ item }) => (
                <Button onPress={() => this.handleNavigate(item)}>
                  <Starred>
                    <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                    <Info>
                      <Title>{item.name}</Title>
                      <Author>{item.owner.login}</Author>
                    </Info>
                  </Starred>
                </Button>
              )}
            />
          )}
      </Container>
    );
  }
}
