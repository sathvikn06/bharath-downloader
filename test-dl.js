import abdl from 'ab-downloader';
async function test() {
  const info = await abdl.youtube('https://youtu.be/b9dM5WUJuX4');
  console.log(info);
}
test();
