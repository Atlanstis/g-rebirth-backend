import { readFileSync } from 'fs';
import { join } from 'path';

const privateKey = readFileSync(
  join(process.cwd(), `pem/public_key.pem`),
  'utf8',
);

/** 获取 publicKey */
export function getPublicKey() {
  // 去除 PEM 头尾和换行符，并确保其是有效的 Base64 编码
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  const pemContents = privateKey
    .replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\s/g, ''); // 去除所有空白字符
  return pemContents;
}
