import { useTheme } from '../context/ThemeContext';
import Footer from "./Footer";

function NotFound() {
  const { dark } = useTheme();

  return (
    <div>
      <div className="min-h-[60vh] grid place-items-center">
        <div className="text-center">
          <h1 className={`text-5xl font-bold ${dark ? 'text-slate-100' : 'text-slate-900'}`}>404</h1>
          <p className={`mt-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Page not found</p>
        </div>

      </div>

            
      <Footer />
    </div>


  )
}

export default NotFound
