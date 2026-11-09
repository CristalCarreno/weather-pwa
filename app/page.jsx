"use client";
import { useState, useEffect } from "react";
import { getWeatherByCity, getWeatherByCoords } from "@/lib/weather";
import InstallPrompt from "./components/InstallPrompt";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Carga inmediata del caché offline guardado
  useEffect(() => {
    const cachedWeather = localStorage.getItem("last_weather");
    if (cachedWeather) {
      try {
        setWeather(JSON.parse(cachedWeather));
      } catch (e) {
        console.error("Error al leer caché offline", e);
      }
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    executeFetch(() => getWeatherByCity(city));
  };

  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        executeFetch(() => getWeatherByCoords(latitude, longitude));
      },
      () => setError("Permiso de ubicación denegado.")
    );
  };

  const executeFetch = async (apiCall) => {
    setLoading(true);
    setError("");
    try {
      const data = await apiCall();
      setWeather(data);
      // Guardar para soporte offline
      localStorage.setItem("last_weather", JSON.stringify(data));
    } catch (err) {
      setError(err.message || "Error al obtener datos del clima");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b1329] text-white flex flex-col items-center justify-center p-4">
      {/* Botón flotante para instalar PWA */}
      <div className="w-full max-w-sm flex justify-end mb-2">
        <InstallPrompt />
      </div>

      {/* Contenedor principal idéntico a la referencia visual */}
      <div className="w-full max-w-sm space-y-3">
        {/* Campo de Búsqueda */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Ejemplo: Oaxaca, Madrid..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#14223d] border border-slate-700/60 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-inner"
          />
          <button
            type="submit"
            className="bg-[#00a6fb] hover:bg-sky-500 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-all shadow-md active:scale-95"
          >
            Buscar
          </button>
        </form>

        {/* Botón Geolocalización */}
        <button
          onClick={handleGeoLocation}
          className="w-full bg-[#14223d] hover:bg-[#1c2e50] border border-slate-700/60 py-2.5 rounded-lg text-sky-400 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-98"
        >
          📍 Usar mi ubicación actual
        </button>

        {/* Mensajes de Carga o Error */}
        {loading && <p className="text-slate-400 animate-pulse text-sm text-center py-2">Consultando clima...</p>}
        {error && (
          <p className="text-red-400 font-medium bg-red-950/40 p-3 rounded-lg border border-red-900/60 w-full text-center text-xs">
            {error}
          </p>
        )}

        {/* Tarjeta Visual del Clima (Diseño réplica exacta) */}
        {weather && !loading && (
          <article className="w-full bg-[#192744] border border-slate-700/60 p-6 rounded-2xl shadow-2xl text-center space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              {weather.name}, {weather.sys?.country}
            </h2>

            <div className="flex justify-center items-center gap-2 my-2">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="w-16 h-16 object-contain"
              />
              <span className="text-5xl font-black tracking-tight text-white">
                {Math.round(weather.main.temp)}°C
              </span>
            </div>

            <p className="capitalize text-slate-300 font-medium text-sm">
              {weather.weather[0].description}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-700/60 text-xs text-slate-300">
              <div>
                Humedad: <strong className="text-white font-bold">{weather.main.humidity}%</strong>
              </div>
              <div>
                Viento: <strong className="text-white font-bold">{weather.wind.speed} m/s</strong>
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}