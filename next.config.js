// Intercept Windows EPERM file-locking on .next/trace
if (process.platform === 'win32') {
  const fs = require('fs');
  const originalOpenSync = fs.openSync;
  fs.openSync = function (filePath, flags, mode) {
    try {
      return originalOpenSync.apply(this, arguments);
    } catch (err) {
      if (err && (err.code === 'EPERM' || err.code === 'EBUSY') && typeof filePath === 'string' && filePath.includes('trace')) {
        try {
          return originalOpenSync.call(fs, '\\\\.\\NUL', flags);
        } catch (_) {}
      }
      throw err;
    }
  };

  const originalOpen = fs.open;
  fs.open = function (filePath, flags, mode, callback) {
    const cb = typeof mode === 'function' ? mode : callback;
    return originalOpen.call(this, filePath, flags, mode, (err, fd) => {
      if (err && (err.code === 'EPERM' || err.code === 'EBUSY') && typeof filePath === 'string' && filePath.includes('trace')) {
        return originalOpen.call(fs, '\\\\.\\NUL', flags, typeof cb === 'function' ? cb : () => {});
      }
      if (typeof cb === 'function') {
        cb(err, fd);
      }
    });
  };
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  webpack: (config, { dev }) => {
    // Use memory cache during development to prevent Windows .pack.gz ENOENT cache errors
    if (dev) {
      config.cache = {
        type: 'memory',
      };
    }
    return config;
  },
};

module.exports = nextConfig;

