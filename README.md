# The Autumn Website

The website is using [Metalsmith][metalsmith] as the static website generator.

[metalsmith]: https://github.com/metalsmith/metalsmith

## Build

To build the website run in the root directory.

```shell
> npm install
> npm run build
```

Metalsmith copies the generated files into the `build` directory at the root.

## Deploy

You can deploy the website to autumnai.com via the following call

```
> npm run deploy
```

## License

The Autumn Website is released under [No License](./LICENSE). More info about
the License can be found on
[choosealicense.com](http://choosealicense.com/licenses/).
