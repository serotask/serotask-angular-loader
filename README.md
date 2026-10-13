# serotask-angular-loader

A lightweight, accessible Angular loader library with **20 animations**, an HTTP interceptor, manual control, and global configuration.

**[Live Demo](https://serotask.github.io/serotask-angular-loader/)** · **[Library documentation](projects/angular-loader/README.md)**

The workspace includes the library source and a demo app so you can try the loader locally or in your browser.

## Project structure

```text
projects/
  angular-loader/   Angular loader library (source, tests, README, CHANGELOG)
  demo/             Demo app to try the loader features
.github/workflows/
  ci.yml            CI (tests and builds)
  deploy-demo.yml   Deploys the demo to GitHub Pages
```

## Requirements

- Node.js **20.19+** or **22.12+**
- npm

## Try the live demo

Open the **[SeroTask Angular Loader demo](https://serotask.github.io/serotask-angular-loader/)** to explore the loader in your browser without installing anything.

If the link is not available yet, check the repository's **Actions** tab for the `Deploy Angular Demo to GitHub Pages` workflow. After its first successful run, go to **Settings → Pages** and make sure the build and deployment source is set to **GitHub Actions**.

## Run the demo locally

Clone the repository and install its dependencies:

```bash
git clone https://github.com/SeroTask/serotask-angular-loader.git
cd serotask-angular-loader
npm install
npm start
```

Open **http://localhost:4200** in your browser.

The demo imports the library directly from source, so you don't need to build the library before starting the demo.

## Development commands

Run these commands from the repository root:

```bash
npm test            # Run library unit tests (Vitest)
npm run build:lib   # Build the library into dist/angular-loader
npm run build:demo  # Build the demo app for production
npm run pack:check  # Check package contents (run build:lib first)
```

## Use the library in another Angular app

Build and pack the library:

```bash
npm run build:lib
cd dist/angular-loader
npm pack
```

This creates a `.tgz` package file. In your other Angular project, install it using the path to that file:

```bash
npm install /path/to/serotask-angular-loader-1.0.0.tgz
```

For installation and usage instructions, see the [Angular loader library README](projects/angular-loader/README.md).

## License

MIT. See [LICENSE](LICENSE).

## Author

[Satendra Rajput](https://satendra2rajput.com/)
