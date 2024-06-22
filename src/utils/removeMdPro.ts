import removeMd from 'remove-markdown';

export const removeMdPro = (str: string) => {
  return removeMd(str.replace(/```.*?```/gs, ''))
    .trim()
    .split(/\r\n|\n|\r/)
    .slice(1)
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/:::.*?:::/gs, '')
    .trim();
};
