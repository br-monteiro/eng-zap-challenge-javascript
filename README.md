## Mnemosine

<p align="center">
  <img src="https://logopond.com/logos/8a551fef96ccb8a2219477b9a9de1e1d.png">
</p>

![unit-test-ga](https://github.com/br-monteiro/mnemosine-rest-api/actions/workflows/tests.node.js.yml/badge.svg)

#### Dependências
 - Docker v19.03
 - Docker-compose v1.27
 - Node.js v10.22

#### Opção B: Fazer uma API (backend)
Foi proposto o desenvolvimento de uma **API Backend**, onde dada a origem do portal em uma request o seu response será a listagem dos imóveis.

#### Solução
Sabendo que uma das exigências do desafio era a não utilização de um SGBD, então, comecei a pensar em qual estrutura de dados seria melhor para me ajudar com o desafio.
Prevendo que um dos requisitos de uma API desse tipo é ser rápida e confiável, optei por usar um **HashMap** para o armazenamento dos registros (em memória), onde cada APIKey (`htr`, `edinho`, … `n`) tem seu próprio mapa de registros.
A estrutura do storage para registros se parece com o seguinte:

```javascrip
{
  <apikey>: {
     <data-id>: <data>
  }
}
```

Onde:
```javascript
{
   htr: {
      abc: { id: abc, …},
      def: { id: def, …},
      …
  },
  edinho: {
      xyz: { id: xyz, …},
      mno: { id: mno, …},
      …
  },
  ...
}
```

Desta forma, o acesso a um determinado registro fica de forma direta. Ainda assim, apenas acessar a coleção de registros de uma determinada APIKey não seria o suficiente, pois em alguns casos, precisamos usar filtros para melhorar o resultado da API.

Pensando nisto, também foi implementado uma estrutura onde é possível recuperar os registros de uma determinada APIKey com o uso de filtros. A estrutura de dados usada para filtros se parece com o seguinte:

```javacript
{
   <apikey>: {
      <filter-name>: {
        <filter-value>: <set-of-data-ids>
      }
   }
}
```
Onde:
```javascript
{
   htr: {
     city: {
       ‘são paulo’: [abc, def, … n],
       florianópolis: [xyz, nmo, … n],
       ...
     },
     ...
   },
   ...
}
```

É importante dizer que o storage de filtro guarda apenas o ID dos registros associados aquele filtro. Abaixo é possível ver a lista de filtros disponíveis:
 - city
 - usableAreas
 - parkingSpaces
 - bathrooms
 - bedrooms
 - monthlyCondoFee
 - price
 - rentalTotalPrice
 - businessType
 - neighborhood

A implementação se apoiou na Teoria dos Conjuntos, de onde foi tirado o conceito de intersecção, que é aplicado na relação entre os filtros quando solicitados em uma request:

*Filtro A*: `{1, 2, 3, 4, 5}`<br>
*Filtro B*: `{4, 5, 6, 7, 8, 9}`<br>
*A ∩ B* : `{4, 5}`<br>

<p align="center">
  <img src="https://codedestine.com/wp-content/uploads/2017/12/PythonSetOpIntersection.png">
</p>

#### Processamento do source
Para processar o arquivo de source, foi criada uma rota especial para que seja informado à API qual arquivo dever ser processado. Este processamento basicamente ocorre da seguinte forma:
 1. API recebe a URL de source através da rota especificada
 2. API abre um stream do arquivo e inicia o processamento linha a linha, onde cada linha corresponde a um registro
 3. Pensando na manutenibilidade da API e na mudança das regras de negócio, foi implementado o *design pattern* **Chain of Responsibility**, onde cada handler é responsável por executar uma operação específica
 4. Registros são salvos na memória de acordo com a estrutura de dados do storage

**Foram implementados os seguintes handlers:**
 - **ValidateSchema**: valida se o registro recebido corresponde com o esquema esperado
 - **ValidateLatLon**: valida se o registro está com as informações de Lat e Long zeradas
 - **SetDataEdinho**: após as validações, insere no storage os registros de acordo com as regras para APIKey edinho
 - **SetDataHtr**: após as validações, insere no storage os registros de acordo com as regras para APIKey htr
 - **SetFilter**: usado para inserir os filtros associados aos registros. É usado para ambas as APIKeys

> quando for necessário implementar uma nova regra ou adicionar um nova **APIKey**, basta implementar um novo handler especialista para esta **APIKey** e adicioná-lo ao fluxo de processamento.

#### Rotas da API
API é composta por apenas duas rotas, são elas:

###### GET /api/v1/:apikey
> Usada para consultar os registros de uma determinada APIKey

Esta rota retorna os resultados com `status code 200` em caso de sucesso. Em caso de nenhum registro associado à APIKey ou à combinação de filtros, retorna `status code 404`

###### POST /api/v1/load
> Usada para carregar as informações de registros na memória.

Esta rota recebe no corpo da requisição um objeto JSON informando qual a URL do arquivo de source.
Retorna o `status code 200` e a informação do horário e data em que a fila de processamento foi iniciada.

#### Usando Local
Para usar a API localmente, basta entrar no diretório raiz da aplicação e executar:

```bash
$ docker-compose up
```

Este comando subirá um container docker com a API rodando em **localhost:3000**. Após a execução, será necessário carregar os registros para a memória.
Para fazer isto, basta mandar uma requisição do tipo POST para a rota **/api/v1/load** informando no corpo da requisição o endereço do arquivo source. Exemplo:

```
POST /api/v1/load
{
   "sourceUrl": "http://grupozap-code-challenge.s3-website-us-east-1.amazonaws.com/sources/source-2"
}
```

Após alguns segundos, será exibida uma mensagem de **log** no terminal onde a aplicação está sendo executada, informando que os registros foram carregados na memória.

Após o carregamento, os registros já podem ser consultados na rota:

`GET /api/v1/:apikey`

Onde `:apikey` se refere a identificação da APIKey (`htr` ou `edinho`)

#### Filtros e Paginação
Após o carregamento dos registros, é possível acessá-los na rota `GET /api/v1/:apikey`, onde também é possível usar filtros para melhorar o resultado da consulta.
Basicamente, a sintaxe de uma parâmetro de filtro na URL se parece com o seguinte:

```
filter[<filter-name>]=<filter-value>
```

Onde:

```
filter[city]=belém
```
Exemplo:

`/api/v1/htr?filter[city]=São Paulo`

`/api/v1/htr?filter[city]=São Paulo&filter[businessType]=sale`

`/api/v1/htr?filter[city]=São Paulo&filter[businessType]=sale&filter[neighborhood]=Santana`

`/api/v1/htr?filter[city]=São Paulo&filter[businessType]=sale&filter[bedrooms]=3`

Além dos filtros, também é possível navegar na paginação dos resultados, para isto, basta passar os parâmetros `page` informando a página e/ou `perPage` informando a quantidade de registros por página (por padrão é 50):

```
page=<number>
```
```
perPage=<number>
```
Exemplo:

`/api/v1/htr?page=3`

`/api/v1/htr?page=3&perPage=77`

`/api/v1/htr?filter[city]=São Paulo&page=3`

`/api/v1/htr?filter[city]=São Paulo&page=3&perPage=77`

#### Usando o Heroku
Para melhorar a experiência de testes, foi realizado o deploy da aplicação no Heroku (em uma conta free). O endereço da aplicação é:

https://mnemosine-rest-api.herokuapp.com/api/v1/edinho

https://mnemosine-rest-api.herokuapp.com/api/v1/htr

#### Cache da Aplicação
Para evitar o processamento desnecessário sobre os registros, foi implementado uma `LRU`, onde cada requisição retornada com sucesso é salva no cache, sendo assim, a próxima requisição usando os mesmos filtros e APIKey será retornada do cache e não do processamento de fato. A capacidade padrão da `LRU` é de **100 registros**, ou seja, após esse limite, ocorre a reciclagem de posições menos recentemente usadas. Este valor pode ser alterado no arquivo `.env`.

#### Deploy

O deploy da aplicação pode ser realizado de forma bem simples, pois neste caso não se está usando um SGBD, ou seja, basicamente após realizar o clone do repositório no servidor, temos que instalar as dependências e startar a aplicação. Abaixo é exibido a sequência de comandos necessários para o deploy:

```bash
$ git clone git@github.com:br-monteiro/mnemosine-rest-api.git
$ cd mnemosine-rest-api
$ npm install
$ npm install -g pm2
$ pm2 start
```

#### Evolução da API
Mesmo se tratando de uma API de teste e sabendo que não será usada em produção, é importante deixar mapeado alguns pontos de melhoria:

 - Implementar persistência usando SGBD
 - Implementar feature de ordenação dos resultados de acordo com algum atributo do registro
 - Implementar política de invalidação de cache
 - Implementar rota de atualização de um único registro
 - Implementar rota de remoção de um único registro
 - Implementar rota de inserção de um único registro (pode ser usado o mesmo fluxo atual)
 - Implementar um hook informando sobre o processamento do source

#### Testes
Para rodar os testes unitários, basta executar um dos comandos abaixo:
 - Caso tenha o Node.js instalado na máquina, basta rodar:

```bash
$ npm test
```

 - Caso querida rodar os testes diretamente do container docker:

```bash
$ docker run --rm --name mnemosine-rest-api_app -v "$PWD":/opt/app mnemosine-rest-api_app:latest npm test
```
#### conclusão
Se você chegou até aqui, parabéns! =)

![party](https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif)

### LAUS DEO ∴
