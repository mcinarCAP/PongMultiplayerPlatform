# PongMultiplayerPlatform
## Teknisk Introduktion
Step-wise introduktion til at få vedhæftet projekt op og køre: 
1.	Installer NodeJS https://nodejs.org/en/
2.	Klon repo: https://github.com/mcinarCAP/PongMultiplayerPlatform.git
3.	Åben command prompt og hop til projektmappen.
4. Kør "npm install" for at installere reference-pakkerne.
5.	Pong Serveren startes med ”node pongServer.js”
6.	Gamebotten som kører i nodeJS startes med ”node gamebotNode.js” (i en ny command prompt, gør det to gange)
7.	Åben  en browser på http://localhost:2000/ og click ”start game” 

Nedenfor ses et sekvensdiagram som forklarer, hvordan man connector, modtager data og sender commands.
![alt text](./sekv_pong.jpg "Sekvensdiagram")

### Data eksempel på Update(Ball, Paddles[]) i JSON
```
{
  "ball": {
    "position": {
      "x": 718.2724546648917,
      "y": 566.8778924099804
    },
    "diameter": 25
  },
  "paddles": {
    "C8eh0oIOF3AsWzyjAAAA": {
      "position": {
        "x": 25,
        "y": 510
      },
      "velocity": {
        "x": 0,
        "y": 10
      },
      "speed": 10,
      "width": 25,
      "height": 100,
      "color": "white",
      "name": "Capgemini-Node",
      "side": "left"
    },
    "CMnyTXtkyzLbhQHOAAAD": {
      "position": {
        "x": 750,
        "y": 510
      },
      "velocity": {
        "x": 0,
        "y": 10
      },
      "speed": 10,
      "width": 25,
      "height": 100,
      "color": "blue",
      "name": "Capgemini-Node2",
      "side": "right"
    }
  }
}
```