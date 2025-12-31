const IMGBB_API_KEY = '377ef6e25f62e80aa641fe7ef5644636';

export const uploadImageToImgBB = async (base64Image: string): Promise<string | null> => {
  try {
    // Remove the Data URI prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = base64Image.replace(/^data:image\/[a-z]+;base64,/, "");

    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64Data);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data && data.success) {
      return data.data.url;
    } else {
      console.error('ImgBB Upload Error:', data);
      return null;
    }
  } catch (error) {
    console.error('ImgBB Network Error:', error);
    return null;
  }
};