import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const url = `http://localhost:5000/auth/login/success`; 
        const response = await axios.get(url, { withCredentials: true });

        if (response.data.token) {
          localStorage.setItem('token', response.data.token); 
          navigate("/admin/index"); 
        } else {
          setError("No token received");
          navigate("/login"); 
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        setError("Authentication error");
        navigate("/login"); 
      } finally {
        setLoading(false); 
      }
    };

    getUser();
  }, [navigate]); 

  return (
    <div>
      {loading ? "Loading..." : error ? `Error: ${error}` : "Redirecting..."}
    </div>
  );
};

export default GoogleAuthSuccess;
