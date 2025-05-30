export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Shop</h3>
            <p className="text-gray-300 text-sm mt-1">
              Your one-stop shop for all products
            </p>
          </div>

          <div className="flex flex-col text-center md:text-right">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Shop. All rights reserved.
            </p>
            <p className="text-gray-300 text-sm mt-1">
              Built with Next.js and Redux and powered by Socket.io and Express.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
