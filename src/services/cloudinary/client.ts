import { buildUrl } from "cloudinary-build-url";

type BuildImageOptions = {
  publicId: string;
  transformations?: Parameters<typeof buildUrl>[1];
};

export function getCloudinaryUrl({
  publicId,
  transformations,
}: BuildImageOptions) {
  return buildUrl(publicId, {
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo",
    },
    transformations,
  });
}
