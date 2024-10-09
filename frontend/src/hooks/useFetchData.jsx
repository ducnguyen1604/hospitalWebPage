import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authContext } from "../context/AuthContext";
import { token } from "../config";

const useFetchData = (url) => {
  // const { token } = useContext(authContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log('Fetch response received:', res);
        // const errorText = await res.text();
        // console.log(errorText)

        // Check if the response is ok before parsing
        if (!res.ok) {
          // Read the response body as text to capture error details
          const errorText = await res.text();
          throw new Error(`Error ${res.status}: ${errorText}`);
        }
        //  // Parse response body as JSON once
        //  console.log('Attempting to parse JSON'); // Log before parsing
        const result = await res.json();
        //  console.log('test test test', result);

        if (!res.ok) {
          throw new Error(result.message + ":(");
        }
        setData(result.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    };
    fetchData();
  }, [url]);

  return {
    data,
    setData,
    loading,
    error,
  };
};

export default useFetchData;
