import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

// Replace the fetch/proxy logic with res.redirect
const oldLogic = `        const response = await fetch(mediaUrl);
        if (!response.ok) throw new Error(\`Failed to fetch media from proxy: \${response.statusText}\`);
        
        const stream = response.body;
        
        // Pipe the web stream to express response
        const reader = stream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();`;

const newLogic = `        // Redirect the client to the actual media URL to download directly.
        // This avoids server bandwidth limits and Vercel serverless timeouts (10s max).
        return res.redirect(mediaUrl);`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync('server.ts', content);
console.log("Updated server.ts logic");
