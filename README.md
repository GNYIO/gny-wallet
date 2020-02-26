# gny-wallet

## Install Dependencies

```bash
npm ci
```

## Development

### Debug in Firefox or Chrome

Install one of the following:
- [Debugger for Firefox](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug)
- [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)


- 1. Set Breakpoints in your code
- 2. Run `npm run serve` in your console
  - 2.1. this starts a local webserver on `http://localhost:8080`
- 3. Start the green button in VS Code to launch the configuration `launch firefox` (from `launch.json`)
  - 3.1 This opens the `firefox` browser and let you debug the app in VS Code


### Point to local GNY Blockchain

Create a `.env.development` file with:

```bash
echo $'GNY_ENDPOINT=localhost\nGNY_PORT=4096\nGNY_NETWORK=localnet' > .env.development
```

Which will create the following `.env.development` file:

```env
GNY_ENDPOINT=localhost
GNY_PORT=4096
GNY_NETWORK=localnet
```

### Serve files

Will serve files on [http://localhost:8080/](http://localhost:8080/)
```bash
npm run serve
```

## Production

### Point to production GNY Blockchain

Create a `.env.production` file with:

```bash
echo $'GNY_ENDPOINT=45.76.215.117\nGNY_PORT=4096\nGNY_NETWORK=mainnet' > .env.production
```

Which will create the following `.env.production` file:

```env
GNY_ENDPOINT=45.76.215.117
GNY_PORT=4096
GNY_NETWORK=mainnet
```


### Build for production

```bash
npm run build
```
