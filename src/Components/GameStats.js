

export default function GameStats({ style }) {
  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '10vw',
        margin: 'auto',
        zIndex: 2,
        backgroundColor: 'white',
        ...style
      }}>
      <p style={{ flex: 3, textAlign: 'center' }}>Score</p>
      <p style={{ flex: 1 }} id='score'>0</p>
    </div>
  );
}