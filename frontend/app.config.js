import 'dotenv/config';

export default {
  expo: {
    name: "NeuroScribe",
    slug: "NeuroScribe",
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
    },
  },
};