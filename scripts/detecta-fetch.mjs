import 'dotenv/config';
import https from 'node:https';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { DEFAULT_FILE, ENDPOINT, makeSnapshot } from './detecta-data.mjs';

async function main() {
  const apiKey = process.env.DETECTA_API_KEY;
  if (!apiKey) throw new Error('Configure DETECTA_API_KEY no .env do backend');
  // The source server can terminate compressed responses prematurely.
  const payload = await new Promise((resolve, reject) => {
    const request = https.get(ENDPOINT, {
      headers: { 'X-API-Key': apiKey, 'Accept-Encoding': 'identity', Connection: 'close' },
    }, response => {
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Detecta Interações respondeu HTTP ${response.statusCode}`));
        return;
      }
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { body += chunk; });
      response.on('error', () => reject(new Error('Resposta incompleta da API')));
      response.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch { reject(new Error('Resposta JSON inválida da API')); }
      });
    });
    const deadline = setTimeout(() => request.destroy(new Error('Tempo limite da API excedido')), 30_000);
    request.on('close', () => clearTimeout(deadline));
    request.on('error', () => reject(new Error('Falha ao consultar a API Detecta Interações')));
  });
  const snapshot = makeSnapshot(payload);
  await mkdir(dirname(DEFAULT_FILE), { recursive: true });
  await writeFile(DEFAULT_FILE, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
  console.log(`Snapshot validado salvo em ${DEFAULT_FILE}`);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
