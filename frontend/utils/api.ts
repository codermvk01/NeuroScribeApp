
export async function uploadAudio(uri: string, metadata: object) {
  const formData = new FormData();
  formData.append('file', {
    uri,
    name: 'voice-test.wav',
    type: 'audio/wav',
  } as any);
  formData.append('metadata', JSON.stringify(metadata));

  const API_URL = 'https://your-backend.com/api/upload'; // Replace with your API endpoint

  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to upload');
  }

  return response.json();
}
