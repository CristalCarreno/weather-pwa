// lib/weather.js

export async function getWeatherByCity(city) {
  const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "No se encontró la ciudad solicitada.");
  }
  return data;
}

export async function getWeatherByCoords(lat, lon) {
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data.error || "Error al consultar el clima para tu ubicación.",
    );
  }
  return data;
}
