export default function ShopFooter() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="container mx-auto py-10">
        <div className="flex justify-between">
          <div>
            <h3 className="font-bold mb-3">Shop</h3>
            <p className="text-sm text-gray-400">
              Best products for you.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-3">Support</h3>

            <ul className="space-y-2 text-sm text-gray-400">
              <li>Help Center</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}