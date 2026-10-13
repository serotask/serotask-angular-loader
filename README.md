# serotask-angular-loader

Workspace for **[@serotask/angular-loader](projects/angular-loader/README.md)**, a lightweight, accessible Angular loader
(20 animations, HTTP interceptor, manual control, global config).

```
projects/
  angular-loader/   the npm library (source, tests, README, CHANGELOG)
  demo/             demo app to try every feature
.github/workflows/  CI (test + build) and tag-based npm release
```

## Quick start

Requires Node 20.19+ / 22.12+ and npm.

```bash
npm install
npm start          # demo app on http://localhost:4200
npm test           # library unit tests (Vitest)
npm run build:lib  # builds the library into dist/angular-loader
npm run build:demo # production build of the demo app
npm run pack:check # shows what would be published (after build:lib)
```

The demo imports the library straight from source (see `paths` in `tsconfig.json`),
so `npm start` works without building the library first.

## Try the built package in another app

```bash
npm run build:lib
cd dist/angular-loader && npm pack      # creates serotask-angular-loader-1.0.0.tgz
# in your other Angular project:
npm install /path/to/serotask-angular-loader-1.0.0.tgz
```

## Publish to npm

1. Own the `@serotask` npm scope (create an npm organization named `serotask`).
2. Update `version` in `projects/angular-loader/package.json` and add an entry to `projects/angular-loader/CHANGELOG.md`.
3. Publish:
   ```bash
   npm login
   npm run publish:lib
   ```
   or push a tag (`git tag v1.0.0 && git push --tags`) and let `.github/workflows/release.yml` publish
   (needs the repository secret `NPM_TOKEN`).

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

After the first `npm install`, commit `package-lock.json` too.

## License

MIT. Based on `@kudoengineer/loader` by Satendra Rajput (MIT). See [LICENSE](LICENSE).
