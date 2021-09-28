import React from 'react'



export const MAP_TEST = [
    [2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
    [2, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 1, 1, 7],
    [2, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 1, 1, 7],
    [6, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
    [6, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
    [6, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
    [2, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 7],
    [2, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 7],
    [2, 3, 5, 3, 3, 3, 3, 3, 3, 3, 5, 3, 3, 3, 3, 3, 3, 3, 5, 2] 
];

function TileMap(type) {


    const getTile = (num) => {
        switch (num) {
            case 1:
                return "images/floor.png";
            case 2:
                return "images/wall.png";
            case 3:
                return "images/window.png";
            case 4:
                return "images/bench.png";
            case 5: 
                return "images/door.png";
            case 6:
                return "images/back_window.png"
            case 7:
                return "images/rear_window.png"
            

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
