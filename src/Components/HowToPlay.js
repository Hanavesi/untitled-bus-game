import React from 'react'
import wasdnew from './images/wasdnew.png'


function HowToPlay() {

    

    return (
        <div className="nimet">
            <h1>How to Play?</h1>
           
            <p>Use 
                <img src={wasdnew} 
                style={{width: '100px',
                        height: '50px',
                        borderRadius: '5px',
                        marginBottom: '-18px',
                        marginLeft: '5px',
                        marginRight: '5px'}} /> 
            to move</p>
            <p>Use mouse to shoot</p>
            <p>Enemies have diffirent capabilities</p>
        </div>
    )
}

export default HowToPlay
