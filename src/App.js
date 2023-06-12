import './App.css';
import { useEffect, useState, createContext} from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Theatre from '../src/components/Theatre.js'
import Movies from '../src/components/Movies.js';
import { ChakraProvider } from '@chakra-ui/react'
import ShowDetails from "../src/components/ShowDetails"

export const MovieContext = createContext();

function App() {
  const [apiData, setApiData] = useState({});
  const [selectedTheatre, setSelectedTheatre] = useState({});

  const fetchDetails = async (data) => {
    const result = await fetch(`https://zincubate.in/api/MovieTicketChecker?action=getAllDetails`, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(data),
    }).then(res => res.json());
    
    setApiData(result);
    localStorage.setItem("apiData", JSON.stringify(result));
    localStorage.setItem("movieData", JSON.stringify(apiData.movies));
  }

  useEffect(() => {    
    const data = {
      "user_mail_id": "sample@gmail.com"
    }    
    fetchDetails(data)
  },[])  

  return (
    <ChakraProvider>
      <MovieContext.Provider value={{ apiData, setApiData, selectedTheatre, setSelectedTheatre }}>
        <div className="App">        
          <Router>
            <Routes>
              <Route path='/' element={< Theatre />}></Route>
              {/* <Route path='/theatres' element={< Theatre />}></Route> */}
              <Route path='/movies' element={< Movies />}></Route>
              <Route path='/showDetails' element={< ShowDetails />}></Route>
            </Routes>
          </Router>
        </div>
      </MovieContext.Provider>
    </ChakraProvider>
  );
}

export default App;

// export const useMovieData = () => useContext(MovieContext);
// export {MovieContext}
