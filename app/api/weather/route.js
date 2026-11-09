// app/api/weather/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const city = searchParams.get("city");

  const API_KEY = process.env.PUBLIC_WEATHER_API_KEY;

  if (!API_KEY) {
    return Response.json(
      { error: "API key no configurada en el servidor" },
      { status: 500 },
    );
  }

  let url;
  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${API_KEY}`;
  } else if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`;
  } else {
    return Response.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return Response.json(
        { error: errorData.message || "Error al consultar el clima" },
        { status: res.status },
      );
    }
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error("Error en fetch a OpenWeatherMap:", err);
    return Response.json(
      { error: "Error de conexión con OpenWeatherMap" },
      { status: 500 },
    );
  }
}
