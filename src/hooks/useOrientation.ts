import { useState, useEffect } from "react";

type Orientation = "portrait" | "landscape";

const useOrientation = (): Orientation => {
  const getOrientation = (): Orientation =>
    window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape";

  const [orientation, setOrientation] = useState<Orientation>(getOrientation);

  useEffect(() => {
    const handleResize = () => {
      setOrientation(getOrientation());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return orientation;
};

export default useOrientation;
