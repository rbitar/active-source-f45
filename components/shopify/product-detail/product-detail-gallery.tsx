'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiImageLine, RiCloseLine, RiZoomInLine } from '@remixicon/react';

interface ProductImage {
  url: string;
  altText?: string;
}

interface ProductDetailGalleryProps {
  images: ProductImage[];
  selectedImageIndex?: number;
  onImageSelect?: (index: number) => void;
}

const ProductDetailGallery: React.FC<ProductDetailGalleryProps> = ({
  images,
  selectedImageIndex = 0,
  onImageSelect,
}) => {
  const selectedImage = selectedImageIndex;
  const setSelectedImage = onImageSelect || (() => {});
  const [zoomOpen, setZoomOpen] = useState(false);

  const currentImage = images[selectedImage];

  return (
    <>
      <div>
        {/* Main Image */}
        <div
          className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative group cursor-zoom-in"
          onClick={() => images.length > 0 && setZoomOpen(true)}
        >
          {currentImage ? (
            <>
              <img
                src={currentImage.url}
                alt={currentImage.altText || 'Product image'}
                className="w-full h-full object-cover"
              />
              {/* Zoom hint */}
              <div className="absolute bottom-3 right-3 bg-white/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <RiZoomInLine size={16} className="text-gray-700" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <RiImageLine size={64} />
            </div>
          )}
        </div>

        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? 'border-black'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.altText || 'Product thumbnail'}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom overlay */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {zoomOpen && currentImage && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setZoomOpen(false)}
                />

                {/* Close button */}
                <motion.button
                  className="fixed top-4 right-4 z-[60] bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setZoomOpen(false)}
                  aria-label="Close zoom"
                >
                  <RiCloseLine size={24} />
                </motion.button>

                {/* Zoomed image */}
                <motion.div
                  className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-none p-4"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                >
                  <img
                    src={currentImage.url}
                    alt={currentImage.altText || 'Product image'}
                    className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default ProductDetailGallery;
