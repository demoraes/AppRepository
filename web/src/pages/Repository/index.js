import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList, IssueFilter, PageActions } from './styles';

export default class Repository extends Component {
  /**
   * Validação de propriedades
   */
  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    /**
     * Shape: define propriedade como sendo um objeto
     */
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  // eslint-disable-next-line react/state-in-constructor
  state = {
    repository: {},
    issues: [],
    loading: true,
    filters: [
      { state: 'all', label: 'Todas', active: 'true' },
      { state: 'open', label: 'Abertas', active: 'false' },
      { state: 'closed', label: 'Fechadas', active: 'false' },
    ],
    filterIndex: 0,
    page: 1,
  };

  async componentDidMount() {
    /**
     * Propriedade match possui os params dentro dele
     */
    const { match } = this.props;
    const { filters } = this.state;
    /**
     * decodeURIComponent, utilizado para converter o
     * caracterer especial do nome do repositório em / novamente
     */
    const repoName = decodeURIComponent(match.params.repository);

    /**
     * Promise.all é utilizado para que as duas
     * chamadas get sejam feitas ao mesmo tempo
     * 1) No primeiro indice(repository) do array vai ser
     * colocado o resultado da primeira chamada
     * 2) No segundo indice(issues) do array vai ser
     * colocado o resuldato da segunda chamada
     */
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`repos/${repoName}/issues`, {
        /**
         * Parametros repassados para que retorne somente
         * as issues que estão em aberto e no maximo 5 issues
         */
        params: {
          /**
           * pega o filter que está active que é "all"
           */
          state: filters.find((f) => f.active).state,
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  loadIssues = async () => {
    const { match } = this.props;
    const { filters, filterIndex, page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const response = await api.get(`/repos/${repoName}/issues`, {
      params: {
        /**
         * Pega o indice atual
         */
        state: filters[filterIndex].state,
        per_page: 5,
        page,
      },
    });

    this.setState({ issues: response.data });
  };

  handleFilterClick = async (filterIndex) => {
    /**
     * Seta o indice atual e recarrega as issues com base no index
     */
    await this.setState({ filterIndex });
    this.loadIssues();
  };

  handlePage = async (action) => {
    const { page } = this.state;
    await this.setState({
      page: action === 'back' ? page - 1 : page + 1,
    });
    this.loadIssues();
  };

  render() {
    const {
      repository,
      issues,
      loading,
      filters,
      filterIndex,
      page,
    } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          <IssueFilter active={filterIndex}>
            {filters.map((filter, index) => (
              <button
                type="button"
                key={filter.label}
                onClick={() => this.handleFilterClick(index)}
              >
                {filter.label}
              </button>
            ))}
          </IssueFilter>
          {issues.map((issue) => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map((label) => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <PageActions>
          <button
            type="button"
            disabled={page < 2}
            onClick={() => this.handlePage('back')}
          >
            Anterior
          </button>
          <span>Página {page}</span>
          <button type="button" onClick={() => this.handlePage('next')}>
            Próximo
          </button>
        </PageActions>
      </Container>
    );
  }
}
