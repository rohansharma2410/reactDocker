import axios from 'axios';

// Base URL for the API
const BASE_URL = "http://103.194.8.73:9090";

// Create an Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Set the Authorization header for the Axios instance
const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Function to login and get a token and user ID
export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post('/login', { username, password });
    const data = response.data;
    
    if (data.access_token && data.user_id) {
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('userId', data.user_id);
      localStorage.setItem('role',data.role);
      setAuthToken(data.access_token);
    }

    return data;
  } catch (error) {
    console.error('Error during login:', error.response?.data || error.message);
    throw error;
  }
};

// Function to logout and clear the token and user ID
export const logout = async () => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setAuthToken(null);
  } catch (error) {
    console.error('Error during logout:', error.message);
  }
};

// Function to get stored credentials
export const getStoredCredentials = () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    return {
      authToken,
      userId,
    };
  } catch (error) {
    console.error('Error retrieving stored credentials:', error.message);
    return null;
  }
};

// Function to get data from an API endpoint
export const getData = async (endpoint) => {
  try {
    const { authToken } = getStoredCredentials();

    if (!authToken) {
      throw new Error('No auth token found');
    }

    const response = await axiosInstance.get(endpoint, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.response?.data || error.message);
    throw error;
  }
};

// Function to post data to an API endpoint
export const postData = async (endpoint, data) => {
  try {
    const { authToken } = getStoredCredentials();

    if (!authToken) {
      throw new Error('No auth token found');
    }

    const response = await axiosInstance.post(endpoint, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error posting data:', error.response?.data || error.message);
    throw error;
  }
};

// Function to get logs
export const getLogs = async (userId ,ApiName,start_date,end_date  ) => {
  try {
    const { authToken } = getStoredCredentials();

    if (!authToken) {
      throw new Error('No auth token found');
    }

    const response = await axiosInstance.post('/ApiLog', { user_id: userId , ApiName :ApiName ,  start_date:start_date,
      end_date: end_date, }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    console.log(response.data, "Log Data");
    return response.data;

  } catch (error) {
    console.error('Error fetching logs:', error.response?.data || error.message);
    throw error;
  }
};


export const getLogsAll = async (userId,start_date,end_date) => {
  try {
    const { authToken } = getStoredCredentials();

    if (!authToken) {
      throw new Error('No auth token found');
    }

    const response = await axiosInstance.post('/ApiAll', { user_id: userId ,
      start_date:start_date,
      end_date: end_date,
     }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    console.log(response.data, "Log Data");
    return response.data;

  } catch (error) {
    console.error('Error fetching logs:', error.response?.data || error.message);
    throw error;
  }
};

export const addCost = async (costData) => {
  try {
    const { authToken } = getStoredCredentials();

    if (!authToken) {
      throw new Error('No auth token found');
    }

    const response = await axiosInstance.post('/add_cost', costData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error adding cost:', error.response?.data || error.message);
    throw error;
  }
};

export const user_names = async () => {
  try {
    const { authToken } = getStoredCredentials();

    if (!authToken) {
      throw new Error('No auth token found');
    }

    const response = await axiosInstance.get('/user_names', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('error', error.response?.data || error.message);
    throw error;
  }
};

export const api_names = async () => {
  try {
    const { authToken } = getStoredCredentials();

    if (!authToken) {
      throw new Error('No auth token found');
    }

    const response = await axiosInstance.get('/api_names', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error :', error.response?.data || error.message);
    throw error;
  }
};



export const signup = async (name, password) => {
  try {
    const response = await axiosInstance.post('/login', {  name: name,
      password: password,
      role: "Client" });
    const data = response.data;
    
    return data;
  } catch (error) {
    console.error('Error during signup:', error.response?.data || error.message);
    throw error;
  }
}; 
export const get_api_cost_data = async (startDate, endDate) => {
  try {
    const { authToken } = getStoredCredentials();

    if (!authToken) {
      throw new Error('No auth token found');
    }

    // Build query parameters based on provided dates
    const params = {};
    if (startDate) {
      params.start_date = startDate;
    }
    if (endDate) {
      params.end_date = endDate;
    }

    const response = await axiosInstance.get('/get_api_cost_data', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params, // Pass the query parameters
    });

    return response.data;
  } catch (error) {
    console.error('Error :', error.response?.data || error.message);
    throw error;
  }
};


export const apicost = async () => {
  try {
    const { authToken } = getStoredCredentials();

    if (!authToken) {
      throw new Error('No auth token found');
    }

    const response = await axiosInstance.get('/getApiCost', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error :', error.response?.data || error.message);
    throw error;
  }
};