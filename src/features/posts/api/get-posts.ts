import axios from "axios";

export async function getPosts() {
  const res = await axios.get("/api/posts");

  return res.data;
}