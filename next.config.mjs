/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "picsum.photos",
      "cdn.example.com",
      "test.com",
      "localhost",
      "mybiasphoto-upload.s3.ap-northeast-2.amazonaws.com",
    ],
  },
};

export default nextConfig;
