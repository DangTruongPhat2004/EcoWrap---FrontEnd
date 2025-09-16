import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-white border-b border-[#BDBDBD] h-20">
      <div className="max-w-[1280px] mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          <Link to="/" className="flex items-center">
            <div className="w-[124px] h-[66px] bg-gray-200 rounded flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">EcoWrap</span>
            </div>
          </Link>

          <nav className="flex items-center space-x-10">
            <Link
              to="/"
              className="text-black text-[16px] font-normal hover:text-green-600 transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              to="/products"
              className="text-black text-[16px] font-normal hover:text-green-600 transition-colors"
            >
              Sản phẩm
            </Link>
            <Link
              to="/design"
              className="text-black text-[16px] font-normal hover:text-green-600 transition-colors"
            >
              Thiết kế
            </Link>
            <Link
              to="/collections"
              className="text-black text-[16px] font-normal hover:text-green-600 transition-colors"
            >
              Bộ sưu tập
            </Link>
            <Link
              to="/about"
              className="text-black text-[16px] font-normal hover:text-green-600 transition-colors"
            >
              Về chúng tôi
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            {/* Notification */}
            <div className="relative">
              <div className="w-11 h-11 bg-[rgba(168,213,186,0.2)] rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#4B5563]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 15l5-5 5 5"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#027534] text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </div>
            </div>

            {/* Cart */}
            <div className="relative">
              <div className="w-11 h-11 bg-[rgba(168,213,186,0.2)] rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#8B6F47]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#8B6F47] text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </div>
            </div>

            {/* Login/Register */}
            <Link
              to="/login"
              className="text-[#027534] text-[16px] font-normal hover:underline"
            >
              Đăng nhập/ Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
