# frontend-react

This template should help get you started developing with React in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
yarn install --frozen-lockfile
```

### Compile and Hot-Reload for Development

```sh
yarn start
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
yarn test
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```

> This project is configured with Airbnb Lint Style.

### You can also try it with Docker

```sh
docker build -t ghcr.io/bcgov/quickstart-openshift/frontend-react:snapshot .
```

Then:

```sh
docker run -t -i -p 3000:3000 \
  -e VITE_KC_URL=https://dev.loginproxy.gov.bc.ca/auth \
  -e VITE_KC_REALM=standard \
  -e VITE_KC_CLIENT_ID=seed-planning-test-4296 \
  ghcr.io/bcgov/quickstart-openshift/frontend-react:snapshot
```
