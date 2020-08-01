# vuex-make-request-store
Utilitário vuex de gerenciamento do estado de requests HTTP baseado em Promises

### Como utilizar

Em sua store, crie um novo arquivo, importe o service que realiza sua request e passe como parâmetro para a função makeRequestStore como um objeto. Veja o exemplo a seguir:

```javascript
import makeRequestStore from '<path>/makeRequestStore';

import {
	meuService,
} from '<path>/meuService';

const modules = [
	{ meuService },
];

export default {
	namespaced: true,

	modules: modules.reduce((acc, module) => ({
		...acc,
		...makeRequestStore(module),
	}), {}),
};
```

Então quando precisar utilizar esse service em um componente, por exemplo, é só chamar a mutation criada. Observe:

```javascript
// <template></template>
// <script>
import { mapState, mapActions } from 'vuex';

export default {
	computed: {
		...mapState('requests', {
			loadingMeuService: ({ meuService }) => meuService.isFetching,
			failedMeuService: ({ meuService }) => meuService.hasFailed,
			succeededMeuService: ({ meuService }) => meuService.hasSucceeded,
		}),
	},

	methods: {
		...mapActions('requests', [
			'meuService',
		]),
	},
};
// </script>
```

Ao chamar `this.meuService()` a promise do seu service é retornada e você pode encadear o `.then()` e o `.catch()` de acordo com sua lógica.

Observe que é possível mapear o estado da requisição para utilizá-los caso seja necessário.
