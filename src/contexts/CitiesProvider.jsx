import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";

const citiesContext = createContext();
const BASE_URL = "http://localhost:4500";

const initialState = {
  cities: [],
  isloading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isloading: true };
    case "cities/loaded":
      return {
        ...state,
        isloading: false,
        cities: action.payload,
        error: "",
      };
    case "city/loaded":
      return {
        ...state,
        isloading: false,
        currentCity: action.payload,
        error: "",
      };
    case "city/add":
      return {
        ...state,
        isloading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
        error: "",
      };
    case "city/delete": {
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isloading: false,
        currentCity: {},
        error: "",
      };
    }
    case "rejected":
      return {
        ...state,
        isloading: false,
        error: action.payload,
      };
    default:
      throw new Error("invalid action call");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isloading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function loadCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        console.log(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({ type: "rejected", payload: "Error fetching data.." });
      }
    }
    loadCities();
  }, []);

  const getCity = useCallback(
    function getCity(id) {
      if (currentCity.id === id) return;
      async function loadCities() {
        dispatch({ type: "loading" });
        try {
          const res = await fetch(`${BASE_URL}/cities/${id}`);
          const data = await res.json();
          dispatch({ type: "city/loaded", payload: data });
        } catch {
          dispatch({ type: "error", payload: "error fetching the city" });
        }
      }
      loadCities();
    },
    [currentCity.id]
  );

  function addcity(city) {
    async function loadCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`, {
          method: "POST",
          body: JSON.stringify(city),
          headers: {
            "Content-type": "application/json",
          },
        });
        const data = await res.json();
        dispatch({ type: "city/add", payload: data });
      } catch {
        dispatch({ type: "error", payload: "error adding the city" });
      }
    }
    loadCities();
  }

  function deletecity(id) {
    async function loadCities() {
      dispatch({ type: "loading" });
      try {
        await fetch(`${BASE_URL}/cities/${id}`, {
          method: "DELETE",
        });
        dispatch({ type: "city/delete", payload: id });
      } catch {
        console.log("Error fetching data..");
      }
    }
    loadCities();
  }

  return (
    <citiesContext.Provider
      value={{
        cities,
        isloading,
        currentCity,
        getCity,
        addcity,
        deletecity,
        error,
      }}
    >
      {children}
    </citiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(citiesContext);
  if (context === undefined)
    throw new Error("Cities were accessed outside the provider");
  return context;
}

export { CitiesProvider, useCities };
