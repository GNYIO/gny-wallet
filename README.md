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



### Develop locally with mainnet access (fix CORS issue)

Normally if we specify `mainnet.gny.io` as source in our `.env` file we would get CORS issues. Because our locally run `vue.js` app is being served by a http server from `http://127.0.0.1:8080/`. But we also try to access `https://mainnet.gny.io`. This are two domains and the browser does not allow this.


But with a neat trick we can bypass this problem by using a `vuejs proxy`

All request to `http://mainnet.gny.io/` are being proxied through `http://127.0.0.1:8080/` (the endpoint where also the development vuejs files are being served from.

Edit `.env`:
```bash
VUE_APP_GNY_ENDPOINT=127.0.0.1
VUE_APP_GNY_PORT=8080
VUE_APP_GNY_NETWORK=mainnet
VUE_APP_HTTPS=false
```

Now add to the `vue.config.js` file a `devServer` key that proxies (almost) all request from `http://127.0.0.1:8080/` to `https://mainnet.gny.io/`.

Edit `vue.config.js`:
```javascript
module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
    proxy: {
        '/': {
            target: 'https://mainnet.gny.io/', // mainnet.gny.io
            changeOrigin: true,
            pathRewrite: {
                '^/': ''
            }
        },
    }
  }
};

```

This works because it seems like the requests that the `vue.js` app is making, like requesting the files `/index.html`, `/app.js` and `/chunk-vendors.js` are not forwarded to the proxy. But are immediately returned from the development server on `http://127.0.0.1:8080/`

The `@gny/client` library only requests `https://mainnet.gny.io/api/*`. It seems that these requests don't clash with the files `vue.js` is serving.

All requests that `@gny/client` was making before. Something like `https://mainnet.gny.io/api/blocks/getHeight` are now being done as `/api/blocks/getHeight` (`http://127.0.0.1:8080` can be ommitted because it is using)

Example:
- Before: `https://mainnet.gny.io/api/blocks/getHeight`
- Now: `http://127.0.0.1:8080/api/blocks/getHeight` -> `https://mainnet.gny.io/api/blocks/getHeight`

