// const BASE_URL = "http://127.0.0.1:8000";

// export const fetchSummary = async () => {
//   const res = await fetch("http://127.0.0.1:8000/api/summary");

//   if (!res.ok) {
//     throw new Error("API not working");
//   }

//   return res.json();
// };


const BASE_URL = "https://protex-ml-backend.onrender.com";

export const fetchSummary = async () => {
  const res = await fetch(`${BASE_URL}/api/summary`);

  if (!res.ok) {
    throw new Error("API not working");
  }

  return res.json();
};

// export const fetchExpenses = async () => {
//   const res = await fetch("http://127.0.0.1:8000/api/expenses");
//   return res.json();
// }


export const fetchExpenses = async () => {
  const res = await fetch(`${BASE_URL}/api/expenses`);
  return res.json();
};