const CLIENT_ID = "969ff343ba0442628a2c959d801748bb";
const CLIENT_SECRET = "980e58c4e32f4500aabfb371e6055885";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

async function getAccessToken() {
    const response = await axios.post(TOKEN_URL, 
        new URLSearchParams({
            grant_type: "client_credentials"
        }), {
            headers: {
                Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );
    return response.data.access_token;
}

// Function to get playlists based on mood
export async function getMoodPlaylist(mood) {
    const token = await getAccessToken();
    const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${mood}&type=playlist&limit=1`, 
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data.playlists.items[0];  // Get the first playlist result
}