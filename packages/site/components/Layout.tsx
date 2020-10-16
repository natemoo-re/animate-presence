import { FC } from 'react';

const Layout: FC = ({ children }) => {
  return (
    <>
      <div className="layout">{children}</div>
      <style jsx>{`
        .layout {
          max-width: 100vw;
          min-height: 100vh;
          display: grid;
          overflow-x: hidden;
          grid-auto-rows: minmax(0, max-content);
          gap: 1rem;
        }
      `}</style>
    </>
  );
};

export default Layout;
