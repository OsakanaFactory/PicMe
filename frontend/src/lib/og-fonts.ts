const OUTFIT_BOLD_URL =
  'https://fonts.gstatic.com/s/outfit/v15/QGYyz_MVcBeNP4NjuGObqx1XmO1I4deyC4E.ttf';

const NOTO_SANS_JP_BOLD_URL =
  'https://fonts.gstatic.com/s/notosansjp/v56/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk75s.ttf';

export async function loadOutfitFont(): Promise<ArrayBuffer> {
  const res = await fetch(OUTFIT_BOLD_URL);
  return res.arrayBuffer();
}

export async function loadNotoSansJPFont(): Promise<ArrayBuffer> {
  const res = await fetch(NOTO_SANS_JP_BOLD_URL);
  return res.arrayBuffer();
}
