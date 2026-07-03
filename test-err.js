import fetch from 'node-fetch';
fetch('http://localhost:3000/api/download?url=https://youtu.be/b9dM5WUJuX4&format=media/zip').then(r=>r.text()).then(console.log);
