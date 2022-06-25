"use strict";
// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador de filmes, mas desistiu 
// pois considerou o seu código inviável. Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// A ideia dessa atividade é criar um aplicativo que: 
//    - Busca filmes
//    - Apresenta uma lista com os resultados pesquisados
//    - Permite a criação de listas de filmes e a posterior adição de filmes nela
// Todas as requisições necessárias para as atividades acima já estão prontas, mas a implementação delas ficou pela metade (não vou dar tudo de graça).
// Atenção para o listener do botão login-button que devolve o sessionID do usuário
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma API key https://developers.themoviedb.org/3/getting-started/introduction
var apiKey = '3f301be7381a03ad8d352314dcc3ec1d';
let apiKey;
let requestToken;
let username;
let password;
let sessionId;
let listId = '7101979';
let loginButton = document.getElementById('login-button');
let searchButton = document.getElementById('search-button');
let searchContainer = document.getElementById('search-container');
loginButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    yield criarRequestToken();
    yield logar();
    yield criarSessao();
}));
searchButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    let lista = document.getElementById("lista");
    if (lista) {
        lista.outerHTML = "";
    }
    let query = document.getElementById('search').value;
    let listaDeFilmes = yield procurarFilme(query);
    let ul = document.createElement('ul');
    ul.id = "lista";
    for (const item of listaDeFilmes.results) {
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(item.original_title));
        ul.appendChild(li);
    }
    console.log(listaDeFilmes);
    searchContainer.appendChild(ul);
}));
function preencherSenha() {
    password = document.getElementById('senha').value;
    validateLoginButton();
}
function preencherLogin() {
    username = document.getElementById('login').value;
    validateLoginButton();
}
function preencherApi() {
    apiKey = document.getElementById('api-key').value;
    validateLoginButton();
}
function validateLoginButton() {
    if (password && username && apiKey) {
        loginButton.disabled = false;
    }
    else {
        loginButton.disabled = true;
    }
}
class HttpClient {
    static get({ url, method, body = null }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest();
                request.open(method, url, true);
                request.onload = () => {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(JSON.parse(request.responseText));
                    }
                    else {
                        reject({
                            status: request.status,
                            statusText: request.statusText
                        });
                    }
                };
                request.onerror = () => {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                };
                if (body) {
                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    body = JSON.stringify(body);
                }
                request.send(body);
            });
        });
    }
}
function procurarFilme(query) {
    return __awaiter(this, void 0, void 0, function* () {
        query = encodeURI(query);
        console.log(query);
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
            method: "GET"
        });
        return result;
    });
}
function adicionarFilme(filmeId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
            method: "GET"
        });
        console.log(result);
    });
}
function criarRequestToken() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
            method: "GET"
        });
        requestToken = result.request_token;
    });
}
function logar() {
    return __awaiter(this, void 0, void 0, function* () {
        yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
            method: "POST",
            body: {
                username: `${username}`,
                password: `${password}`,
                request_token: `${requestToken}`
            }
        });
    });
}
function criarSessao() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
            method: "GET"
        });
        sessionId = result.session_id;
    });
}
function criarLista(nomeDaLista, descricao) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                name: nomeDaLista,
                description: descricao,
                language: "pt-br"
            }
        });
        console.log(result);
    });
}
function adicionarFilmeNaLista(filmeId, listaId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                media_id: filmeId
            }
        });
        console.log(result);
    });
}
function pegarLista() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
            method: "GET"
        });
        console.log(result);
    });
}
{ /* <div style="display: flex;">
  <div style="display: flex; width: 300px; height: 100px; justify-content: space-between; flex-direction: column;">
      <input id="login" placeholder="Login" onchange="preencherLogin(event)">
      <input id="senha" placeholder="Senha" type="password" onchange="preencherSenha(event)">
      <input id="api-key" placeholder="Api Key" onchange="preencherApi()">
      <button id="login-button" disabled>Login</button>
  </div>
  <div id="search-container" style="margin-left: 20px">
      <input id="search" placeholder="Escreva...">
      <button id="search-button">Pesquisar Filme</button>
  </div>
</div>*/
}


