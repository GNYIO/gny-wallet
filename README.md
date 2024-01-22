# gny-wallet

## Install Dependencies

```bash
npm ci
```

## Development

### Fuel your account

> Your account
> address: `GtnevSTQqPUcZNAMFJmc8DLUXHFz`
> secret `sheriff resemble card okay middle fossil stumble light slice toddler alert leg`

```bash
gny-cli sendmoney --secret "grow pencil ten junk bomb right describe trade rich valid tuna service" --amount 200000000000 --recipient "GtnevSTQqPUcZNAMFJmc8DLUXHFz"
```

### Debug in Firefox or Chrome

Install one of the following:
- [Debugger for Firefox](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug)
- [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)


- 1. Set Breakpoints in your code
- 2. Run `npm run serve` in your console
  - 2.1. this starts a local webserver on `http://127.0.0.1:8080`
- 3. Start the green button in VS Code to launch the configuration `launch firefox` (from `launch.json`)
  - 3.1 This opens the `firefox` browser and let you debug the app in VS Code


### Point to local GNY Blockchain

Create a `.env.development` file with:

```bash
echo $'VUE_APP_GNY_ENDPOINT=127.0.0.1\nVUE_APP_GNY_PORT=4096\nVUE_APP_GNY_NETWORK=localnet\nVUE_APP_HTTPS=false' > .env.development
```

Which will create the following `.env.development` file:

```env
VUE_APP_GNY_ENDPOINT=127.0.0.1
VUE_APP_GNY_PORT=4096
VUE_APP_GNY_NETWORK=localnet
VUE_APP_HTTPS=false

VUE_APP_BSC_SWAPGATE_ADDRESS=
VUE_APP_BSC_ERC20_ADDRESS=

```

### Serve files

Will serve files on [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
```bash
npm run serve
```

## Production

### Point to production GNY Blockchain

Create a `.env.production` file with:

```bash
echo $'VUE_APP_GNY_ENDPOINT=testnet.gny.io\nVUE_APP_GNY_PORT=80\nVUE_APP_GNY_NETWORK=localnet\nVUE_APP_HTTPS=true' > .env.production
```

Which will create the following `.env.production` file:

```env
VUE_APP_GNY_ENDPOINT=testnet.gny.io
VUE_APP_GNY_PORT=80
VUE_APP_GNY_NETWORK=localnet
VUE_APP_HTTPS=true
```


### Build for production

```bash
npm run build
```
