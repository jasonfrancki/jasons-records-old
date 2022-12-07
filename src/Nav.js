const Nav = ({ shuffled, setShuffled, shuffle }) => {
  return (
    <nav>
      <ul className='links'>
        <li>
          <a href='#A'>A-F</a>
        </li>
        <li>
          <a href='#G'>G-L</a>
        </li>
        <li>
          <a href='#M'>M-S</a>
        </li>
        <li>
          <a href='#T'>T-Z</a>
        </li>
        <li>
          <a
            onClick={() => {
              shuffled ? setShuffled() : shuffle()
            }}
            className='random-btn'
          >
            {shuffled ? 'Close' : 'Random'}
          </a>
        </li>
      </ul>
    </nav>
  )
}
export default Nav
