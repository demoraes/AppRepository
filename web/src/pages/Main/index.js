import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error: null,
  };

  // Carregar os dados do localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      /**
       * Converte o json para uma estrutura em objeto do javascript
       */
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // Salvar os dados do localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    /**
     * Verifica se o estado anterior está diferente do estado atual
     */
    if (prevState.repositories !== repositories) {
      /**
       * stringify, porque o localstorage só aceita strings
       */
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  /**
   * Pegando o valor que está sendo digitado no input
   * e setando no estado
   */
  handleInputChange = (e) => {
    this.setState({ newRepo: e.target.value, error: null });
  };

  /**
   * Fazendo o submit dos valores
   */
  handleSubmit = async (e) => {
    e.preventDefault();
    /**
     * Seta loading como true para que apareça o icone FaSpinner
     */
    this.setState({ loading: true, error: false });

    try {
      /**
       * Pegando valores do estado
       */
      const { newRepo, repositories } = this.state;

      /**
       * Verificando se o estado newRepo possui algum valor,
       * caso não tenha retorna o alert
       */
      // eslint-disable-next-line no-alert
      if (newRepo === '') throw alert('Você precisa indicar um repositório');

      /**
       * Procura se existe um repositorio igual ao que está sendo digitado
       * caso ache algum retorna que o repositório duplicado
       */
      const hasRepo = repositories.find((r) => r.name === newRepo);

      // eslint-disable-next-line no-alert
      if (hasRepo) throw alert('Repositório duplicado');

      /**
       * Busca pelo repositório
       */
      const response = await api.get(`/repos/${newRepo}`);

      /**
       * atribui o valor de full_name que é retornado da API
       * na variavel data.name
       */
      const data = {
        name: response.data.full_name,
      };

      /**
       * 1) Seta no estado todos os repositorios antigos,
       * mais o novo que acabou de ser adicionado.
       * 2) Atribui valor vazio em newRepo, para que o input fique vazio
       * 3) Seta valor false em loading para que volte ao icone FaPlus
       */
      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
      });
    } catch (error) {
      /**
       * Quando error é true adiciona a borda vermelha no input
       */
      this.setState({ error: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { newRepo, repositories, loading, error } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />
          {/**
           * Passa propriedade loading para o component
           * Se for true mostra FaSpinner
           * Se for false mostra FaPlus
           */}
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {/**
           * Percorre os repositorios
           */}
          {repositories.map((repository) => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              {/**
               * encodeURIComponent é usado para converter a barra que vem
               * depois do nome do repositório em um caracterer especial
               */}
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
