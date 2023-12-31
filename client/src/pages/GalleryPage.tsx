import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import EventPage from './EventPage';
import '../tailwind.css';
import './GalleryPage.css';


interface Image {
  url: string
  width: Number
  height: Number
}
interface Event {
  name: string,
  date: string,
  time: string,
  url: string,
  images_url: string
}
interface Artist {
    id: string,
    name: string,
    image: Image[],
    ticket: Event[]
}

function fetchArtistList() {
    const [artistList, setArtistList] = useState<Artist[] | null>(null);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/spotify/v0/artist', { withCredentials: true });
                console.log("gallery", response.data)
                setArtistList(response.data);
            } catch (error) {
                console.error('Error fetching artist data:', error);
            }
        };

        fetchArtistData();
    }, []);

    const handleMouseEnter = (artist: Artist) => {
      setSelectedArtist(artist);
    };
  
    const handleMouseLeave = () => {
      setSelectedArtist(null);
    };
    
    if (artistList !== null){
      return (
        <div className = "flex justify-center w-full">
           <ul id= "artistlist" role="list" className="artistlist">
            {artistList.map((artist) => (
              <li key={artist.id} className="flex items-center gap-x-6 py-5" onMouseEnter={() => handleMouseEnter(artist)}
              onMouseLeave={handleMouseLeave}>
                <div id="artist-box" className="flex min-w-0 max-w-20 gap-x-4">
                  <img id="artist-img"className="h-24 w-24 rounded-full bg-gray-50 mr-3" src={artist.image[1].url} alt="artist_img" />
                  <div  id="artist-info" className="min-w-3 flex-auto">
                    <p id="artist-name" className="text-3xl font-semibold leading-16 text-gray-900 w-180">{artist.name}</p>
                    {selectedArtist === artist && (
                      <div className="popup-box">
                      <p className='intro'>Recent concert for {artist.name}</p>
                        <div>
                          {artist.ticket.map((ticket, index) => (
                            <div id="concert" key={index}>
                              {ticket !== null ? (
                                // Access event properties here, e.g., ticket.events[0].date
                                <ol id="ticket-info">
                                  <div className="blank-line1"></div>
                                  <li className="time">{index+1}. {ticket.name}</li>
                                  <p>{ticket.date} {ticket.time}</p>
                                  <a className="button" href={ticket.url} target="_blank">
                                    <button className='ticket-button'>click me to get ticket!</button>
                                  </a>
                                  <div className="blank-line"></div>
                                </ol>
                              ):(
                                <p>no info</p>
                              )
                            }
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>  
        </div>
      )
    }
    else{
      return (
        <div className='gallery-loading'>
          <p className='loading'>
            More Patience!
          </p>
          <p className='ld'>
          Your favorite singers are coming to you ...
          </p>

        </div>
      )
    }
    
}
export default fetchArtistList;
 