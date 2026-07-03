import dl from 'btch-downloader';
async function test() {
  const p = await dl.pinterest('https://pin.it/4U1J3Yf');
  console.log(p);
}
test();
