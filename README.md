# vuex-make-request-store
Utilitário vuex de gerenciamento do estado de requests HTTP baseado em Promises

### Instalação

Clone o repositório, vá ao diretório do projeto e em seguida execute `npm run install` em seu terminal.

### Executando testes

Após o passo de [Instalação](/#instalacao), em seu terminal, execute `npm run test`

### Como utilizar

Assumimos que você possui um conhecimento prévio em aplicações [Vue](https://vuejs.org/) e em [Vuex](https://vuex.vuejs.org/).

Assumimos também que suas chamadas HTTP são realizadas através de alguma biblioteca que utiliza promises, como o [Axios](https://github.com/axios/axios) por exemplo.

Imagine que tenhamos um arquivo de um recurso Posts que expõe _services_ que fazem chamadas à API de Posts:

`services/Posts.js`
```javascript
import axios from 'axios';

export const getPosts = (params) => axios.get('/posts', { ...params });
```

O primeiro passo é criar um módulo que gerencie essa store desses recursos:

`store/requests/posts`
```javascript
import makeRequestStore from 'vuex-make-request-store';

import {
	getPosts,
} from '<path>/services/Posts';

const modules = [
	{ getPosts },
];

export default {
	namespaced: true,

	modules: modules.reduce((acc, module) => ({
		...acc,
		...makeRequestStore(module),
	}), {}),
};
```

Desse modo, caso hajam outros endpoints da API de posts, basta apenas adicioná-los ao `services/Posts.js`, então importá-los no `store/requests/posts.js` e inserí-los no array de módulos.

Feito isso, vamos unificar as stores dos recursos:

`store/requests`
```javascript
import posts from './posts';

export default {
	namespaced: true,

	modules: {
		posts,
	},
};
```

Assim, se houverem outras stores de outros recursos, por exemplo `comments`, é só importá-la e colocá-la nos módulos.

Por fim, na store de sua aplicação, importe a store de requests:

`store.js`
```javascript
import Vue from 'vue';
import Vuex from 'vuex';

import requests from './requests';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		requests,
	},
});
```

Então quando precisar utilizar esse service em um componente, por exemplo, é só chamar a mutation criada automaticamente pelo `makeRequestStore`. Observe:

```javascript
// <template></template>
// <script>
import { mapState, mapActions } from 'vuex';

export default {
	computed: {
		...mapState('requests/posts', {
			loadingGetPosts: ({ getPosts }) => getPosts.isFetching,
			failedGetPosts: ({ getPosts }) => getPosts.hasFailed,
			succeededGetPosts: ({ getPosts }) => getPosts.hasSucceeded,
		}),
	},

	methods: {
		...mapActions('requests/posts', [
			'getPosts',
		]),
	},
};
// </script>
```

Ao chamar `this.getPosts()` a promise do seu service é retornada e você pode encadear o `.then()` e o `.catch()` de acordo com sua lógica.

Observe que é possível mapear os estados da requisição para utilizá-los caso seja necessário.
