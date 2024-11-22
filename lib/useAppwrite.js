import { Alert } from "react-native";
import { useEffect, useState } from "react";

const useAppwrite = (fn) => {
  const [data, setData] = useState([]); // Estado para almacenar los datos
  const [loading, setLoading] = useState(true); // Estado para gestionar la carga

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fn(); // Llamar a la función pasada como argumento
      setData(res); // Almacenar los datos en el estado
    } catch (error) {
      Alert.alert("Error", error.message); // Mostrar alerta en caso de error
    } finally {
      setLoading(false); // Cambiar el estado de carga a falso
    }
  };

  useEffect(() => {
    fetchData(); // Llamar a fetchData al montar el componente
  }, []);

  const refetch = () => fetchData(); // Función para volver a cargar los datos

  return { data, loading, refetch }; // Retornar datos, estado de carga y función para volver a cargar
};

export default useAppwrite;
