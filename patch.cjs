const fs = require('fs');
let c = fs.readFileSync('api/index.ts', 'utf8');
c = c.replace(/\/\/ redirect to actual URL[\s\S]*?return res\.redirect\(mediaUrl\);/, `// fetch and pipe the actual URL
       try {
           const mediaResponse = await fetch(mediaUrl, {
               headers: {
                   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
               },
               redirect: 'follow'
           });
           if (mediaResponse.ok && mediaResponse.body) {
               const fileName = format === 'audio/mp3' ? 'audio.mp3' : format === 'image/jpeg' ? 'image.jpg' : 'download.mp4';
               res.header('Content-Type', format);
               res.header('Content-Disposition', \`\${disposition}; filename="\${fileName}"\`);
               Readable.fromWeb(mediaResponse.body).pipe(res);
               return;
           } else {
               return res.status(500).send('Direct fetch failed');
           }
       } catch (e) {
           console.error("Fetch error:", e);
           return res.status(500).send('Fetch error');
       }`);
fs.writeFileSync('api/index.ts', c);
