
export function validateContent(content: string): { valid: boolean; message?: string } {
  if (!content || content.trim().length &lt; 10) {
    return { valid: false, message: '内容至少需要10个字' };
  }
  if (content.length &gt; 500) {
    return { valid: false, message: '内容不能超过500个字' };
  }
  return { valid: true };
}

export function validateImages(images: File[]): { valid: boolean; message?: string } {
  if (images.length &lt; 1) {
    return { valid: false, message: '请至少上传1张图片' };
  }
  if (images.length &gt; 3) {
    return { valid: false, message: '最多只能上传3张图片' };
  }
  for (const image of images) {
    if (!['image/jpeg', 'image/png'].includes(image.type)) {
      return { valid: false, message: '只支持JPG和PNG格式' };
    }
    if (image.size &gt; 5 * 1024 * 1024) {
      return { valid: false, message: '单张图片不能超过5MB' };
    }
  }
  return { valid: true };
}

export function validateOpenDate(date: Date): { valid: boolean; message?: string } {
  const now = new Date();
  const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const maxDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

  if (date &lt; minDate) {
    return { valid: false, message: '开启时间至少为1天后' };
  }
  if (date &gt; maxDate) {
    return { valid: false, message: '开启时间最多为365天后' };
  }
  return { valid: true };
}
