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

Create a `.env` (`.env.development` for development):

For `mainnet` use the following configuration:

```env
VUE_APP_GNY_ENDPOINT=mainnet.gny.io
VUE_APP_GNY_NETWORK=mainnet
VUE_APP_GNY_PORT=80
VUE_APP_HTTPS=true

VUE_APP_ETH_ERC20_ADDRESS=0xb1f871ae9462f1b2c6826e88a7827e76f86751d4
VUE_APP_ETH_SWAPGATE_ADDRESS=0x1b28aac6dba93eaf53e0d86cd1295154f187ec54
VUE_APP_MAINNET_TO_ETH_SWAPGATE_FEE=500
VUE_APP_SWAP_MAINNET_TO_ETH=G32Qvr7ckjXbnk1bkvwRA8JbawJgA

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
