import React, { useState } from 'react'
import Sound from 'react-sound';
import Running from '../music/run.mp3';


const PlaySound = () => {
     const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div>
        <button onClick={() => setIsPlaying(!isPlaying)}>{!isPlaying ? 'Play music' : 'Stop music'} </button>
        <Sound
        url={Running}
        playStatus={
            isPlaying ? Sound.status.PLAYING : Sound.status.STOPPED
        }
        playFromPosition={300}
        loop={true}
        volume = {20}
        />
        </div>
    );
};

export default PlaySound;
