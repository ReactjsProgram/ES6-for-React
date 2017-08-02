import axios from 'axios'

const id = "YOUR_CLIENT_ID";
const sec = "YOUR_SECRET_ID";
const params = `?client_id=${id}&client_secret=${sec}`;

async function getProfile (username) {
  try {
    const user = await axios.get(`https://api.github.com/users/${username}${params}`)
    return user.data;
  } catch (e) {
    console.warn("Error in getProfile:", e)
  } 
}

function getRepos (username) {
  return axios.get(`https://api.github.com/users/${username}/repos${params}&per_page=100`);
}

function getStarCount (repos) {
  return repos.data.reduce((count, repo) => count + repo.stargazers_count, 0);
}

function calculateScore (profile, repos) {
  const followers = profile.followers;
  const totalStars = getStarCount(repos);

  return (followers * 3) + totalStars;
}

function handleError (error) {
  console.warn(error);
  return null;
}

async function getUserData (player) {
  try {
    const data = await Promise.all([getProfile(player),getRepos(player)])
    const profile = data[0];
    const repos = data[1];
    return {
      profile,
      score: calculateScore(profile, repos)
    }
  } catch (e) {
    console.warn("Error in getUserData:", e)
  }

}

function sortPlayers (players) {
  return players.sort((a,b) => b.score - a.score);
}


export async function battle (players) {
  try {
    const info = await Promise.all(players.map(getUserData))
    return sortPlayers(info);
  } catch (e) {
    console.warn("Error in api.js battle:", e)
  }
}

export async function fetchPopularRepos (language){
    var encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`);

    try {
      const response = await axios.get(encodedURI)
      return response.data.items;
    } catch (e) {
      console.warn("Error in fetchPopularRepos:", e)
    }
  }
