import { REFRESH_TOKEN } from "../constants";
import { getExpirationDate } from "./getExpirationDate";

export const getNewToken = async (id) => {
  try {
    const req = await fetch(REFRESH_TOKEN, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: id }),
    });
    if (req.status === 200) {
      const res = await req.json();
      const tokenExp = getExpirationDate(res.accessToken);

      localStorage.setItem("tokenExp", tokenExp.toString());
    }
  } catch (e) {
    console.error(e);
  }
};
