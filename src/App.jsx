import { useState } from 'react';
import {Container,Box, Typography, TextField } from '@mui/material';
import { LoadingButton } from "@mui/lab";


const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_API_KEY}&lang=es&q=`;

function App() {

  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({error: false, message: ""});
  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    condition: "",
    conditionText: "",
    icon: "",
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    setLoading(true);

    setError({
      error: false,
      message: "",
    });

    try {

      if (!city.trim()) throw{ message: "El campo ciudad es obligatorio" }

      const resp = await fetch(`${API_WEATHER}${city}`);
      const data = await resp.json();
      
      if (data.error) throw{ message: data.error.message };

      setWeather({
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        condition: data.current.condition.code,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon,
      })
      
    } catch (error) {
      console.log(error);

      setError({
        error: true,
        message: error.message
      })

    } finally{
      setLoading(false);
    }

  }
  
  return (
    <Container maxWidth="sm" sx={{height: "100vh" , p: 4, bgcolor: "#f2f2f2" }} className='body'>
      <Typography variant="h3" component="h1" color="initial" align="center" gutterBottom mt={3} mb={5}>
        Weather App
      </Typography>

      <Box sx={{display: "grid", gap: 4, }} component="form" autoComplete='off' onSubmit={handleSubmit}  >
        <TextField
          id="city"
          label="Ciudad"          
          variant="filled"
          size="small"
          required         
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
          
        />
        <LoadingButton type="submit" variant="contained" loading={loading} loadingIndicator="Cargando🌞.🌞.🌞" >
          Buscar
        </LoadingButton>

      </Box>

      {weather.city && (
          <Box sx={{mt: 4, mb: 5, display: "grid", gap: 3, textAlign: "center"}}  >
            <Typography variant='h4' component='h2' >
              {weather.city} {weather.country}
            </Typography>

            <Box component="img" alt={weather.conditionText} src={weather.icon} sx={{margin: "0 auto" }}
            />

            <Typography variant='h5' component='h3' >
              {weather.temperature} °C
            </Typography>

            <Typography variant='h6' component='h4' >
              {weather.conditionText} 
            </Typography>

          </Box>
        )}

      <Typography
        textAlign="center"
        sx={{ mt: 2,  fontSize: "10px" }}
      >
        Powered by:{" "}
        <a
          href="https://www.weatherapi.com/"
          title="Weather API"
        >
          WeatherAPI.com
        </a>
      </Typography>


    </Container>
  )
}

export default App
