import ImageKit from "imagekit";
const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export default imageKit;
