import dynamic from 'next/dynamic';
import { ImageProps } from 'next/image';

/**
 * Dynamic import, resolves if exported static app (vf-features) or app running with server (vf-mvp).
 * 'next/image' can't be used with exported apps for image optimization, use 'next-image-export-optimizer' module instead.
 * 'next-image-export-optimizer' has its custom loader configs in apps/vf-features/next.config.js.
 */
const ImageComponent = dynamic(() => {
  const withServer = process.env.NEXT_PUBLIC_WITH_SERVER || false;

  if (withServer) {
    return import('next/image').then(mod => mod);
  }

  return import('next-image-export-optimizer').then(mod => mod);
});

export default function CustomImage(props: ImageProps) {
  return <ImageComponent {...props} />;
}
