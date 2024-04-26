<p align="center">
  <img src="https://raw.githubusercontent.com/remarkablegames/lights-out/master/public/screenshots/screenshot3.png" alt="Lights Out" width="360">
</p>

# Lights Out

![release](https://img.shields.io/github/v/release/remarkablegames/lights-out)
[![build](https://github.com/remarkablegames/lights-out/actions/workflows/build.yml/badge.svg)](https://github.com/remarkablegames/lights-out/actions/workflows/build.yml)

💡 Lights Out is a 2D arcade game.

This game was made for [Gamedev.js Jam 2024](https://itch.io/jam/gamedevjs-2024), in which the theme was `power`.

Play the game on:

- [remarkablegames](https://remarkablegames.org/lights-out)
- [itch.io](https://remarkablegames.itch.io/lights-out)

## Ideation

- [Excalidraw](https://excalidraw.com/#json=ATrraBVgqlk5WyFF-Ns1F,ii5EYJOkroWOEIlHMIdsFw)

## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm#readme)

## Install

Clone the repository:

```sh
git clone https://github.com/remarkablegames/lights-out.git
cd lights-out
```

Install the dependencies:

```sh
npm install
```

## Environment Variables

Set the environment variables:

```sh
less .env
```

Update the **Secrets** in the repository **Settings**.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the game in the development mode.

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.

You will also see any errors in the console.

### `npm run build`

Builds the game for production to the `dist` folder.

It correctly bundles in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your game is ready to be deployed!

### `npm run bundle`

Builds the game and packages it into a Zip file in the `dist` folder.

Your game can be uploaded to your server, [Itch.io](https://itch.io/), [Newgrounds](https://www.newgrounds.com/), etc.

## License

[MIT](LICENSE)
