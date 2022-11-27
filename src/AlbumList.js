import React, { useState, useEffect } from 'react'
import imageUrlBuilder from '@sanity/image-url'
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

  useEffect(() => {
    getAlbums()
  }, [])

  const getAlbums = async () => {
    const response = await fetch(url)
    const albums = await response.json()
    setAlbums(albums.result)
  }

  return (
    <>
      {albums.length > 0 ? (
        <>
          <nav>
            <ul className="links">
              <li>
                <a href="#A">A-F</a>
              </li>
              <li>
                <a href="#G">G-L</a>
              </li>
              <li>
                <a href="#M">M-S</a>
              </li>
              <li>
                <a href="#T">T-Z</a>
              </li>
            </ul>
          </nav>
          <h1 id="A" className="count">
            {albums.length} Albums
          </h1>
        </>
      ) : (
        <div className="lds-dual-ring"></div>
      )}

      {/* List of albums */}
      <ul>
        {albums
          .sort((a, b) => {
            if (a.artist.toLowerCase() < b.artist.toLowerCase()) return -1
            if (a.artist.toLowerCase() > b.artist.toLowerCase()) return 1
            if (a.albumTitle.toLowerCase() < b.albumTitle.toLowerCase())
              return -1
            if (a.albumTitle.toLowerCase() > b.albumTitle.toLowerCase())
              return 1
            return 0
          })
          .map((user) => {
            const { artist, albumTitle, cover, altImg } = user
            return (
              <li
                id={artist[0]}
                key={user._id}
                onClick={(e) => {
                  if (altImg) {
                    if (
                      urlFor(cover.asset._ref).width(500).url() ==
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
                  console.log(e.currentTarget.children[0].src)
                  console.log(urlFor(cover.asset._ref).width(500).url())
                }}
              >
                {cover ? (
                  <img
                    id="artwork"
                    className="artwork"
                    src={urlFor(cover.asset._ref).width(500).url()}
                  />
                ) : (
                  ''
                )}

                <h3>{artist}</h3>
                <h4>{albumTitle}</h4>
                {altImg ? <h3 className="more">...</h3> : ''}
              </li>
            )
          })}
      </ul>
    </>
  )
}

export default AlbumList
