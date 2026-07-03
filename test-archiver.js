import archiver from 'archiver';
import { Readable } from 'stream';
import fs from 'fs';

async function test() {
  const output = fs.createWriteStream('test.zip');
  const archive = archiver('zip');
  archive.pipe(output);

  const res = await fetch('https://raw.githubusercontent.com/imputnet/cobalt/main/docs/instances.json').catch(() => null);
  if (res && res.body) {
    archive.append(Readable.fromWeb(res.body), { name: 'test.txt' });
  }
  
  await archive.finalize();
  console.log("Archive created.");
}
test();
