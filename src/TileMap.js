import React from 'react'
import seat from './images/seat.png';
import floor from './images/floor.png';
import wall from './images/wall.png';
import window from './images/window2.png';



function TileMap(type) {

    const MAP_TEST = [
        [2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 3, 2, 3, 2, 2, 2, 2, 3, 3, 3], //Y = 0
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 2, 4, 3], //Y = 1
        [2, 1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 4, 1, 3, 3, 3], //Y = 2
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], //Y = 3
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 2], //Y = 4
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], //Y = 5
        [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3] //Y = 6
    ]

    const getTile = (num) => {
        switch (num) {
            case 1:
                return "images/floor.png";
            case 2:
                return "images/wall.png";
            case 3:
                return "images/window2.png";
            case 4:
                return "images/seat.png";
            default:
                return "images/floor.png";
        }
    }


    return (
        <div>
            {MAP_TEST.map(row => {
                return (
                    <div>
                        {row.map(box => {
                            return <img src={getTile(box)} />
                        })}
                    </div>
                )
            })}
        </div>
    );

}

export default TileMap;
