export interface EncryptedContentPayload {
  version: 1;
  algorithm: 'AES-GCM';
  kdf: 'PBKDF2';
  iterations: number;
  salt: string;
  iv: string;
  data: string;
}

const STORAGE_KEY = 'vitepress-encrypted-content-keys';
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const bytesToBase64 = (bytes: Uint8Array): string => btoa(String.fromCharCode(...bytes));

const base64ToBytes = (value: string): Uint8Array => {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const getCrypto = (): Crypto => {
  if (!globalThis.crypto?.subtle) {
    throw new Error('当前浏览器不支持 Web Crypto API');
  }
  return globalThis.crypto;
};

const isEncryptedContentPayload = (value: unknown): value is EncryptedContentPayload => {
  if (!value || typeof value !== 'object') return false;

  const payload = value as Partial<EncryptedContentPayload>;
  return (
    payload.version === 1 &&
    payload.algorithm === 'AES-GCM' &&
    payload.kdf === 'PBKDF2' &&
    Number.isInteger(payload.iterations) &&
    (payload.iterations ?? 0) > 0 &&
    typeof payload.salt === 'string' &&
    typeof payload.iv === 'string' &&
    typeof payload.data === 'string'
  );
};

const deriveKey = async (password: string, payload: EncryptedContentPayload): Promise<CryptoKey> => {
  const crypto = getCrypto();
  const passwordKey = await crypto.subtle.importKey('raw', textEncoder.encode(password), 'PBKDF2', false, ['deriveKey']);

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: base64ToBytes(payload.salt),
      iterations: payload.iterations
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['decrypt']
  );
};

const importStoredKey = async (rawKey: string): Promise<CryptoKey> => {
  return getCrypto().subtle.importKey('raw', base64ToBytes(rawKey), { name: 'AES-GCM' }, false, ['decrypt']);
};

const decryptWithKey = async (payload: EncryptedContentPayload, key: CryptoKey): Promise<string> => {
  if (!isEncryptedContentPayload(payload)) {
    throw new Error('加密内容格式无效');
  }

  const decrypted = await getCrypto().subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: base64ToBytes(payload.iv)
    },
    key,
    base64ToBytes(payload.data)
  );

  return textDecoder.decode(decrypted);
};

const readStoredKeys = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const exportAndStoreKey = async (id: string, key: CryptoKey, payload: EncryptedContentPayload): Promise<void> => {
  try {
    const exported = await getCrypto().subtle.exportKey('raw', key);
    const keys = readStoredKeys();
    keys[`${id}:${payload.salt}`] = bytesToBase64(new Uint8Array(exported));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    localStorage.removeItem('post_passwords');
  } catch {
    // localStorage 不可用时仅要求本次会话重新输入密码。
  }
};

const removeStoredKey = (id: string, payload: EncryptedContentPayload): void => {
  try {
    const keys = readStoredKeys();
    delete keys[`${id}:${payload.salt}`];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // 忽略无法访问 localStorage 的情况。
  }
};

export const decryptStoredContent = async (
  id: string,
  payload: EncryptedContentPayload
): Promise<string | null> => {
  if (!inBrowserContext()) return null;

  const rawKey = readStoredKeys()[`${id}:${payload.salt}`];
  if (!rawKey) return null;

  try {
    const key = await importStoredKey(rawKey);
    return await decryptWithKey(payload, key);
  } catch {
    removeStoredKey(id, payload);
    return null;
  }
};

export const unlockContent = async (
  id: string,
  password: string,
  payload: EncryptedContentPayload
): Promise<string> => {
  const key = await deriveKey(password, payload);
  const html = await decryptWithKey(payload, key);
  await exportAndStoreKey(id, key, payload);
  return html;
};

const inBrowserContext = (): boolean => typeof window !== 'undefined' && typeof localStorage !== 'undefined';
