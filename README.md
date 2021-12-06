<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<h3 align="center">untitled-bus-game</h3>

  <p align="center">
    Sort of dungeon game made with javascript that depends on mqtt data.
    <br />
    <a href="http://hanavesi.com">View Demo</a>
    ·
    <a href="https://github.com/Hanavesi/untitled-bus-game/issues">Report Bug</a>
    ·
    <a href="https://github.com/Hanavesi/untitled-bus-game/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <!-- <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li> -->
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

# Untitled Bus Game
This is the repository for the frontend solution of a group project that is a part of the course **Ohjelmistoprojekti II - SWD4TN024-3008** in Haaga-Helia University of Applied Sciences.

## Group members
- Juuso Kalliomäki
- Jose Junninen
- Jesse Karsimus
- Joni Sandberg
- Niko Lindgren

## Game concept
The player plays as the character Pepe and is living in a post-apocalytpic world where monsters are everywhere. There are only a few places that are safe from these monsters and the transport system between them, which the player traverses.

The game's course is based on [HSL](https://www.hsl.fi/) bus data gathered from [Digitransit](https://digitransit.fi/) with mqtt and possibly other to be decided methods. The player is put into a bus and while the bus is travelling, he must fight off monsters. When the bus stops, the player gets to rest and gather/buy power-ups.

![Product Menu Screen Shot](/src/Assets/images/stage.png)

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [React.js](https://reactjs.org/)
* [Three.js](https://threejs.org/)
* [MQTT](https://www.npmjs.com/package/mqtt)
* [Digitransit](https://digitransit.fi/en/developers/apis/4-realtime-api/vehicle-positions/)
* [Howler](https://howlerjs.com/)
* [ECSY](https://ecsy.io/)
* [Leaflet](https://leafletjs.com/)
* [Blender](https://www.blender.org/)


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

<!-- This is an example of how you may give instructions on setting up your project locally. -->
To get a local copy up and running follow these simple example steps.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Hanavesi/untitled-bus-game.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the project
   ```sh
   npm start
   ```
4. Menu appears

![menu](/src/Assets/images/menu.png)

5. See instructions

![instructions](/src/Assets/images/instructions.png)

6. Start the game via `Game`

7. Choose  your bus

![bus map](/src/Assets/images/busmap.png)

8. Click `Protect this bus!` and game begins, have fun :)

![stage](/src/Assets/images/stage.png)



<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Here is some basic information about the building blocks of this project

### Mqtt

The **MQTT** protocol is used to get data from buses through [Digitransit's realtime API](https://digitransit.fi/en/developers/apis/4-realtime-api/). To make use of this data, we use the [mqtt npm package](https://www.npmjs.com/package/mqtt) to either get all bus updates on a specific Helsinki region and set them visible on a [Leaflet](https://leafletjs.com/) map, or get the updates of a single drive forward our gameplay loop.

### ECS

Most of the game logic is built around the [ecsy](https://ecsy.io/) Entity Component System -library. Relevant game data is stored in components that are tied to entities. Then there are systems that update entities based on what components they possess.

### [Three.js](https://threejs.org/)

Three.js is used to draw everything on the screen except the map. It allows easy loading of 3D files and images as well as rendering basic meshes and sprites.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] React page
  - basic React template with just a Game-component that contains the canvas that will be drawn to
  - new components will be added as necessary with new backlog items
- [x] Bus route and location data fetching
  - routes with **graphql** requests
  - location with **mqtt** subscription data
  - end stop locations and time to destination
- [x] User input management
  - read user keyboard input
  - log the events
- [x] Draw graphics on the page
  - using **three.js** library
- [x] Game canvas
  - Tilegenerator
- [x] Bus map to show buses in certain area
  - Leaflet map
- [x] Adding Entity-Component-System
  - components, systems, initializer etc.
- [x] Collisions
  - [x] Bullets-to-any
  - [x] Player-to-Enemy
  - [x] Enemy-to-Enemy
- [x] Health & Damage system
  - Health bar and damage loss
- [ ] Bus messages determines the stages
  - [x] Bus at stop
    - Show shop
  - [x] Bus on the move
    - Show stage
  - [ ] Bus arrives to final destination
    - Show game won screen
- [ ] Stages
  - [x] Randomize tiles
    - [ ] Randomize shape
  - [x] Enemy spawn system
- [x] Score system
  - [x] Get scores by beating levels and/or defeating enemies
- [ ] Shop
  - [x] Tiles created
  - Safe haven between stages
  - [x] Items to buy/get
      Health
    - Guns
    - More items
- [x] Game over
- [x] Game win
- [ ] Different kind of enemies
- [ ] Different kind of weapons
- [ ] Different kind of items

See the [open issues](https://github.com/Hanavesi/untitled-bus-game/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See [LICENSE](LICENSE.txt) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT 
## Contact

- Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [https://github.com/Hanavesi/untitled-bus-game](https://github.com/Hanavesi/untitled-bus-game)

<p align="right">(<a href="#top">back to top</a>)</p>
-->


<!-- ACKNOWLEDGMENTS 
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#top">back to top</a>)</p>
-->


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Hanavesi/untitled-bus-game.svg?style=for-the-badge
[contributors-url]: https://github.com/Hanavesi/untitled-bus-game/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Hanavesi/untitled-bus-game.svg?style=for-the-badge
[forks-url]: https://github.com/Hanavesi/untitled-bus-game/network/members
[stars-shield]: https://img.shields.io/github/stars/Hanavesi/untitled-bus-game.svg?style=for-the-badge
[stars-url]: https://github.com/Hanavesi/untitled-bus-game/stargazers
[issues-shield]: https://img.shields.io/github/issues/Hanavesi/untitled-bus-game.svg?style=for-the-badge
[issues-url]: https://github.com/Hanavesi/untitled-bus-game/issues
[license-shield]: https://img.shields.io/github/license/Hanavesi/untitled-bus-game.svg?style=for-the-badge
[license-url]: https://github.com/Hanavesi/untitled-bus-game/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555

