import fetch from 'node-fetch';
async function run() {
  const res = await fetch("http://localhost:3000/api/download?url=https://youtu.be/b9dM5WUJuX4?si=Q-36clQImr718bKR&format=audio/mp3");
  console.log(res.status, res.headers.get('content-disposition'));
  const text = await res.text();
  console.log("Length:", text.length);
  if (text.length < 500) console.log("Content:", text);
}
run();
