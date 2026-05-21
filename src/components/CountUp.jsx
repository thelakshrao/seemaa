import { useEffect, useState, useRef } from "react";

const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          let increment = end / (duration / 16);

          const updateCounter = () => {
            start += increment;
            if (start < end) {
              setCount(Math.ceil(start));
              requestAnimationFrame(updateCounter);
            } else {
              setCount(end);
            }
          };

          updateCounter();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count}
    </span>
  );
};

export default CountUp;
