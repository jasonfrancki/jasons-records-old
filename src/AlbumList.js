import React, { useState, useEffect } from 'react'
import imageUrlBuilder from '@sanity/image-url'
import Nav from './Nav'
import './style.css'

const builder = imageUrlBuilder({
  projectId: '8v3qbg1x',
  dataset: 'production',
  apiVersion: '2021-03-25',
})

function urlFor(source) {
  return builder.image(source)
}

const url =
  'https://8v3qbg1x.api.sanity.io/v2021-06-07/data/query/production?query=*[_type%20==%20%22album%22]'

const AlbumList = () => {
  const [albums, setAlbums] = useState([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    getAlbums()
  }, [])

  useEffect(
    () => {
      const searchResults = albums.filter(
        (album) =>
          album.artist.toLowerCase().includes(query.toLowerCase()) ||
          album.albumTitle.toLowerCase().includes(query.toLowerCase())
      )
      setResults(searchResults)
    },
    // }
    [query]
  )

  const getAlbums = async () => {
    const response = await fetch(url)
    const albums = await response.json()
    setAlbums(albums.result)
    setResults(albums.result)
  }

  // Shuffle
  const [shuffled, setShuffled] = useState()
  const shuffle = () => {
    setShuffled(albums[Math.floor(Math.random() * albums.length)])
  }

  if (albums.length === 0) {
    return (
      <div className='loading '>
        <div className='lds-dual-ring'></div>
      </div>
    )
  }

  return (
    <>
      <Nav shuffle={shuffle} shuffled={shuffled} setShuffled={setShuffled} />

      <h1 id='A' className='count'>
        {results.length} Albums
      </h1>

      {/* SHUFFLED */}
      {shuffled ? (
        <div className='shuffled'>
          <h3>Your random album:</h3>
          <li
            className='album'
            id={shuffled.artist[0]}
            key={shuffled._id}
            onClick={(e) => {
              if (shuffled.altImg) {
                if (
                  urlFor(shuffled.cover.asset._ref).width(700).url() ==
                  e.currentTarget.children[0].src
                ) {
                  e.currentTarget.children[0].src = urlFor(
                    shuffled.altImg.asset._ref
                  )
                    .width(700)
                    .url()
                } else {
                  e.currentTarget.children[0].src = urlFor(
                    shuffled.cover.asset._ref
                  )
                    .width(700)
                    .url()
                }
              }
            }}
          >
            {shuffled.cover ? (
              <img
                id='artwork'
                className='artwork'
                src={urlFor(shuffled.cover.asset._ref).width(700).url()}
              />
            ) : (
              ''
            )}

            <h3>{shuffled.artist}</h3>
            <h4>{shuffled.albumTitle}</h4>
            {shuffled.altImg ? <h3 className='more'>...</h3> : ''}
          </li>
        </div>
      ) : (
        ''
      )}
      {/* END OF SHUFFLED */}
      <form>
        <input
          className='search-query'
          type='text'
          name=''
          id=''
          value={query}
          placeholder='search'
          onChange={(e) => {
            setQuery(e.target.value)
          }}
        />

        <input
          className='reset-button'
          type='button'
          value='x'
          onClick={() => setQuery('')}
        />
      </form>
      <ul className='albums'>
        {results
          .sort((a, b) => {
            if (a.sortName.toLowerCase() < b.sortName.toLowerCase()) return -1
            if (a.sortName.toLowerCase() > b.sortName.toLowerCase()) return 1
            if (a.albumTitle.toLowerCase() < b.albumTitle.toLowerCase())
              return -1
            if (a.albumTitle.toLowerCase() > b.albumTitle.toLowerCase())
              return 1
            return 0
          })
          .map((album) => {
            const { artist, albumTitle, cover, altImg } = album
            return (
              <li
                className='album'
                id={artist[0]}
                key={album._id}
                onClick={(e) => {
                  if (altImg) {
                    if (
                      urlFor(cover.asset._ref).width(500).url() ===
                      e.currentTarget.children[0].src
                    ) {
                      e.currentTarget.children[0].src = urlFor(
                        altImg.asset._ref
                      )
                        .width(500)
                        .url()
                    } else {
                      e.currentTarget.children[0].src = urlFor(cover.asset._ref)
                        .width(500)
                        .url()
                    }
                  }
                }}
              >
                {cover ? (
                  <img
                    id='artwork'
                    className='artwork'
                    src={urlFor(cover.asset._ref).width(500).url()}
                  />
                ) : (
                  ''
                )}

                <h3>{artist}</h3>
                <h4>{albumTitle}</h4>
                {altImg ? <h3 className='more'>...</h3> : ''}
              </li>
            )
          })}
      </ul>
    </>
  )
}

export default AlbumList