let apiKey;
let requestToken;
let username;
let password;
let sessionId;
let userId;
let listasCriadas = new Map();
let selectedListId;
let loginButton = document.getElementById('login-button');
let searchButton = document.getElementById('search-button');
let createNewListButton = document.getElementById('create-list-button');
let listSelector = document.getElementById('list-selector');
let listFilmTable = document.querySelector('#list-container table');
let searchFilmTable = document.querySelector('#search-container table');
listSelector.addEventListener('change', function () {
    return __awaiter(this, void 0, void 0, function* () {
        let listName = this.value;
        selectedListId = listasCriadas.get(listName);
        yield updateSelectedFilmInformation();
    });
});
loginButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    yield criarRequestToken();
    yield logar();
    yield criarSessao();
    yield pegarInformacoesDaConta();
    yield preencherListasCriadas();
    updateListSelector();
}));
searchButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    let query = document.getElementById('search-text').value;
    let searchResponse = yield procurarFilme(query, 1);
    yield updateFilmSearchResults(searchResponse);
    let pagesNavigationWrapper = document.querySelector("#search-container .list-page-navigation");
    updatePagesNavigationContainer(pagesNavigationWrapper, searchResponse.total_pages, (page) => __awaiter(this, void 0, void 0, function* () {
        let searchResponse = yield procurarFilme(query, page);
        yield updateFilmSearchResults(searchResponse);
    }));
}));
createNewListButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    let newListName = document.getElementById('new-list-name').value;
    let newListDescription = document.getElementById('new-list-description').value;
    yield criarLista(newListName, newListDescription);
    yield preencherListasCriadas();
    updateListSelector();
}));
function preencherSenha() {
    password = document.getElementById('senha').value;
    validateLoginButton();
}
function preencherLogin() {
    username = document.getElementById('username').value;
    validateLoginButton();
}
function preencherApi() {
    apiKey = document.getElementById('api-key').value;
    validateLoginButton();
}
function validateLoginButton() {
    if (password && username && apiKey) {
        loginButton.disabled = false;
    }
    else {
        loginButton.disabled = true;
    }
}
function preencherListasCriadas() {
    return __awaiter(this, void 0, void 0, function* () {
        let createdLists = yield pegarListasCriadas();
        listasCriadas.clear();
        createdLists.results.forEach((item) => {
            listasCriadas.set(item.name, item.id);
        });
    });
}
function updateSelectedFilmInformation() {
    return __awaiter(this, void 0, void 0, function* () {
        let informationOfSelectedList = yield pegarLista(selectedListId);
        // Atualiza a tabela de filmes da lista
        let filmList = informationOfSelectedList.items;
        updateFilmTable(listFilmTable, filmList, "-", (filmInfo) => __awaiter(this, void 0, void 0, function* () {
            yield removerFilmeDaLista(filmInfo.id, selectedListId);
            updateSelectedFilmInformation();
        }));
        //Atualiza a descrição da lista
        let selectecListDescription = document.getElementById('selected-list-description');
        selectecListDescription.innerHTML = informationOfSelectedList.description;
    });
}
function updateFilmSearchResults(searchResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        let filmList = searchResponse.results;
        updateFilmTable(searchFilmTable, filmList, "+", (filmInfo) => __awaiter(this, void 0, void 0, function* () {
            yield adicionarFilmeNaLista(filmInfo.id, selectedListId);
            yield updateSelectedFilmInformation();
        }));
    });
}
function updateListSelector() {
    listSelector.innerHTML = '';
    for (const listName of listasCriadas.keys()) {
        let selectorOption = document.createElement('option');
        selectorOption.value = listName;
        selectorOption.innerHTML = listName;
        listSelector.appendChild(selectorOption);
    }
    listSelector.dispatchEvent(new Event('change'));
}
function updateFilmTable(listView, listOfFilms, buttonLabel, buttonCallback) {
    listView.innerHTML = '';
    for (const filmInfo of listOfFilms) {
        let row = document.createElement('tr');
        let cellLabel = document.createElement('td');
        let cellButton = document.createElement('td');
        let button = document.createElement('button');
        cellLabel.innerHTML = filmInfo.original_title;
        cellButton.appendChild(button);
        button.addEventListener('click', () => {
            buttonCallback(filmInfo);
        });
        button.innerHTML = buttonLabel;
        row.appendChild(cellLabel);
        row.appendChild(cellButton);
        listView.appendChild(row);
    }
}
function updatePagesNavigationContainer(container, numberOfPages, buttonCallback) {
    container.innerHTML = "";
    let pageIncreaseButton = document.createElement('button');
    let pageDecreaseButton = document.createElement('button');
    let pageNumber = document.createElement('span');
    pageIncreaseButton.innerHTML = ">";
    pageDecreaseButton.innerHTML = "<";
    pageNumber.innerHTML = `1/${numberOfPages}`;
    container.appendChild(pageDecreaseButton);
    container.appendChild(pageNumber);
    container.appendChild(pageIncreaseButton);
    var actualPage = 1;
    pageIncreaseButton.addEventListener('click', () => {
        if (actualPage < numberOfPages) {
            actualPage++;
            pageNumber.innerHTML = `${actualPage}/${numberOfPages}`;
            buttonCallback(actualPage);
        }
    });
    pageDecreaseButton.addEventListener('click', () => {
        if (actualPage > 1) {
            actualPage--;
            pageNumber.innerHTML = `${actualPage}/${numberOfPages}`;
            buttonCallback(actualPage);
        }
    });
}
class HttpClient {
    static get({ url, method, body = null }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest();
                request.open(method, url, true);
                request.onload = () => {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(JSON.parse(request.responseText));
                    }
                    else {
                        reject({
                            status: request.status,
                            statusText: request.statusText
                        });
                    }
                };
                request.onerror = () => {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                };
                if (body) {
                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    body = JSON.stringify(body);
                }
                request.send(body);
            });
        });
    }
}
function procurarFilme(query, page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        query = encodeURI(query);
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`,
            method: "GET"
        });
        console.log("Film Search: ", result);
        return result;
    });
}
function pegarInformacoesFilme(filmeId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
            method: "GET"
        });
        console.log("Film information: ", result);
        return result;
    });
}
function criarRequestToken() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
            method: "GET"
        });
        console.log("Token: ", result);
        requestToken = result.request_token;
    });
}
function logar() {
    return __awaiter(this, void 0, void 0, function* () {
        yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
            method: "POST",
            body: {
                username: `${username}`,
                password: `${password}`,
                request_token: `${requestToken}`
            }
        });
    });
}
function criarSessao() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
            method: "GET"
        });
        console.log("Create session: ", result);
        sessionId = result.session_id;
    });
}
function criarLista(nomeDaLista, descricao) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                name: nomeDaLista,
                description: descricao,
                language: "pt-br"
            }
        });
        console.log("Create list: ", result);
    });
}
function adicionarFilmeNaLista(filmeId, listaId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                media_id: filmeId
            }
        });
        console.log("Add film to list: ", result);
    });
}
function removerFilmeDaLista(filmeId, listaId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listaId}/remove_item?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                media_id: filmeId
            }
        });
        console.log("Remove film from list:", result);
    });
}
function pegarLista(listId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
            method: "GET"
        });
        console.log("Take list: ", result);
        return result;
    });
}
function pegarInformacoesDaConta() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${sessionId}`,
            method: "GET"
        });
        console.log("Account information: ", result);
        userId = result.id;
    });
}
function pegarListasCriadas() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/account/${userId}/lists?api_key=${apiKey}&session_id=${sessionId}`,
            method: "GET"
        });
        console.log("Created lists: ", result);
        return result;
    });
}
