import { useState, useEffect } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice =
        /android|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent) ||
        window.innerWidth < 768; // Opcional: Detectar por tamaño de pantalla

      setIsMobile(isMobileDevice);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return isMobile;
};

export default useIsMobile;
