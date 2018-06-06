# freepikScrapping

<div align = "center">
    <br>
    <img src="../../others/img/logo/logo.png" height=260>
    <br>
    <br>

[![Say Thanks!](https://img.shields.io/badge/Say%20Thanks-!-1EAEDB.svg?longCache=true&style=for-the-badge)](https://saythanks.io/to/Fazendaaa)

[![English README](https://img.shields.io/badge/Language-EN-blue.svg?longCache=true&style=for-the-badge)](../../README.md)
[![Portuguese README](https://img.shields.io/badge/Linguagem-PT-green.svg?longCache=true&style=for-the-badge)](./README_PT.md)

[![npm](https://img.shields.io/npm/v/freepikScrapping.svg?style=flat-square)](https://www.npmjs.com/package/freepikScrapping)
[![Build Status](https://travis-ci.org/Fazendaaa/freepikScrapping.svg?branch=master)](https://travis-ci.org/Fazendaaa/freepikScrapping)
[![Coverage Status](https://coveralls.io/repos/github/Fazendaaa/freepikScrapping/badge.svg?branch=master)](https://coveralls.io/github/Fazendaaa/freepikScrapping?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/c6069aecd89bb086265c/maintainability)](https://codeclimate.com/github/Fazendaaa/freepikScrapping/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/fazendaaa/freepikScrapping/badge.svg?targetFile=package.json)](https://snyk.io/test/github/fazendaaa/freepikScrapping?targetFile=package.json)

</div>

## About
Uma ferramenta de buscas no site do [freepik](https://br.freepik.com/).

# Como utilizar

* searchFreepik ( { __term__: _string_ | _Array<_string_>_; __page__?: _number_; }): Retorna uma Promise ou dá throws de um error

Examplo:

``` typescript
import { searchFreepik } from 'freepikScrapping';

searchFreepik({ term: 'bola' }).then(console.log);
searchFreepik({ term: 'bola', page: 2 }).then(console.log);

const searched: string = await searchFreepik({ term: 'bola', page: 2 });
```

## Testes
Há uma integração com [Travis CI](http://travis-ci.org/) que foram escritos com ajuda do [Jest](https://facebook.github.io/jest/).

## Code
[Typescript](http://typescriptlang.org/) com o padrão de linter da [Microsoft](https://github.com/Microsoft/tslint-microsoft-contrib).

# Contribuindo
Converse comigo através de uma issue.

# Versionamento
Utilizado a versão do npm. Veja o topo deste readme para mais informações sobre.

# Autores
* Apenas [eu](https://github.com/Fazendaaa) até agora.

Considere me comprar um café:

[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/Fazenda)

Ou até mesmo se tornar um padrinho:

[![Patreon](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/Fazenda/overview)

# Licença
Assim como muitos projetos de código livre, a licença MIT é utilizada aqui. Mais sobre em [LICENSE](https://github.com/Fazendaaa/freepikScrapping/blob/master/LICENSE).