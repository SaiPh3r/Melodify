import React, { useState, useEffect } from "react";
import axios from "axios";

const CLIENT_ID = "969ff343ba0442628a2c959d801748bb";
const CLIENT_SECRET = "980e58c4e32f4500aabfb371e6055885";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

function Heading() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getAccessToken() {
    const response = await axios.post(
      TOKEN_URL,
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  }

  async function fetchPlaylist(mood) {
    setLoading(true);
    setPlaylist(null);
    const token = await getAccessToken();
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${mood}&type=playlist&limit=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setPlaylist(response.data.playlists.items[0]);
    setLoading(false);
  }

  useEffect(() => {
    if (selectedMood) {
      fetchPlaylist(selectedMood);
    }
  }, [selectedMood]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <h1 className="text-center text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
        Welcome TO Melodify
      </h1>

      <div className="flex flex-col justify-center items-center border-4 w-3/5 min-h-[40vh] mt-6 rounded-xl shadow-xl bg-white p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          What’s the soundtrack of your mood today?
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {["Happy Mood", "Calm", "Sad", "Motivational"].map((mood) => (
            <button
              key={mood}
              className="text-lg font-medium px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md cursor-pointer transition duration-300 hover:scale-105"
              onClick={() => setSelectedMood(mood)}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="mt-6 flex flex-col items-center text-gray-700 text-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          <p className="mt-2">Fetching your playlist...</p>
        </div>
      )}

      {playlist && !loading && (
        <div className="mt-8 p-6 border w-3/5 bg-white rounded-xl shadow-2xl flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-gray-900">{playlist.name}</h2>
          <img
            src={playlist.images[0]?.url}
            alt="Playlist Cover"
            className="w-64 h-64 mt-4 rounded-xl shadow-lg transform hover:scale-105 transition duration-300"
          />
          <a
            href={playlist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-lg font-semibold text-blue-600 hover:underline"
          >
            🎵 Listen on Spotify
          </a>
        </div>
      )}
    </div>
  );
}

export default Heading;