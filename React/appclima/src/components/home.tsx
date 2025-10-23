import './home.css';
import { useState } from 'react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
    main: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  cod: number;
  message?: string;
}

async function buscarCidade(city: string): Promise<WeatherData | null> {
  try {
    const API_KEY = "521609636a3fc6540bd2710cdcd48c8d";
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
    );
    
    const dados: WeatherData = await response.json();
    
    if (dados.cod === 200) {
      return dados;
    } else {
      console.error(`Erro: ${dados.message || "Cidade não encontrada"}`);
      return null;
    }
    
  } catch (error) {
    console.error("Erro na requisição:", error);
    return null;
  }
}

export function Home() {

  const [cidade, setCidade] = useState<string>("");
  const [dadosClima, setDadosClima] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const cliqueNoBotao = async (): Promise<void> => {
    if (!cidade.trim()) {
      alert("Digite o nome de uma cidade!");
      return;
    }

    setLoading(true);
    try {
      const resultado = await buscarCidade(cidade);
      if (resultado) {
        setDadosClima(resultado);
      } else {
        alert("Cidade não encontrada!");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao buscar dados!");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      cliqueNoBotao();
    }
  };

  return(
    <div className='home-container'>
      <div className="divclima">
        <div className='inputebuscar'>

          <input 
            id='cidade' 
            type="text" 
            placeholder="Digite o nome da cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />  
          <button className='buscar' onClick={cliqueNoBotao} disabled={loading}>
            <img className="img-buscar" src='https://www.svgrepo.com/show/488200/find.svg'  />
            {loading ? "Buscando..." : ""}
          </button>
        </div>
        <div className='texts'>
  
          <h2>{dadosClima ? dadosClima.name : "São Paulo"}</h2>
          <p>{dadosClima ? `${Math.round(dadosClima.main.temp)}ºC` : "21ºC"}</p> 
          <div className='grauseicone'>
            <img 
              alt='icone do tempo' 
              src={
                dadosClima 
                  ? `https://openweathermap.org/img/wn/${dadosClima.weather[0].icon}.png`
                  : 'https://openweathermap.org/img/wn/04n.png'
              } 
            /> 
            <p className='previsao'>
              {dadosClima ? dadosClima.weather[0].description : "previsão"}
            </p>  
          </div> 
        </div>
      </div>
    </div>
  );
}