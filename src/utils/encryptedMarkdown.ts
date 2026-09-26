import { createCipheriv, pbkdf2Sync, randomBytes, createHash } from 'node:crypto';
import type { EncryptedContentPayload } from './encryption.ts';

const ENCRYPTION_ITERATIONS = 310_000;

const encryptContentHtml = (html: string, password: string, id: string): EncryptedContentPayload => {
  const salt = createHash('sha256').update(id).digest().subarray(0, 16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(password, salt, ENCRYPTION_ITERATIONS, 32, 'sha256');
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(html, 'utf8'), cipher.final()]);
  const encrypted = Buffer.concat([ciphertext, cipher.getAuthTag()]);

  return {
    version: 1,
    algorithm: 'AES-GCM',
    kdf: 'PBKDF2',
    iterations: ENCRYPTION_ITERATIONS,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    data: encrypted.toString('base64')
  };
};

/**
 * 将 password 文章的渲染 HTML 在构建阶段加密，正文只以密文进入静态产物。
 * 保留公开标题与 PostMeta，其余内容由 Password 在浏览器中解密。
 */
export const installEncryptedMarkdown = (md: any): void => {
  md.core.ruler.push('vitepress_encrypt_protected_content', (state: any) => {
    const frontmatter = state.env?.frontmatter as Record<string, unknown> | undefined;
    const password = frontmatter?.password;
    if (!password) return;

    const bodyTokens = [...state.tokens];
    if (bodyTokens[0]?.type === 'heading_open' && bodyTokens[0]?.tag === 'h1') {
      const headingEndIndex = bodyTokens.findIndex((t: any) => t.type === 'heading_close' && t.tag === 'h1');
      if (headingEndIndex > 0) bodyTokens.splice(0, headingEndIndex + 1);
    }

    const renderedHtml = md.renderer
      .render(bodyTokens, md.options, state.env)
      .replace(/<PostMeta\s*\/?>/g, '')
      .trim();
    const title = String(frontmatter.title || state.env?.title || '加密文章');
    const id = String(frontmatter.id || state.env.relativePath || title);
    const payload = encryptContentHtml(renderedHtml, String(password), id);

    frontmatter.encryption = payload;
    delete frontmatter.password;

    state.env.excerpt = '';
    state.env.headers = [];

    const placeholder = new state.Token('html_block', '', 0);
    placeholder.content = [
      '<Password :payload="$frontmatter.encryption">',
      `  <h1>${md.utils.escapeHtml(title)}</h1>`,
      '  <PostMeta />',
      '</Password>'
    ].join('\n');
    state.tokens = [placeholder];
  });
};
