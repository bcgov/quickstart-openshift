import React, { useEffect } from 'react';

const SilentCheckSso = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = 'parent.postMessage(location.href, location.origin)';

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
    </>
  );
};

export default SilentCheckSso;
