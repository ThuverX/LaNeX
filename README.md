# LaNeX
LaNeX is an experimental language and editor written in Typescript. It currently renders to HTML and React with Math rendering through KaTeX (with `react-katex`).
LaNeX is currently in a very early stage of development and is not ready for professional use.

*Disclaimer: While LaNeX syntax looks like LaTeX, they may not be directly compatible.*

### Installation
```bash
git clone git@github.com:ThuverX/LaNeX.git
cd LaNeX
npm install
```

### Usage
```bash
npm run build # Compiles the Typescript code into JavaScript.
npm run watch # Watches the Typescript code for changes and automatically recompiles it when changes are detected.
npm run ui-build # Runs the build script and then builds the UI.
npm run ui-dev # Runs the build script and then starts a vite development server for the UI.
```