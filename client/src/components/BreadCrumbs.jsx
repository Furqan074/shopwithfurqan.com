import { Link, useLocation } from "react-router-dom";

const BreadCrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x)
    .map(decodeURIComponent);
  let breadcrumbPath = "";

  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="breadcrumbs">
      <Link to="/">Home</Link>
      {pathnames.map((name, index) => {
        breadcrumbPath += `/${name}`;
        const isLast = index === pathnames.length - 1;

        return (
          <span key={breadcrumbPath}>
            {" / "}
            {isLast ? name : <Link to={breadcrumbPath}>{name}</Link>}
          </span>
        );
      })}
    </div>
  );
};

export default BreadCrumbs;
